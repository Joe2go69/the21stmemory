// Deep-Dive page — topic viewer with breadcrumbs, media, and report

const zoomState = {
  scale: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  pointerStartX: 0,
  pointerStartY: 0,
  panStartX: 0,
  panStartY: 0,
  lastPinchDistance: 0
};

function setPageMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function updateTopicPageMeta({ topic, sourceId, fullData }) {
  const title = `${topic.title} | ${fullData.title} — 21st Memory`;
  const description = topic.description || `AI-decoded deep-dive on ${topic.title} from the ${fullData.title} transmission.`;
  const imagePath = topic.topic_image || topic.infographic_image || "images/21.webp";
  const image = new URL(TopicUtils.encodeAssetPath(imagePath), window.location.origin).href;
  const url = `${window.location.origin}${window.location.pathname}?source=${sourceId}&topic=${topic.id}`;

  document.title = title;
  setPageMeta("description", description);
  setPageMeta("og:title", title, "property");
  setPageMeta("og:description", description, "property");
  setPageMeta("og:image", image, "property");
  setPageMeta("og:url", url, "property");
  setPageMeta("twitter:title", title);
  setPageMeta("twitter:description", description);
  setPageMeta("twitter:image", image);
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
    return `
      <a href="deep-dive.html?source=${sourceId}&topic=${entry.id}" class="topic-prev-next__link topic-prev-next__link--${direction}">
        ${direction === "prev" ? `${icon}<span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${entry.title}</span></span>` : `<span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${entry.title}</span></span>${icon}`}
      </a>`;
  };

  return `${navItem(prev, "prev")}${navItem(next, "next")}`;
}

function setupReadingProgress() {
  const bar = document.getElementById("reading-progress");
  const fill = bar?.querySelector(".reading-progress-fill");
  const reportSection = document.getElementById("report-section");
  if (!bar || !fill || !reportSection) return;

  const update = () => {
    const rect = reportSection.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = reportSection.offsetHeight;
    const viewportBottom = window.scrollY + window.innerHeight;
    const start = sectionTop;
    const end = sectionTop + sectionHeight;
    const progress = Math.min(1, Math.max(0, (viewportBottom - start) / (end - start)));
    fill.style.width = `${Math.round(progress * 100)}%`;
    bar.hidden = progress <= 0 || progress >= 1;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function escapeAttr(value) {
  return String(value || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
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

function renderCinematicHero({ breadcrumbs, fullData, topic, sourceId }) {
  const heroImage = TopicUtils.encodeAssetPath((topic.topic_image || topic.infographic_image || '').replace(/\\/g, '/'));
  const readingTime = topic.report ? TopicUtils.estimateReadingTime(topic.report) : '';
  const bgStyle = heroImage
    ? `style="background-image: url('${escapeAttr(heroImage)}')"`
    : '';

  return `
    ${breadcrumbs}
    <div class="deep-dive-hero">
      <div class="deep-dive-hero-bg" ${bgStyle}></div>
      <div class="deep-dive-hero-scrim"></div>
      <div class="deep-dive-hero-content">
        <div class="deep-dive-hero-meta">
          <div class="inline-flex items-center px-4 py-1 rounded-full bg-black/40 text-mem-muted text-xs font-semibold tracking-[2px] border border-white/10">
            ${fullData.title}
          </div>
          ${readingTime ? `<span class="deep-dive-reading-time">${readingTime}</span>` : ''}
        </div>
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tighter leading-none text-white">${topic.title}</h1>
        <div class="deep-dive-hero-accent" aria-hidden="true"></div>
        <div class="text-[17px] text-mem-secondary max-w-[52ch] leading-relaxed">
          ${(topic.description || '').split('\n\n').map(p => `<p class="mb-3 last:mb-0">${p}</p>`).join('')}
        </div>
        <div class="mt-7">
          <div class="text-xs tracking-wide text-mem-muted mb-2.5 font-semibold">Jump to</div>
          <div class="jump-to-pills mb-4" id="jump-to-pills">
            <button type="button" data-jump-section="infographics-section" class="btn-jump-pill" aria-label="Scroll to infographics and slide decks section">
              ${typeof renderSiteIcon === 'function' ? renderSiteIcon('chart', 'card-icon-sm') : ''} Infographics
            </button>
            <button type="button" data-jump-section="videos-section" class="btn-jump-pill" aria-label="Scroll to video transmissions section">
              ${typeof renderSiteIcon === 'function' ? renderSiteIcon('video', 'card-icon-sm') : ''} Videos
            </button>
            <button type="button" data-jump-section="report-section" class="btn-jump-pill" aria-label="Scroll to deep dive report section">
              ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} Report
            </button>
          </div>
          <div class="flex flex-wrap gap-3 pt-1 border-t border-white/10">
            <a href="codex.html#codex-pill" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← Back to Codex</a>
            <a href="topics.html?source=${sourceId}#explore-topics" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← Back to Topics</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupJumpToPills() {
  const pills = document.querySelectorAll('[data-jump-section]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      TopicUtils.scrollToSection(pill.dataset.jumpSection);
    });
  });

  const sections = ['infographics-section', 'videos-section', 'report-section']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  TopicUtils.setupJumpToSpy(pills, sections);
}

async function loadLessonViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const sourceId = urlParams.get('source') || 'alice';
  const topicId = urlParams.get('topic');

  const headerContainer = document.getElementById('lesson-header');
  const infographicContainer = document.getElementById('infographic-container');
  const pdfContainer = document.getElementById('pdf-container');
  const videosContainer = document.getElementById('videos-container');
  const reportContainer = document.getElementById('report-container');
  const pdfPreviewContainer = document.getElementById('pdf-preview-container');
  const tocContainer = document.getElementById('report-toc');
  const tocMobile = document.getElementById('report-toc-mobile');

  if (!topicId) {
    headerContainer.innerHTML = '<div class="text-center py-12"><p class="text-red-400">No topic specified. Please return to the Codex.</p></div>';
    return;
  }

  if (headerContainer) headerContainer.innerHTML = TopicUtils.skeleton('deep-dive');

  try {
    const fullData = await TopicUtils.fetchSourceIndex(sourceId);
    const lightTopic = TopicUtils.findTopicById(fullData.topics, topicId);
    const topicPath = TopicUtils.findTopicPath(fullData.topics, topicId);

    if (!lightTopic) {
      headerContainer.innerHTML = `<div class="text-center py-12"><p class="text-red-400">Topic not found: ${topicId}</p></div>`;
      return;
    }

    const topicContent = await TopicUtils.fetchTopicContent(sourceId, topicId);
    const topic = { ...lightTopic, ...topicContent };

    updateTopicPageMeta({ topic, sourceId, fullData });

    const breadcrumbs = TopicUtils.renderBreadcrumbs({
      sourceId,
      sourceTitle: fullData.title,
      topicPath,
      currentTitle: topic.title
    });

    headerContainer.innerHTML = renderCinematicHero({ breadcrumbs, fullData, topic, sourceId });
    headerContainer.classList.remove('content-card', 'static-card', 'rounded-3xl', 'p-8', 'md:p-12');
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

    const hasAnyContent = !!(topic.infographic_image ||
      topic.slide_deck_pdf_url ||
      (topic.rumble_videos && topic.rumble_videos.length > 0) ||
      topic.report);

    if (!hasAnyContent) {
      headerContainer.insertAdjacentHTML('afterend', `
        <div class="max-w-2xl mx-auto text-center py-20">
          ${typeof renderSiteIcon === 'function' ? `<div class="mb-8 flex justify-center">${renderSiteIcon('star', 'card-icon-lg')}</div>` : ''}
          <h2 class="text-4xl font-semibold tracking-tighter mb-6">This Topic Continues to Unfold</h2>
          <p class="text-mem-soft text-lg max-w-lg mx-auto leading-relaxed mb-10">
            The complete Codex experience for this topic is being prepared with care,
            encompassing infographics, slide decks, video transmissions, and a deep-dive report.
            The Great Remembering reveals its wisdom in perfect timing.
          </p>
          <a href="topics.html?source=${sourceId}#explore-topics" class="btn-primary inline-flex items-center justify-center px-10 py-4 text-base font-semibold">← Back to topics</a>
          <div class="mt-8 text-xs text-mem-dim tracking-wide">More content coming soon</div>
        </div>
      `);
    }

    if (topic.infographic_image) {
      const infographicSrc = TopicUtils.encodeAssetPath(topic.infographic_image);
      infographicContainer.innerHTML = `
        <div class="infographic-artifact" role="button" tabindex="0" aria-label="Open full size infographic" data-infographic-src="${infographicSrc.replace(/"/g, '&quot;')}">
          <img src="${infographicSrc}" alt="${topic.title} Infographic"
               width="800" height="600" loading="lazy"
               onerror="MediaEmpty.replace(this,'archive','Infographic coming soon')">
          <div class="infographic-artifact-caption">
            <span>Decoded infographic</span>
            <span class="infographic-artifact-zoom" aria-hidden="true">${typeof renderSiteIcon === 'function' ? renderSiteIcon('expand', 'card-icon-sm') : ''} Expand</span>
          </div>
        </div>
      `;
      infographicContainer.querySelector('.infographic-artifact')?.addEventListener('click', (e) => {
        const src = e.currentTarget.dataset.infographicSrc;
        if (src) openInfographicModal(src);
      });
      infographicContainer.querySelector('.infographic-artifact')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const src = e.currentTarget.dataset.infographicSrc;
          if (src) openInfographicModal(src);
        }
      });
    } else {
      infographicContainer.innerHTML = RenderUtils.renderEmptyState('archive', 'Infographic coming soon');
      if (typeof hydrateSiteIcons === 'function') hydrateSiteIcons(infographicContainer);
    }

    if (pdfPreviewContainer) {
      if (topic.pdf_preview_image) {
        const pdfUrl = topic.slide_deck_pdf_url || '#';
        pdfPreviewContainer.innerHTML = `
          <div class="relative w-full h-full group" onclick="window.open('${pdfUrl}', '_blank')">
            <img src="${TopicUtils.encodeAssetPath(topic.pdf_preview_image)}" alt="Slide deck preview - ${topic.title}"
                 class="w-full h-full object-contain rounded-2xl cursor-pointer transition-all duration-300 group-hover:brightness-105 group-hover:scale-[1.01]"
                 width="600" height="400" loading="lazy"
                 onerror="MediaEmpty.replace(this,'file','Preview image unavailable',true)">
            <div onclick="event.stopImmediatePropagation(); window.open('${pdfUrl}', '_blank');"
                 class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-b from-black/30 to-black/60 rounded-2xl cursor-pointer">
              <div class="media-overlay-btn">
                ${typeof renderSiteIcon === 'function' ? renderSiteIcon('book', 'card-icon-sm') : ''}
                <span class="font-bold tracking-wide">Open full slide deck</span>
              </div>
            </div>
            <div class="absolute top-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full font-mono tracking-wide">Slide deck preview</div>
          </div>
        `;
      } else if (topic.slide_deck_pdf_url) {
        const fileIdMatch = topic.slide_deck_pdf_url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
        if (fileIdMatch?.[1]) {
          const thumbUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=1400`;
          pdfPreviewContainer.innerHTML = `
            <div class="relative w-full h-full group" onclick="window.open('${topic.slide_deck_pdf_url}', '_blank')">
              <img src="${thumbUrl}" alt="First page preview - ${topic.title}"
                   class="w-full h-full object-contain rounded-2xl cursor-pointer transition-all duration-300 group-hover:brightness-105 group-hover:scale-[1.01]"
                   width="600" height="400" loading="lazy"
                   onerror="MediaEmpty.replace(this,'file','Preview temporarily unavailable',true)">
              <div onclick="event.stopImmediatePropagation(); window.open('${topic.slide_deck_pdf_url}', '_blank');"
                   class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-b from-black/30 to-black/60 rounded-2xl cursor-pointer">
                <div class="media-overlay-btn">
                  ${typeof renderSiteIcon === 'function' ? renderSiteIcon('book', 'card-icon-sm') : ''}
                  <span class="font-bold tracking-wide">Open full slide deck</span>
                </div>
              </div>
              <div class="absolute top-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full font-mono tracking-wide">Page 1 preview</div>
            </div>
          `;
        } else {
          pdfPreviewContainer.innerHTML = RenderUtils.renderEmptyState('file', 'Could not extract PDF ID from link', { muted: true });
          if (typeof hydrateSiteIcons === 'function') hydrateSiteIcons(pdfPreviewContainer);
        }
      } else {
        pdfPreviewContainer.innerHTML = RenderUtils.renderEmptyState('file', 'Slide deck preview coming soon', { muted: true });
        if (typeof hydrateSiteIcons === 'function') hydrateSiteIcons(pdfPreviewContainer);
      }
    }

    if (pdfContainer && topic.slide_deck_pdf_url) {
      pdfContainer.innerHTML = `
        <a href="${topic.slide_deck_pdf_url}" target="_blank"
           class="btn-primary w-full inline-flex items-center justify-center gap-x-3 px-8 py-4 text-base font-semibold rounded-2xl hover:scale-[1.02] active:scale-[0.985] transition-transform">
          ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} View / download slide deck PDF
        </a>
      `;
    } else if (pdfContainer) {
      pdfContainer.innerHTML = '<div class="text-center py-4 text-mem-muted text-sm">Slide deck coming soon</div>';
    }

    if (topic.rumble_videos?.length > 0) {
      const numVideos = topic.rumble_videos.length;
      let videoGridClass = 'grid gap-6';
      if (numVideos === 1) videoGridClass += ' grid-cols-1 max-w-2xl mx-auto';
      else if (numVideos === 2) videoGridClass += ' md:grid-cols-2 max-w-5xl mx-auto justify-center';
      else videoGridClass += ' md:grid-cols-2 lg:grid-cols-3';

      videosContainer.className = videoGridClass;
      videosContainer.innerHTML = topic.rumble_videos.map(video => `
        <div class="channel-card video-card rounded-3xl overflow-hidden flex flex-col border border-mem-subtle">
          <div class="aspect-video bg-black">
            <iframe src="${video.embed_url}" width="100%" height="100%" frameborder="0" allowfullscreen
                    class="w-full h-full" title="${escapeAttr(video.title)} - 21st Memory video transmission" loading="lazy"></iframe>
          </div>
          <div class="px-4 py-3 flex-shrink-0 border-t border-mem-subtle/50">
            <div class="font-semibold text-[15px] tracking-tight leading-tight text-mem-body line-clamp-2">${video.title}</div>
          </div>
        </div>
      `).join('');
    } else {
      videosContainer.className = 'grid grid-cols-1';
      videosContainer.innerHTML = '<div class="col-span-full text-center py-12 text-mem-muted">Video transmissions coming soon for this topic.</div>';
    }

    if (topic.report) {
      reportContainer.innerHTML = marked.parse(topic.report);
      const lead = reportContainer.querySelector("h1 + p, p");
      if (lead) lead.classList.add("report-lead");
      setupReadingProgress();
      reportContainer.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('tracking-tight', 'font-semibold');
        if (el.tagName === 'H1') el.classList.add('font-bold');
      });
      TopicUtils.buildReportToc(reportContainer, tocContainer);
      if (tocMobile && tocContainer && !tocContainer.hidden) {
        tocMobile.innerHTML = tocContainer.innerHTML;
        tocMobile.hidden = false;
        tocMobile.querySelectorAll('[data-toc-link]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.tocLink);
            if (!target) return;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const top = target.getBoundingClientRect().top + scrollTop - TopicUtils.NAVBAR_HEIGHT - TopicUtils.SCROLL_EXTRA_OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
          });
        });
      }
    } else {
      reportContainer.innerHTML = '<div class="text-center py-12 text-mem-muted">Detailed report coming soon.</div>';
      if (tocContainer) tocContainer.hidden = true;
      if (tocMobile) tocMobile.hidden = true;
    }
  } catch (error) {
    console.error('Error loading lesson:', error);
    const errorIcon = typeof renderSiteIcon === 'function'
      ? `<div class="flex justify-center mb-4 text-red-400">${renderSiteIcon('archive', 'card-icon-lg')}</div>`
      : '';
    headerContainer.innerHTML = `
      <div class="text-center py-20">
        ${errorIcon}
        <h2 class="text-2xl font-semibold text-red-400 mb-4">Unable to load lesson</h2>
        <p class="text-mem-soft max-w-md mx-auto">${error.message}</p>
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

function applyZoomTransform(img) {
  img.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0) scale(${zoomState.scale})`;
  img.style.cursor = zoomState.scale > 1 ? (zoomState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
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

function setupImageZoom(img) {
  resetImageZoomState(img);
  img.style.transition = 'none';
  img.style.transformOrigin = 'center center';
  img.style.willChange = 'transform';
  img.style.touchAction = 'none';

  if (img.dataset.zoomReady === 'true') return;
  img.dataset.zoomReady = 'true';

  const viewport = getZoomViewport(img);
  viewport?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    const nextScale = Math.max(1, Math.min(4, zoomState.scale * factor));
    zoomAtPoint(img, e.clientX, e.clientY, nextScale);
  }, { passive: false });

  img.addEventListener('mousedown', (e) => {
    if (zoomState.scale <= 1) return;
    zoomState.dragging = true;
    zoomState.pointerStartX = e.clientX;
    zoomState.pointerStartY = e.clientY;
    zoomState.panStartX = zoomState.panX;
    zoomState.panStartY = zoomState.panY;
    img.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!zoomState.dragging || zoomState.scale <= 1) return;
    zoomState.panX = zoomState.panStartX + (e.clientX - zoomState.pointerStartX);
    zoomState.panY = zoomState.panStartY + (e.clientY - zoomState.pointerStartY);
    clampPan(img);
    applyZoomTransform(img);
  });

  window.addEventListener('mouseup', () => {
    if (!zoomState.dragging) return;
    zoomState.dragging = false;
    if (img) applyZoomTransform(img);
  });

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
  }, { passive: false });

  viewport?.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const dist = touchDistance(e.touches);
      if (zoomState.lastPinchDistance > 0) {
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const nextScale = Math.max(1, Math.min(4, zoomState.scale * (dist / zoomState.lastPinchDistance)));
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
  }, { passive: false });

  viewport?.addEventListener('touchend', () => {
    zoomState.dragging = false;
    zoomState.lastPinchDistance = 0;
  });

  img.addEventListener('dblclick', (e) => {
    if (zoomState.scale > 1) {
      resetImageZoomState(img);
    } else {
      zoomAtPoint(img, e.clientX, e.clientY, 2);
    }
  });
}

function openInfographicModal(src) {
  const modal = document.getElementById('infographic-modal');
  const img = document.getElementById('modal-image');
  if (!modal || !img) return;

  img.src = src;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setupImageZoom(img);
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const closeBtn = modal.querySelector('button[aria-label="Close infographic modal"]');
    if (closeBtn) closeBtn.focus();
  }, 50);
}

function closeInfographicModal() {
  const modal = document.getElementById('infographic-modal');
  if (!modal) return;

  const img = document.getElementById('modal-image');
  if (img) resetImageZoomState(img);

  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

window.openInfographicModal = openInfographicModal;
window.closeInfographicModal = closeInfographicModal;

function setupInfographicModalListeners() {
  const modal = document.getElementById('infographic-modal');
  const closeBtn = document.getElementById('infographic-modal-close');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeInfographicModal();
  });
  closeBtn?.addEventListener('click', closeInfographicModal);
}

document.addEventListener('DOMContentLoaded', setupInfographicModalListeners);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('infographic-modal');
    if (modal && !modal.classList.contains('hidden')) closeInfographicModal();
  }
});

window.addEventListener('load', loadLessonViewer);