// Progressive enhancement for prerendered dive/*.html pages

function initDiveStatic() {
  if (!document.body?.dataset?.diveStatic) return;

  initJumpPills();
  initInfographicModal();
  initSlideDeckArtifacts();
  initClickToPlayVideos();
  // After click-to-play: may re-render non-English default and rebind that set only
  initVideoLanguageSwitcher();
  initReadingProgress();
  initReportToc();
  initTerminologyCards();
  initSectionNavSticky();
  initShareMenu();
  // Print + font size + focus mode (replaces standalone initPrintReport)
  initReadingComfort();
}

function initReadingComfort() {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.initReadingComfort) {
    TopicUtils.initReadingComfort();
  }
}

const VIDEO_LANG_STORAGE_KEY = '21st-memory-video-lang';

function escapeVideoHtml(value) {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.escapeHtml) {
    return TopicUtils.escapeHtml(value);
  }
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeVideoAttr(value) {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.escapeAttr) {
    return TopicUtils.escapeAttr(value);
  }
  return escapeVideoHtml(value).replace(/'/g, '&#39;');
}

function videoGridClassName(count) {
  if (count === 1) return 'dive-video-grid grid gap-6 grid-cols-1 max-w-2xl mx-auto';
  if (count === 2) return 'dive-video-grid grid gap-6 md:grid-cols-2 max-w-5xl mx-auto';
  return 'dive-video-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3';
}

function defaultVideoPosterSrc() {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.defaultVideoPosterPath) {
    return TopicUtils.defaultVideoPosterPath();
  }
  return '../../images/video-poster.webp';
}

function renderDiveVideoCards(videos) {
  const posterSrc = defaultVideoPosterSrc();
  const posterAttr = escapeVideoAttr(posterSrc);
  return (videos || [])
    .map((video) => {
      const title = escapeVideoHtml(video.title || 'Video transmission');
      const embed = escapeVideoAttr(video.embed_url || '');
      const desc = video.description
        ? `<p class="dive-video-card__desc">${escapeVideoHtml(video.description)}</p>`
        : '';
      return `<article class="dive-video-card content-card static-card rounded-3xl p-4">
        <div class="dive-video-card__frame aspect-[16/10] bg-black rounded-2xl overflow-hidden relative">
          <div class="video-poster-wrap absolute inset-0 cursor-pointer"
               data-rumble-embed="${embed}"
               data-video-title="${title}"
               data-poster-src="${posterAttr}"
               role="button" tabindex="0"
               aria-label="Play video: ${title}">
            <img src="${posterAttr}" alt="" class="video-poster-img" width="640" height="400" loading="lazy" decoding="async">
          </div>
        </div>
        <h3 class="dive-video-card__title">${title}</h3>
        ${desc}
      </article>`;
    })
    .join('');
}

function initVideoLanguageSwitcher() {
  const dataEl = document.getElementById('video-languages-data');
  const select = document.getElementById('video-lang-select');
  const container = document.getElementById('videos-container');
  if (!dataEl || !select || !container) return;

  let languages;
  try {
    languages = JSON.parse(dataEl.textContent || '[]');
  } catch {
    return;
  }
  if (!Array.isArray(languages) || languages.length < 2) return;

  const applyLanguage = (code) => {
    const lang = languages.find((l) => l.code === code) || languages[0];
    const videos = lang?.videos || [];
    // Stop any playing video when switching languages
    if (typeof TopicUtils !== 'undefined' && TopicUtils.stopOtherRumbleVideos) {
      TopicUtils.stopOtherRumbleVideos();
    }
    container.className = videoGridClassName(videos.length);
    container.innerHTML = renderDiveVideoCards(videos);
    if (typeof TopicUtils !== 'undefined' && TopicUtils.setupClickToPlayVideos) {
      TopicUtils.setupClickToPlayVideos(container);
    } else {
      initClickToPlayVideos();
    }
    try {
      localStorage.setItem(VIDEO_LANG_STORAGE_KEY, lang.code);
    } catch {
      /* ignore */
    }
  };

  let initial = select.value || 'en';
  try {
    const stored = localStorage.getItem(VIDEO_LANG_STORAGE_KEY);
    if (stored && languages.some((l) => l.code === stored)) {
      initial = stored;
    } else {
      const nav = String(navigator.language || '').slice(0, 2).toLowerCase();
      if (nav && nav !== 'en' && languages.some((l) => l.code === nav)) {
        initial = nav;
      }
    }
  } catch {
    /* ignore */
  }

  if (languages.some((l) => l.code === initial)) {
    select.value = initial;
  }
  // Prerender is English; re-render only when starting on another language
  if (select.value && select.value !== 'en') {
    applyLanguage(select.value);
  }

  select.addEventListener('change', () => applyLanguage(select.value));
}

function initJumpPills() {
  document.querySelectorAll('[data-jump-section]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      if (typeof TopicUtils !== 'undefined' && TopicUtils.scrollToSection) {
        TopicUtils.scrollToSection(id);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Infographic lightbox with wheel / pinch / double-click zoom + pan.
 * Static dive pages only load dive-static.js (not deep-dive.js), so zoom
 * must live here — otherwise Expand opens a non-zoomable full image.
 */
function initInfographicModal() {
  const modal = document.getElementById('infographic-modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn =
    document.getElementById('close-modal') ||
    document.getElementById('infographic-modal-close');
  if (!modal || !modalImg) return;

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
  let zoomListenerAbort = null;
  let modalTrigger = null;

  const touchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const getViewport = () =>
    document.getElementById('infographic-modal-viewport') || modalImg.parentElement;

  const computeFitScale = () => {
    const viewport = getViewport();
    if (!viewport || !modalImg.naturalWidth || !modalImg.naturalHeight) return 1;
    const { width, height } = viewport.getBoundingClientRect();
    if (width <= 0 || height <= 0) return 1;
    return Math.min(width / modalImg.naturalWidth, height / modalImg.naturalHeight, 1);
  };

  const getMaxZoom = () => {
    const fitScale = zoomState.fitScale || 1;
    return Math.max(4, (1 / fitScale) * 1.05);
  };

  const applyZoomTransform = () => {
    const naturalWidth = modalImg.naturalWidth;
    const naturalHeight = modalImg.naturalHeight;

    if (!naturalWidth || !naturalHeight) {
      modalImg.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0) scale(${zoomState.scale})`;
      modalImg.style.cursor =
        zoomState.scale > 1 ? (zoomState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
      return;
    }

    const fitScale = Math.max(zoomState.fitScale || computeFitScale(), 0.01);
    const totalScale = fitScale * zoomState.scale;

    modalImg.style.width = `${naturalWidth * totalScale}px`;
    modalImg.style.height = `${naturalHeight * totalScale}px`;
    modalImg.style.maxWidth = 'none';
    modalImg.style.maxHeight = 'none';
    modalImg.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0)`;
    modalImg.style.cursor =
      zoomState.scale > 1 ? (zoomState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
  };

  const clearImageSizing = () => {
    modalImg.style.width = '';
    modalImg.style.height = '';
    modalImg.style.maxWidth = '';
    modalImg.style.maxHeight = '';
    modalImg.style.transform = '';
  };

  const clampPan = () => {
    if (zoomState.scale <= 1) {
      zoomState.scale = 1;
      zoomState.panX = 0;
      zoomState.panY = 0;
      return;
    }
    const viewport = getViewport();
    if (!viewport) return;
    const vpRect = viewport.getBoundingClientRect();
    const imgRect = modalImg.getBoundingClientRect();
    const maxPanX = Math.max(0, (imgRect.width - vpRect.width) / 2 + 24);
    const maxPanY = Math.max(0, (imgRect.height - vpRect.height) / 2 + 24);
    zoomState.panX = Math.max(-maxPanX, Math.min(maxPanX, zoomState.panX));
    zoomState.panY = Math.max(-maxPanY, Math.min(maxPanY, zoomState.panY));
  };

  const zoomAtPoint = (clientX, clientY, newScale) => {
    const viewport = getViewport();
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

    clampPan();
    applyZoomTransform();
  };

  const resetZoom = () => {
    zoomState.scale = 1;
    zoomState.panX = 0;
    zoomState.panY = 0;
    zoomState.dragging = false;
    zoomState.lastPinchDistance = 0;
    applyZoomTransform();
  };

  const teardownZoom = () => {
    if (zoomListenerAbort) {
      zoomListenerAbort.abort();
      zoomListenerAbort = null;
    }
    zoomState.dragging = false;
    zoomState.lastPinchDistance = 0;
    modalImg.dataset.zoomReady = 'false';
  };

  const setupZoom = () => {
    if (!modalImg.naturalWidth || !modalImg.naturalHeight) return;

    teardownZoom();

    zoomState.fitScale = computeFitScale();
    modalImg.style.transition = 'none';
    modalImg.style.transformOrigin = 'center center';
    modalImg.style.willChange = 'transform, width, height';
    modalImg.style.touchAction = 'none';
    resetZoom();

    zoomListenerAbort = new AbortController();
    const { signal } = zoomListenerAbort;
    modalImg.dataset.zoomReady = 'true';
    const viewport = getViewport();

    viewport?.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.91;
        const nextScale = Math.max(1, Math.min(getMaxZoom(), zoomState.scale * factor));
        zoomAtPoint(e.clientX, e.clientY, nextScale);
      },
      { passive: false, signal }
    );

    modalImg.addEventListener(
      'mousedown',
      (e) => {
        if (zoomState.scale <= 1) return;
        zoomState.dragging = true;
        zoomState.pointerStartX = e.clientX;
        zoomState.pointerStartY = e.clientY;
        zoomState.panStartX = zoomState.panX;
        zoomState.panStartY = zoomState.panY;
        modalImg.style.cursor = 'grabbing';
        e.preventDefault();
      },
      { signal }
    );

    window.addEventListener(
      'mousemove',
      (e) => {
        if (!zoomState.dragging || zoomState.scale <= 1) return;
        zoomState.panX = zoomState.panStartX + (e.clientX - zoomState.pointerStartX);
        zoomState.panY = zoomState.panStartY + (e.clientY - zoomState.pointerStartY);
        clampPan();
        applyZoomTransform();
      },
      { signal }
    );

    window.addEventListener(
      'mouseup',
      () => {
        if (!zoomState.dragging) return;
        zoomState.dragging = false;
        applyZoomTransform();
      },
      { signal }
    );

    viewport?.addEventListener(
      'touchstart',
      (e) => {
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
      },
      { passive: false, signal }
    );

    viewport?.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 2) {
          const dist = touchDistance(e.touches);
          if (zoomState.lastPinchDistance > 0) {
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const nextScale = Math.max(
              1,
              Math.min(getMaxZoom(), zoomState.scale * (dist / zoomState.lastPinchDistance))
            );
            zoomAtPoint(midX, midY, nextScale);
          }
          zoomState.lastPinchDistance = dist;
          e.preventDefault();
        } else if (zoomState.dragging && e.touches.length === 1 && zoomState.scale > 1) {
          zoomState.panX = zoomState.panStartX + (e.touches[0].clientX - zoomState.pointerStartX);
          zoomState.panY = zoomState.panStartY + (e.touches[0].clientY - zoomState.pointerStartY);
          clampPan();
          applyZoomTransform();
          e.preventDefault();
        }
      },
      { passive: false, signal }
    );

    viewport?.addEventListener(
      'touchend',
      () => {
        zoomState.dragging = false;
        zoomState.lastPinchDistance = 0;
      },
      { signal }
    );

    modalImg.addEventListener(
      'dblclick',
      (e) => {
        if (zoomState.scale > 1) {
          resetZoom();
        } else {
          const nativeZoom = Math.min(1 / (zoomState.fitScale || 1), getMaxZoom());
          zoomAtPoint(e.clientX, e.clientY, Math.max(2, nativeZoom));
        }
      },
      { signal }
    );

    window.addEventListener(
      'resize',
      () => {
        if (modal.classList.contains('hidden')) return;
        zoomState.fitScale = computeFitScale();
        applyZoomTransform();
        clampPan();
        applyZoomTransform();
      },
      { signal }
    );
  };

  const open = (src, trigger) => {
    if (!src) return;
    modalTrigger = trigger || document.activeElement;

    clearImageSizing();
    zoomState.scale = 1;
    zoomState.fitScale = 1;
    zoomState.panX = 0;
    zoomState.panY = 0;
    zoomState.dragging = false;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';

    const onReady = () => {
      if (!modalImg.naturalWidth || !modalImg.naturalHeight) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setupZoom());
      });
    };

    modalImg.loading = 'eager';
    modalImg.onload = onReady;
    modalImg.src = src;
    if (modalImg.complete && modalImg.naturalWidth) onReady();

    setTimeout(() => closeBtn?.focus(), 50);
  };

  const close = () => {
    teardownZoom();
    clearImageSizing();
    modalImg.onload = null;
    modalImg.removeAttribute('src');

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';

    const restore = modalTrigger;
    modalTrigger = null;
    restore?.focus?.();
  };

  document.querySelectorAll('[data-infographic-src]').forEach((el) => {
    const openThis = () => open(el.getAttribute('data-infographic-src'), el);
    el.addEventListener('click', openThis);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openThis();
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
}

function initSlideDeckArtifacts() {
  document.querySelectorAll('.slide-deck-artifact[data-pdf-url]').forEach((artifact) => {
    const openPdf = () => {
      const url = artifact.getAttribute('data-pdf-url');
      if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
    };
    artifact.addEventListener('click', openPdf);
    artifact.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPdf();
      }
    });
  });
}

function initClickToPlayVideos() {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.setupClickToPlayVideos) {
    TopicUtils.setupClickToPlayVideos(document);
    return;
  }

  // Fallback when TopicUtils is unavailable — still enforce one player at a time
  document.querySelectorAll('[data-rumble-embed]').forEach((el) => {
    if (el.dataset.clickBound === 'true') return;
    el.dataset.clickBound = 'true';

    const play = () => {
      if (el.dataset.loaded === 'true') return;
      const embed = el.getAttribute('data-rumble-embed');
      if (!embed) return;

      document.querySelectorAll('iframe[src*="rumble.com"]').forEach((iframe) => {
        try { iframe.src = 'about:blank'; } catch { /* ignore */ }
        const parent = iframe.closest('[data-rumble-embed]');
        if (parent && parent !== el) {
          const title = parent.getAttribute('data-video-title') || 'Video';
          const posterSrc = parent.getAttribute('data-poster-src') || defaultVideoPosterSrc();
          if (!parent.getAttribute('data-poster-src')) {
            parent.setAttribute('data-poster-src', posterSrc);
          }
          parent.innerHTML = `<img src="${posterSrc}" alt="" class="video-poster-img" width="640" height="400" loading="lazy" decoding="async">`;
          parent.dataset.loaded = 'false';
          parent.classList.add('cursor-pointer');
          parent.setAttribute('role', 'button');
          parent.setAttribute('tabindex', '0');
          parent.setAttribute('aria-label', `Play video: ${title}`);
        } else if (!parent) {
          iframe.remove();
        }
      });

      const title = el.getAttribute('data-video-title') || 'Video';
      el.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.title = title;
      iframe.allowFullscreen = true;
      iframe.className = 'w-full h-full border-0 absolute inset-0';
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
      el.appendChild(iframe);
      el.dataset.loaded = 'true';
      el.classList.remove('cursor-pointer');
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-label');
    };
    el.addEventListener('click', play);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play();
      }
    });
  });
}

function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  const fill = bar?.querySelector('.reading-progress-fill');
  const reportSection = document.getElementById('report-section');
  if (!bar || !fill || !reportSection) return;

  const update = () => {
    const rect = reportSection.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = reportSection.offsetHeight;
    const viewportBottom = window.scrollY + window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, (viewportBottom - sectionTop) / Math.max(sectionHeight, 1))
    );
    fill.style.width = `${Math.round(progress * 100)}%`;
    bar.hidden = progress <= 0 || progress >= 1;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initReportToc() {
  const reportContainer = document.getElementById('report-container');
  const tocContainer = document.getElementById('report-toc');
  const tocMobile = document.getElementById('report-toc-mobile');
  if (!reportContainer || !tocContainer) return;
  if (typeof TopicUtils === 'undefined' || !TopicUtils.buildReportToc) return;

  TopicUtils.buildReportToc(reportContainer, tocContainer);

  if (tocMobile && tocContainer && !tocContainer.hidden) {
    tocMobile.innerHTML = tocContainer.innerHTML;
    tocMobile.hidden = false;
    tocMobile.querySelectorAll('[data-toc-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.tocLink);
        if (!target) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top =
          target.getBoundingClientRect().top +
          scrollTop -
          TopicUtils.NAVBAR_HEIGHT -
          TopicUtils.SCROLL_EXTRA_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}

function initTerminologyCards() {
  const reportContainer = document.getElementById('report-container');
  if (!reportContainer) return;
  if (typeof TopicUtils !== 'undefined' && TopicUtils.enhanceTerminologyCards) {
    TopicUtils.enhanceTerminologyCards(reportContainer);
  }
}

function initPrintReport() {
  document.querySelector('[data-report-print]')?.addEventListener('click', () => {
    window.print();
  });
}

function initSectionNavSticky() {
  const heroPills = document.getElementById('jump-to-pills');
  if (!heroPills) return;

  const sectionIds = [...heroPills.querySelectorAll('[data-jump-section]')]
    .map((btn) => btn.getAttribute('data-jump-section'))
    .filter((id) => id && document.getElementById(id));

  if (!sectionIds.length) return;

  // Sticky segmented control (same language as hero jump pills)
  const sticky = document.createElement('div');
  sticky.className = 'section-nav-sticky';
  sticky.setAttribute('aria-label', 'Topic sections');
  sticky.innerHTML = `<div class="dive-section-seg dive-section-seg--sticky">${sectionIds
    .map((id) => {
      const label =
        heroPills.querySelector(`[data-jump-section="${id}"]`)?.textContent?.trim() || id;
      return `<button type="button" data-jump-section="${id}" class="btn-jump-pill">${label}</button>`;
    })
    .join('')}</div>`;
  document.body.appendChild(sticky);

  sticky.querySelectorAll('[data-jump-section]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      if (typeof TopicUtils !== 'undefined' && TopicUtils.scrollToSection) {
        TopicUtils.scrollToSection(id);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

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

  // Position-based spy (not IntersectionObserver) so Report correctly
  // takes over once its header crosses the sticky chrome line.
  if (typeof TopicUtils !== 'undefined' && TopicUtils.bindSectionPillSpy) {
    TopicUtils.bindSectionPillSpy(sectionIds, setActive);
  }

  const updateStickyVisibility = () => {
    const rect = heroPills.getBoundingClientRect();
    // Stay under the navbar; hide until hero jump pills leave the nav zone
    const pastHero = rect.bottom < 72;
    sticky.classList.toggle('is-visible', pastHero);
    // Re-run spy after sticky appears so active section recalculates offset
    if (typeof TopicUtils !== 'undefined' && TopicUtils.bindSectionPillSpy) {
      /* spy already listening to scroll */
    }
  };

  updateStickyVisibility();
  window.addEventListener('scroll', updateStickyVisibility, { passive: true });
  window.addEventListener('resize', updateStickyVisibility);
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    /* fall through */
  }
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

function initShareMenu() {
  // Support both new share menu and legacy single copy button
  document.querySelectorAll('.dive-copy-link').forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      const url = btn.getAttribute('data-copy-url') || window.location.href;
      const ok = await copyText(url);
      btn.textContent = ok ? 'Link copied' : 'Copy failed';
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });

  document.querySelectorAll('.share-menu').forEach((menu) => {
    const toggle = menu.querySelector('.share-menu__toggle');
    const panel = menu.querySelector('.share-menu__panel');
    if (!toggle || !panel) return;

    const pageUrl = menu.getAttribute('data-share-url') || window.location.href;
    const pageTitle = menu.getAttribute('data-share-title') || document.title;
    const reportUrl = pageUrl.includes('#')
      ? pageUrl.replace(/#.*$/, '') + '#report-section'
      : pageUrl + '#report-section';

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
          ok = await copyText(pageUrl);
          msg = ok ? 'Link copied' : 'Copy failed';
        } else if (action === 'copy-report') {
          ok = await copyText(reportUrl);
          msg = ok ? 'Report link copied' : 'Copy failed';
        } else if (action === 'copy-title') {
          ok = await copyText(`${pageTitle}\n${pageUrl}`);
          msg = ok ? 'Copied title + URL' : 'Copy failed';
        } else if (action === 'native-share') {
          if (navigator.share) {
            try {
              await navigator.share({ title: pageTitle, url: pageUrl });
              ok = true;
              msg = 'Shared';
            } catch (_) {
              ok = false;
              msg = original;
            }
          } else {
            ok = await copyText(pageUrl);
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

    // Hide native share when unavailable (desktop without Web Share)
    const nativeBtn = panel.querySelector('[data-share-action="native-share"]');
    if (nativeBtn && !navigator.share) {
      nativeBtn.hidden = true;
    }

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiveStatic);
} else {
  initDiveStatic();
}
