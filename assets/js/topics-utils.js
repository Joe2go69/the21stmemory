// Shared topic-tree utilities for Codex, Topics, and Deep-Dive pages

const TopicUtils = {
  NAVBAR_HEIGHT: 80,
  SCROLL_EXTRA_OFFSET: 32,
  CACHE_PREFIX: '21m:',
  CACHE_DEFAULT_MS: 5 * 60 * 1000,
  NAV_RETURN_KEY: 'nav-return',
  NAV_RETURN_MAX_AGE_MS: 30 * 60 * 1000,
  SECTION_COLLAPSE_KEY: 'section-collapse:',

  getCachedJson(key, maxAgeMs = this.CACHE_DEFAULT_MS) {
    try {
      const raw = sessionStorage.getItem(this.CACHE_PREFIX + key);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > maxAgeMs) {
        sessionStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  setCachedJson(key, data, maxAgeMs = this.CACHE_DEFAULT_MS) {
    try {
      sessionStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data, maxAgeMs }));
    } catch {
      /* storage full or unavailable */
    }
  },

  async fetchSourceStats(sourceId) {
    const response = await fetch(`data/${sourceId}-stats.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status} — stats not found`);
    return response.json();
  },

  async fetchArchiveStats() {
    const cached = this.getCachedJson('archive-stats');
    if (cached) return cached;

    try {
      const response = await fetch('data/archive-stats.json');
      if (response.ok) {
        const data = await response.json();
        this.setCachedJson('archive-stats', data);
        return data;
      }
    } catch {
      /* fall through to per-source stats */
    }

    const sourcesResponse = await fetch('data/sources.json');
    if (!sourcesResponse.ok) throw new Error('sources.json not found');
    const sourcesData = await sourcesResponse.json();
    const statsList = await Promise.all(
      (sourcesData.sources || []).map((source) => this.fetchSourceStats(source.id))
    );
    const combined = statsList.reduce((acc, stats) => ({
      sources: acc.sources,
      live: acc.live + (stats.live || 0),
      total: acc.total + (stats.total || 0)
    }), { sources: (sourcesData.sources || []).length, live: 0, total: 0 });
    this.setCachedJson('archive-stats', combined);
    return combined;
  },

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  escapeAttr(value) {
    return this.escapeHtml(value);
  },

  isPlaceholder(item) {
    if (item.is_placeholder != null) return !!item.is_placeholder;
    return !item.report ||
      (item.report && item.report.includes('TODO')) ||
      (item.topic_image || '').includes('PLACEHOLDER');
  },

  topicsIndexUrl(sourceId) {
    return `data/${sourceId}-topics-index.json`;
  },

  topicsContentUrl(sourceId, topicId) {
    return `data/${sourceId}-topics/${topicId}.json`;
  },

  /** Canonical static deep-dive path (root-relative for nested pages). */
  divePath(sourceId, topicId) {
    if (!sourceId || !topicId) return '/deep-dive.html';
    return `/dive/${encodeURIComponent(sourceId)}/${encodeURIComponent(topicId)}.html`;
  },

  diveUrl(sourceId, topicId, options = {}) {
    // Root-relative by default so quiz/dive nested pages resolve correctly.
    if (options.basePath) {
      return `${options.basePath}dive/${encodeURIComponent(sourceId)}/${encodeURIComponent(topicId)}.html`;
    }
    return this.divePath(sourceId, topicId);
  },

  /** Prefer static dive URL for ready topics; SPA fallback for placeholders. */
  topicHref(sourceId, topicId, isPlaceholder = false, options = {}) {
    if (isPlaceholder) {
      if (options.basePath) {
        return `${options.basePath}deep-dive.html?source=${encodeURIComponent(sourceId)}&topic=${encodeURIComponent(topicId)}`;
      }
      return `/deep-dive.html?source=${encodeURIComponent(sourceId)}&topic=${encodeURIComponent(topicId)}`;
    }
    return this.diveUrl(sourceId, topicId, options);
  },

  async fetchSourceIndex(sourceId) {
    const response = await fetch(this.topicsIndexUrl(sourceId));
    if (!response.ok) throw new Error(`HTTP ${response.status} — topics index not found`);
    return response.json();
  },

  async fetchTopicContent(sourceId, topicId) {
    try {
      const response = await fetch(this.topicsContentUrl(sourceId, topicId));
      if (!response.ok) return {};
      return response.json();
    } catch (error) {
      console.warn(`Topic content unavailable: ${sourceId}/${topicId}`, error);
      return {};
    }
  },

  normalizeTopicsFromIndex(topics) {
    return (topics || []).map(item => {
      const normalized = {
        id: item.id,
        title: item.title,
        topic_image: item.topic_image || '',
        description: item.description || '',
        is_placeholder: this.isPlaceholder(item)
      };
      if (item.is_main_root) normalized.is_main_root = true;
      if (item.video_language_count) {
        normalized.video_language_count = item.video_language_count;
      }
      if (item.subtopics?.length) {
        normalized.subtopics = this.normalizeTopicsFromIndex(item.subtopics);
      }
      return normalized;
    });
  },

  createLightweightTopics(topics) {
    return this.normalizeTopicsFromIndex(topics);
  },

  /**
   * Update query params without a full navigation.
   * Pass null/undefined/'' to remove a key. Defaults like status=all can be omitted via omitDefaults.
   */
  replaceUrlParams(updates = {}, { omitDefaults = true } = {}) {
    try {
      const url = new URL(window.location.href);
      Object.entries(updates).forEach(([key, value]) => {
        const isDefault = omitDefaults && (
          value == null ||
          value === '' ||
          value === 'all' ||
          value === 'alpha'
        );
        if (isDefault) {
          url.searchParams.delete(key);
        } else if (value != null) {
          url.searchParams.set(key, String(value));
        }
      });
      const next = `${url.pathname}${url.search}${url.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next !== current) {
        history.replaceState(history.state, '', next);
      }
    } catch {
      /* ignore */
    }
  },

  getSectionCollapseMap(sourceId) {
    if (!sourceId) return {};
    return this.getCachedJson(this.SECTION_COLLAPSE_KEY + sourceId, 7 * 24 * 60 * 60 * 1000) || {};
  },

  setSectionExpanded(sourceId, sectionId, expanded) {
    if (!sourceId || !sectionId) return;
    const map = { ...this.getSectionCollapseMap(sourceId), [sectionId]: !!expanded };
    this.setCachedJson(this.SECTION_COLLAPSE_KEY + sourceId, map, 7 * 24 * 60 * 60 * 1000);
  },

  isSectionExpanded(sourceId, sectionId, defaultExpanded = true) {
    const map = this.getSectionCollapseMap(sourceId);
    if (Object.prototype.hasOwnProperty.call(map, sectionId)) {
      return !!map[sectionId];
    }
    return defaultExpanded;
  },

  debounce(fn, wait = 250) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), wait);
    };
  },

  /** Site-relative path to the legacy default video poster image. */
  defaultVideoPosterPath() {
    const path = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
    const normalized = String(path).replace(/\\/g, '/');
    const base = (normalized.includes('/dive/') || normalized.includes('/quiz/')) ? '../../' : '';
    return `${base}images/video-poster.webp`;
  },

  videoPlayOverlayHtml() {
    return (
      `<div class="video-particle-vignette absolute inset-0 pointer-events-none" aria-hidden="true"></div>` +
      `<div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" aria-hidden="true">` +
      `<div class="play-button">` +
      `<svg viewBox="0 0 24 24" fill="currentColor" class="play-button__icon" aria-hidden="true">` +
      `<path d="M8 5v14l11-7z"/>` +
      `</svg></div></div>`
    );
  },

  isUsablePosterSrc(src) {
    const thumb = String(src || '').trim();
    return /^https?:\/\//i.test(thumb) || (thumb.includes('images/') && /\.(webp|png|jpe?g|gif)$/i.test(thumb));
  },

  /**
   * Click-to-play facade: Rumble still when posterUrl is set, else the brand poster.
   */
  renderVideoPosterMarkup(titleOrPosterSrc, posterUrl) {
    const raw = String(titleOrPosterSrc || '');
    const looksLikePath = /\.(webp|png|jpe?g|gif|svg)(\?|$)/i.test(raw) || raw.includes('images/');
    const overlay = this.videoPlayOverlayHtml();
    const thumb = String(posterUrl || (looksLikePath ? raw : '') || '').trim();
    const src = this.isUsablePosterSrc(thumb) ? thumb : this.defaultVideoPosterPath();
    return (
      `<img src="${this.escapeAttr(src)}" alt="" class="video-poster-img absolute inset-0 w-full h-full object-cover" width="1280" height="720" loading="lazy" decoding="async">` +
      overlay
    );
  },

  bindPosterFallbacks(root = document) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('img.video-poster-img').forEach((img) => {
      if (img.dataset.posterFallback === 'brand') return;
      if (img.dataset.fallbackBound === 'true') return;
      img.dataset.fallbackBound = 'true';
      const useBrand = () => {
        if (img.dataset.usedBrand === 'true') return;
        const brand = this.defaultVideoPosterPath();
        img.dataset.usedBrand = 'true';
        if (img.getAttribute('src') === brand) return;
        img.src = brand;
      };
      img.addEventListener('error', useBrand);
      // Lazy images that have not been requested yet report complete + naturalWidth 0.
      // Only treat as broken when the browser actually selected a source.
      if (img.complete && img.naturalWidth === 0 && img.currentSrc) useBrand();
    });
  },

  /**
   * Stop every other Rumble player so only one video plays at a time.
   * Restores the poster facade + play UI for click-to-play wraps; removes orphan iframes.
   */
  stopOtherRumbleVideos(exceptEl = null) {
    const isExcept = (el) => {
      if (!exceptEl || !el) return false;
      return el === exceptEl || (typeof exceptEl.contains === 'function' && exceptEl.contains(el))
        || (typeof el.contains === 'function' && el.contains(exceptEl));
    };

    document.querySelectorAll('[data-rumble-embed]').forEach((wrap) => {
      if (isExcept(wrap)) return;
      const iframe = wrap.querySelector('iframe');
      if (wrap.dataset.loaded !== 'true' && !iframe) return;

      // Remove the player node — do not park it on about:blank (white flash)
      if (iframe) {
        try { iframe.remove(); } catch { /* ignore */ }
      }

      const title = wrap.dataset.videoTitle || '21st Memory video';
      wrap.innerHTML = this.renderVideoPosterMarkup(title, wrap.dataset.posterUrl);
      this.bindPosterFallbacks(wrap);

      wrap.dataset.loaded = 'false';
      wrap.classList.add('cursor-pointer');
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('aria-label', `Play video: ${title}`);
    });

    // Orphan embeds (e.g. replaced nodes or direct iframes)
    document.querySelectorAll('iframe[src*="rumble.com"]').forEach((iframe) => {
      if (isExcept(iframe)) return;
      if (iframe.closest('[data-rumble-embed]')) return;
      iframe.remove();
    });

  },

  setupClickToPlayVideos(root = document) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-rumble-embed]').forEach((wrap) => {
      if (wrap.dataset.clickBound === 'true') return;
      wrap.dataset.clickBound = 'true';

      const loadEmbed = () => {
        if (wrap.dataset.loaded === 'true') return;
        const embedUrl = wrap.dataset.rumbleEmbed;
        const title = wrap.dataset.videoTitle || '21st Memory video';
        if (!embedUrl) return;

        // One video at a time across the page
        this.stopOtherRumbleVideos(wrap);

        wrap.innerHTML = (typeof window.renderRumbleEmbedHtml === 'function')
          ? window.renderRumbleEmbedHtml(embedUrl, title)
          : `<iframe src="${this.escapeHtml(embedUrl)}" width="100%" height="100%" allowfullscreen
                  class="w-full h-full absolute inset-0 border-0 video-embed-frame" title="${this.escapeHtml(title)}"
                  style="color-scheme:dark;background-color:#0F0A1F"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>
             <div class="video-embed-cover" aria-hidden="true"></div>`;
        wrap.dataset.loaded = 'true';
        wrap.classList.remove('cursor-pointer');
        wrap.removeAttribute('role');
        wrap.removeAttribute('tabindex');
        wrap.removeAttribute('aria-label');
        if (typeof window.revealRumbleEmbed === 'function') window.revealRumbleEmbed(wrap);
      };

      wrap.addEventListener('click', loadEmbed);
      wrap.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          loadEmbed();
        }
      });
      this.bindPosterFallbacks(wrap);
    });
  },

  setupImageFallbacks(container, selector = 'img[data-img-fallback]') {
    if (!container) return;
    container.querySelectorAll(selector).forEach((img) => {
      if (img.dataset.fallbackBound === 'true') return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'topic-image-fallback topic-image-fallback--compact';
        fallback.innerHTML = typeof renderSiteIcon === 'function'
          ? renderSiteIcon('archive', 'card-icon-sm')
          : '<span>Image unavailable</span>';
        img.replaceWith(fallback);
        if (typeof hydrateSiteIcons === 'function') hydrateSiteIcons(fallback);
      }, { once: true });
    });
  },

  findTopicById(topicsArray, targetId) {
    for (const t of topicsArray) {
      if (t.id === targetId) return t;
      if (t.subtopics?.length) {
        const found = this.findTopicById(t.subtopics, targetId);
        if (found) return found;
      }
    }
    return null;
  },

  findTopicPath(topicsArray, targetId, path = []) {
    for (const t of topicsArray) {
      const newPath = [...path, t];
      if (t.id === targetId) return newPath;
      if (t.subtopics?.length) {
        const found = this.findTopicPath(t.subtopics, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  },

  countTopicStats(topics) {
    let live = 0;
    let total = 0;

    const walk = (items) => {
      for (const item of items) {
        total++;
        if (!item.is_placeholder) live++;
        if (item.subtopics?.length) walk(item.subtopics);
      }
    };

    walk(topics || []);
    return { live, total };
  },

  encodeAssetPath(path) {
    return String(path || '').split('/').map((part, i) => (i === 0 ? part : encodeURIComponent(part))).join('/');
  },

  isPlaceholderImage(path) {
    return String(path || '').toUpperCase().includes('PLACEHOLDER');
  },

  isResolvableTopicImage(path, isPlaceholder = false) {
    return !!path && !isPlaceholder && !this.isPlaceholderImage(path);
  },

  normalizeSearch(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  },

  matchesSearch(entry, query) {
    const q = this.normalizeSearch(query);
    if (!q) return true;
    const haystack = this.normalizeSearch([
      entry.title,
      entry.description,
      entry.id,
      entry.sourceTitle,
      entry.sourceId,
      ...(entry.pathTitles || [])
    ].join(' '));
    return haystack.includes(q);
  },

  getAdjacentTopics(topics, currentId, meta = {}) {
    const flat = this.flattenTopicTree(topics, meta);
    const idx = flat.findIndex(entry => entry.id === currentId);
    if (idx === -1) return { prev: null, next: null };

    let prev = null;
    for (let i = idx - 1; i >= 0; i -= 1) {
      if (!flat[i].is_placeholder) {
        prev = flat[i];
        break;
      }
    }

    let next = null;
    for (let i = idx + 1; i < flat.length; i += 1) {
      if (!flat[i].is_placeholder) {
        next = flat[i];
        break;
      }
    }

    return { prev, next };
  },

  flattenTopicTree(topics, meta = {}) {
    const results = [];

    const walk = (items, path = []) => {
      for (const item of items || []) {
        const currentPath = [...path, item];
        results.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          is_placeholder: !!item.is_placeholder,
          topic_image: item.topic_image || '',
          sourceId: meta.sourceId || '',
          sourceTitle: meta.sourceTitle || '',
          pathTitles: currentPath.map(node => node.title),
          href: meta.sourceId && item.id
            ? this.topicHref(meta.sourceId, item.id, !!item.is_placeholder)
            : null
        });
        if (item.subtopics?.length) walk(item.subtopics, currentPath);
      }
    };

    walk(topics);
    return results;
  },

  filterEntriesByStatus(entries, status) {
    if (status === 'ready') return entries.filter(entry => !entry.is_placeholder);
    if (status === 'soon') return entries.filter(entry => entry.is_placeholder);
    return entries;
  },

  sortTopicsAlpha(items) {
    return [...items]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(item => ({
        ...item,
        subtopics: item.subtopics?.length ? this.sortTopicsAlpha(item.subtopics) : item.subtopics
      }));
  },

  /** Extra clearance when sticky dive section nav is on screen (avoids overlapping section pills). */
  getStickySectionNavOffset() {
    const sticky = document.querySelector('.section-nav-sticky');
    if (sticky) {
      const h = sticky.getBoundingClientRect().height;
      return h > 8 ? Math.ceil(h) : 52;
    }
    if (document.body?.dataset?.diveStatic || document.getElementById('jump-to-pills')) {
      return 52;
    }
    return 0;
  },

  /**
   * Thin top bar tracks the report column only (not videos / continue).
   * Hidden until the reader reaches the report; fills through the prose.
   */
  initReportReadingProgress() {
    const bar = document.getElementById('reading-progress');
    const fill = bar?.querySelector('.reading-progress-fill');
    const report = document.getElementById('report-container');
    if (!bar || !fill || !report) return;
    if (bar.dataset.progressBound === '1') return;
    bar.dataset.progressBound = '1';

    const update = () => {
      const rect = report.getBoundingClientRect();
      const chrome = this.getDiveChromeOffset();
      const start = window.scrollY + rect.top - chrome;
      const readable = Math.max(report.offsetHeight - (window.innerHeight - chrome), 1);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / readable));
      fill.style.width = `${Math.round(progress * 100)}%`;
      const active = progress > 0 && progress < 1;
      bar.hidden = !active;
      bar.setAttribute('aria-hidden', active ? 'false' : 'true');
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  },

  /** Navbar + sticky pills + a tight gap — one number for jump and spy. */
  getDiveChromeOffset() {
    const nav = document.querySelector('.navbar');
    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : this.NAVBAR_HEIGHT;
    return navH + this.getStickySectionNavOffset() + 10;
  },

  /** Prefer the visual divider so Infographics / Videos / Report land on the same line. */
  resolveSectionTarget(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return null;
    if (target.classList.contains('dive-section-head')) return target;
    return target.querySelector(':scope > .dive-section-head') || target;
  },

  scrollToAnchor(elementId, delay = 150, behavior = 'smooth') {
    setTimeout(() => {
      const target = this.resolveSectionTarget(elementId) || document.getElementById(elementId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = rect.top + scrollTop - this.getDiveChromeOffset();
      window.scrollTo({ top: Math.max(0, offsetPosition), behavior });
    }, delay);
  },

  scrollToSection(sectionId) {
    this.scrollToAnchor(sectionId, 0);
  },

  disableNativeScrollRestoration() {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    } catch {
      /* ignore */
    }
  },

  /**
   * Capture location.hash then strip it so the browser does not native-jump.
   * Call early on list pages; restore + scroll once with applyCapturedHash().
   */
  captureAndClearHash() {
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (!hash) return null;
    try {
      const url = `${window.location.pathname}${window.location.search}`;
      history.replaceState(history.state, '', url);
      // Cancel any native hash scroll already applied
      window.scrollTo(0, 0);
    } catch {
      /* ignore */
    }
    return hash;
  },

  applyCapturedHash(hash, { delay = 80, behavior = 'smooth' } = {}) {
    if (!hash) return false;
    const target = document.getElementById(hash);
    if (!target) return false;
    try {
      const url = `${window.location.pathname}${window.location.search}#${hash}`;
      history.replaceState(history.state, '', url);
    } catch {
      /* ignore */
    }
    this.scrollToAnchor(hash, delay, behavior);
    return true;
  },

  async fetchSourceIds() {
    const cached = this.getCachedJson('source-ids', 10 * 60 * 1000);
    if (cached?.ids) return cached.ids;
    const response = await fetch('data/sources.json');
    if (!response.ok) throw new Error(`HTTP ${response.status} — sources.json not found`);
    const data = await response.json();
    const ids = (data.sources || []).map((s) => s.id).filter(Boolean);
    this.setCachedJson('source-ids', { ids }, 10 * 60 * 1000);
    return ids;
  },

  async resolveSourceId(rawId) {
    const ids = await this.fetchSourceIds();
    if (!rawId) {
      return { ok: false, reason: 'missing', ids };
    }
    if (!ids.includes(rawId)) {
      return { ok: false, reason: 'invalid', rawId, ids };
    }
    return { ok: true, sourceId: rawId, ids };
  },

  renderSourceError({ reason, rawId, ids = [] } = {}) {
    const list = ids.length
      ? `<ul class="mt-4 text-sm text-mem-muted space-y-1">${ids.map((id) =>
          `<li><a class="underline hover:text-white" href="topics.html?source=${this.escapeAttr(id)}">${this.escapeHtml(id)}</a></li>`
        ).join('')}</ul>`
      : '';
    const message = reason === 'missing'
      ? 'No transmission was specified. Choose a source from the Codex, or pick one below.'
      : `Unknown transmission “${this.escapeHtml(rawId || '')}”. It may have been renamed or removed.`;
    return `
      <div class="text-center py-20 px-6">
        <div class="text-red-400 text-xl mb-4">Transmission not found</div>
        <p class="text-mem-soft max-w-md mx-auto">${message}</p>
        ${list}
        <a href="codex.html" class="btn-primary">← Back to Codex</a>
      </div>
    `;
  },

  saveNavReturnState(state = {}) {
    try {
      const payload = {
        ...state,
        scrollY: typeof state.scrollY === 'number'
          ? state.scrollY
          : (window.pageYOffset || document.documentElement.scrollTop || 0),
        ts: Date.now()
      };
      sessionStorage.setItem(this.CACHE_PREFIX + this.NAV_RETURN_KEY, JSON.stringify(payload));
    } catch {
      /* storage unavailable */
    }
  },

  peekNavReturnState() {
    try {
      const raw = sessionStorage.getItem(this.CACHE_PREFIX + this.NAV_RETURN_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      if (Date.now() - (data.ts || 0) > this.NAV_RETURN_MAX_AGE_MS) {
        sessionStorage.removeItem(this.CACHE_PREFIX + this.NAV_RETURN_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  consumeNavReturnState(predicate) {
    const data = this.peekNavReturnState();
    if (!data) return null;
    if (typeof predicate === 'function' && !predicate(data)) return null;
    try {
      sessionStorage.removeItem(this.CACHE_PREFIX + this.NAV_RETURN_KEY);
    } catch {
      /* ignore */
    }
    return data;
  },

  clearNavReturnState() {
    try {
      sessionStorage.removeItem(this.CACHE_PREFIX + this.NAV_RETURN_KEY);
    } catch {
      /* ignore */
    }
  },

  parseDeepDiveLink(href) {
    if (!href || typeof href !== 'string') return null;
    try {
      const url = new URL(href, window.location.href);
      const pathname = (url.pathname || '').replace(/\\/g, '/');
      // Static dive pages: /dive/{source}/{topic}.html
      const diveMatch = pathname.match(/\/dive\/([^/]+)\/([^/]+)\.html$/i);
      if (diveMatch) {
        return {
          sourceId: decodeURIComponent(diveMatch[1]),
          topicId: decodeURIComponent(diveMatch[2])
        };
      }
      const path = pathname.split('/').pop() || '';
      if (path !== 'deep-dive.html') return null;
      const topicId = url.searchParams.get('topic');
      if (!topicId) return null;
      return {
        sourceId: url.searchParams.get('source') || '',
        topicId
      };
    } catch {
      return null;
    }
  },

  /**
   * Capture outbound deep-dive navigations so Back can restore list position.
   * getExtraState() may return { page, sourceId, filters, ... }.
   */
  attachTopicNavCapture(root, getExtraState) {
    if (!root || root.dataset.navCaptureBound === 'true') return;
    root.dataset.navCaptureBound = 'true';

    root.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.getAttribute('aria-disabled') === 'true') return;
      if (anchor.hasAttribute('download') || anchor.target === '_blank') return;

      const parsed = this.parseDeepDiveLink(anchor.getAttribute('href') || '');
      if (!parsed) return;

      const extra = typeof getExtraState === 'function' ? (getExtraState() || {}) : {};
      this.saveNavReturnState({
        ...extra,
        topicId: parsed.topicId,
        sourceId: extra.sourceId != null && extra.sourceId !== ''
          ? extra.sourceId
          : parsed.sourceId,
        scrollY: window.pageYOffset || document.documentElement.scrollTop || 0
      });
    }, true);
  },

  findTopicRestoreTarget(topicId) {
    if (!topicId) return null;
    const safe = String(topicId).replace(/"/g, '');
    return (
      document.querySelector(`[data-topic-id="${safe}"]`) ||
      document.getElementById(`topic-${safe}`) ||
      null
    );
  },

  highlightRestoredTopic(el) {
    if (!el) return;
    el.classList.remove('topic-restore-highlight');
    // Restart animation if re-applied
    void el.offsetWidth;
    el.classList.add('topic-restore-highlight');
    const clear = () => el.classList.remove('topic-restore-highlight');
    el.addEventListener('animationend', clear, { once: true });
    setTimeout(clear, 2200);
  },

  restoreScrollToTopic({ topicId, scrollY, behavior = 'auto' } = {}) {
    const offset = this.NAVBAR_HEIGHT + this.SCROLL_EXTRA_OFFSET;
    const target = this.findTopicRestoreTarget(topicId);

    if (target) {
      const rect = target.getBoundingClientRect();
      const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
      this.highlightRestoredTopic(target);
      return true;
    }

    if (typeof scrollY === 'number' && scrollY >= 0) {
      window.scrollTo({ top: scrollY, behavior });
      return true;
    }

    return false;
  },

  /**
   * After async list render: consume matching return state and restore scroll.
   * Returns the consumed state (or null) so callers can re-apply filters first.
   */
  applyNavReturnAfterRender({ page, sourceId, delay = 50 } = {}) {
    const state = this.consumeNavReturnState((data) => {
      if (page && data.page && data.page !== page) return false;
      if (sourceId != null && data.sourceId != null && data.sourceId !== '' && data.sourceId !== sourceId) {
        return false;
      }
      return true;
    });
    if (!state) return null;

    const run = () => {
      this.restoreScrollToTopic({
        topicId: state.topicId,
        scrollY: state.scrollY,
        behavior: 'auto'
      });
    };

    if (delay > 0) {
      requestAnimationFrame(() => setTimeout(run, delay));
    } else {
      requestAnimationFrame(run);
    }
    return state;
  },

  renderSourceBreadcrumbs({ sourceTitle }) {
    return `
      <nav aria-label="Breadcrumb" class="mb-5">
        <ol class="breadcrumb flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-mem-muted">
          <li class="breadcrumb-item flex items-center gap-1">
            <a href="codex.html" class="breadcrumb-link">Codex</a>
          </li>
          <li class="breadcrumb-item flex items-center gap-1">
            <span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>
            <span class="text-white font-medium" aria-current="page">${this.escapeHtml(sourceTitle)}</span>
          </li>
        </ol>
      </nav>
    `;
  },

  renderBreadcrumbs({ sourceId, sourceTitle, topicPath, currentTitle }) {
    const crumbs = [
      { label: 'Codex', href: 'codex.html' },
      { label: sourceTitle, href: `topics.html?source=${sourceId}` }
    ];

    if (topicPath?.length) {
      topicPath.slice(0, -1).forEach(item => {
        crumbs.push({
          label: item.title,
          href: this.topicHref(sourceId, item.id, !!item.is_placeholder)
        });
      });
    }

    const items = crumbs.map((crumb, i) => `
      <li class="breadcrumb-item flex items-center gap-1">
        ${i > 0 ? '<span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>' : ''}
        <a href="${this.escapeAttr(crumb.href)}" class="breadcrumb-link hover:text-white transition">${this.escapeHtml(crumb.label)}</a>
      </li>
    `).join('');

    const current = `
      <li class="breadcrumb-item flex items-center gap-1">
        <span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>
        <span class="text-white font-medium" aria-current="page">${this.escapeHtml(currentTitle)}</span>
      </li>
    `;

    return `
      <nav aria-label="Breadcrumb" class="mb-5">
        <ol class="breadcrumb flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-mem-muted">
          ${items}
          ${current}
        </ol>
      </nav>
    `;
  },

  estimateReadingTime(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  },

  renderTopicSearchCard(entry, options = {}) {
    const path = options.pathLabel
      || (entry.pathTitles?.length > 1
        ? entry.pathTitles.slice(0, -1).join(' › ')
        : entry.sourceTitle || '');
    const isPh = !!entry.is_placeholder;
    const statusBadge = isPh
      ? '<span class="codex-meta-pill codex-meta-pill--soon">Coming soon</span>'
      : '<span class="codex-meta-pill codex-meta-pill--ready">Ready</span>';
    const pathText = this.escapeHtml(path);
    const sourceLabel = options.showSource && entry.sourceTitle
      ? `<div class="card-label text-mem-indigo">${this.escapeHtml(entry.sourceTitle)}</div>`
      : '';
    const useThumb = this.isResolvableTopicImage(entry.topic_image, entry.is_placeholder);
    const thumb = useThumb
      ? `<img src="${TopicUtils.encodeAssetPath(entry.topic_image)}" alt="" class="codex-search-card-thumb-img" loading="lazy" onerror="this.parentElement.classList.add('codex-search-card-thumb--fallback')">`
      : '';
    const thumbClass = useThumb ? '' : ' codex-search-card-thumb--fallback';

    const desc = entry.description ? this.escapeHtml(entry.description) : pathText;
    const topicIdAttr = entry.id
      ? ` data-topic-id="${this.escapeAttr(entry.id)}" id="topic-${this.escapeAttr(entry.id)}"`
      : '';
    const body = `
        <div class="codex-search-card-thumb${thumbClass}">
          ${thumb}
        </div>
        <div class="codex-search-card-body">
          <div class="codex-search-card-top">
            <div class="min-w-0">
              ${sourceLabel}
              <h3 class="codex-search-card-title">${this.escapeHtml(entry.title)}</h3>
            </div>
            ${statusBadge}
          </div>
          <p class="codex-search-card-desc">${desc}</p>
          <div class="codex-search-card-path">${pathText}</div>
        </div>`;

    // Placeholders: non-navigable card (tree leaves are also blocked)
    if (isPh || !entry.href) {
      return `
      <div class="codex-search-card channel-card codex-search-card--soon" aria-disabled="true"${topicIdAttr}>
        ${body}
      </div>
    `;
    }

    return `
      <a href="${this.escapeAttr(entry.href)}" class="codex-search-card channel-card group"${topicIdAttr}>
        ${body}
      </a>
    `;
  },

  skeleton(type) {
    const bar = (w) => `<div class="skeleton skeleton-bar" style="width:${w}"></div>`;
    const block = (h) => `<div class="skeleton skeleton-block" style="height:${h}"></div>`;

    const layouts = {
      'codex-stats': `
        <div class="skeleton-panel codex-hub-panel">
          <div class="skeleton-grid skeleton-grid--4">${block('3.5rem')}${block('3.5rem')}${block('3.5rem')}${block('3.5rem')}</div>
          ${bar('100%')}
        </div>`,
      'codex-grid': `
        <div class="skeleton-grid skeleton-grid--sources">
          ${Array(2).fill(`<div class="skeleton skeleton-source-card">${block('10rem')}${bar('70%')}${bar('90%')}</div>`).join('')}
        </div>`,
      'topics-header': `
        <div class="skeleton-panel static-card">
          <div class="skeleton-grid skeleton-grid--header">
            <div>${bar('40%')}${block('2.5rem')}${block('1.5rem')}${bar('100%')}${bar('85%')}</div>
            <div class="skeleton skeleton-block skeleton-block--image"></div>
          </div>
        </div>`,
      'topics-list': `
        <div class="skeleton-panel">
          ${bar('50%')}
          ${Array(3).fill(`<div class="skeleton skeleton-category-card static-card mt-6">${block('5rem')}${bar('60%')}</div>`).join('')}
        </div>`,
      'deep-dive': `
        <div class="skeleton-deep-dive">
          ${bar('35%')}
          <div class="skeleton skeleton-hero-band"></div>
          <div class="skeleton-grid skeleton-grid--media mt-8">
            <div class="skeleton skeleton-media-block"></div>
            <div class="skeleton skeleton-media-block"></div>
          </div>
        </div>`
    };
    return layouts[type] || bar('100%');
  },

  animateProgressBars(root = document) {
    const bars = root.querySelectorAll('.archive-progress-fill[data-progress]');
    if (!bars.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = (fill) => {
      const target = fill.dataset.progress || '0';
      if (reduced) {
        fill.style.width = `${target}%`;
        return;
      }
      fill.style.width = '0%';
      requestAnimationFrame(() => {
        fill.style.width = `${target}%`;
      });
    };

    if (reduced) {
      bars.forEach(run);
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  },

  setupJumpToSpy(buttons, sections) {
    if (!buttons.length || !sections.length) return;

    const setActive = (id) => {
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.jumpSection === id);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    }, { threshold: [0.2, 0.45, 0.65], rootMargin: '-15% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
  },

  collectReportTocItems(reportContainer) {
    if (!reportContainer) return [];

    const headings = [...reportContainer.querySelectorAll('h2, h3')].filter((heading) => {
      if (heading.classList.contains('term-card__term')) return false;
      if (heading.closest('.term-card, .term-card-grid')) return false;
      return Boolean(heading.textContent && heading.textContent.trim());
    });

    return headings.map((heading, index) => {
      const id = heading.id || `report-section-${index}`;
      heading.id = id;
      return {
        heading,
        id,
        text: heading.textContent.trim(),
        level: heading.tagName === 'H3' ? 3 : 2
      };
    });
  },

  renderReportTocList(items) {
    return items.map((item) => `
              <li class="report-toc-item report-toc-item--h${item.level}">
                <a href="#${item.id}" class="report-toc-link" data-toc-link="${item.id}">${this.escapeHtml(item.text)}</a>
              </li>
            `).join('');
  },

  scrollToReportHeading(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = target.getBoundingClientRect().top + scrollTop - this.getDiveChromeOffset() - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
  },

  buildReportToc(reportContainer, tocContainer, tocMobile) {
    if (!reportContainer || !tocContainer) return;

    const items = this.collectReportTocItems(reportContainer);
    if (!items.length) {
      tocContainer.hidden = true;
      if (tocMobile) {
        tocMobile.hidden = true;
        tocMobile.innerHTML = '';
      }
      return;
    }

    const listHtml = this.renderReportTocList(items);

    tocContainer.hidden = false;
    tocContainer.innerHTML = `
      <div class="report-toc-inner static-card">
        <div class="report-toc-label">On this page</div>
        <nav aria-label="Report sections">
          <ul class="report-toc-list">
            ${listHtml}
          </ul>
        </nav>
      </div>
    `;

    if (tocMobile) {
      tocMobile.hidden = false;
      tocMobile.innerHTML = `
        <details class="report-toc-mobile-panel">
          <summary class="report-toc-mobile-summary">
            <span class="report-toc-mobile-kicker">On this page</span>
            <span class="report-toc-mobile-current" data-toc-current>${this.escapeHtml(items[0].text)}</span>
            <svg class="report-toc-mobile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <nav class="report-toc-mobile-nav" aria-label="Report sections">
            <ul class="report-toc-list">
              ${listHtml}
            </ul>
          </nav>
        </details>
      `;
    }

    const desktopLinks = tocContainer.querySelectorAll('[data-toc-link]');
    const mobileLinks = tocMobile ? tocMobile.querySelectorAll('[data-toc-link]') : [];
    const allLinks = [...desktopLinks, ...mobileLinks];
    const currentEl = tocMobile ? tocMobile.querySelector('[data-toc-current]') : null;
    const mobilePanel = tocMobile ? tocMobile.querySelector('.report-toc-mobile-panel') : null;

    const setActive = (id) => {
      allLinks.forEach((link) => {
        const on = link.dataset.tocLink === id;
        link.classList.toggle('active', on);
        if (on) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (currentEl) {
        const match = items.find((item) => item.id === id);
        if (match) currentEl.textContent = match.text;
      }
    };

    const visibleIds = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleIds.add(entry.target.id);
        else visibleIds.delete(entry.target.id);
      });
      const firstVisible = items.find((item) => visibleIds.has(item.id));
      if (firstVisible) setActive(firstVisible.id);
    }, { threshold: [0.12, 0.35], rootMargin: '-22% 0px -58% 0px' });

    items.forEach((item) => observer.observe(item.heading));
    setActive(items[0].id);

    allLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobilePanel) mobilePanel.open = false;
        this.scrollToReportHeading(link.dataset.tocLink);
      });
    });
  },

  /**
   * Strip list-item leftovers after the term <strong>.
   * Never put HTML entities inside a [] class — "&middot;" matches letters.
   */
  cleanTermDefinition(defHtml) {
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
  },

  /**
   * Turn definition-style bullet lists into term cards.
   * Matches Key Terminology, Key Reminders, Guidance lists, etc.
   * Expects <li><strong>Term</strong> — definition</li> (em/en dash or colon).
   * Safe to call multiple times; skips already-converted grids.
   */
  enhanceTerminologyCards(reportContainer) {
    if (!reportContainer) return;

    const headings = reportContainer.querySelectorAll('h2, h3');
    headings.forEach((heading) => {
      let list = heading.nextElementSibling;
      while (list && list.tagName !== 'UL' && list.tagName !== 'OL') {
        if (/^H[1-6]$/.test(list.tagName)) return;
        // skip empty text nodes / whitespace-only
        if (list.nodeType === 1 && list.classList?.contains('term-card-grid')) return;
        list = list.nextElementSibling;
      }
      if (!list || list.closest('.term-card-grid')) return;

      const items = [...list.querySelectorAll(':scope > li')];
      if (!items.length) return;
      const withStrong = items.filter((li) => li.querySelector('strong'));
      // Only promote lists that are mostly term/definition rows
      if (withStrong.length < 2 || withStrong.length < items.length * 0.5) return;

      const cards = [];
      items.forEach((li) => {
        const strong = li.querySelector('strong');
        if (!strong) return;
        const term = (strong.textContent || '').trim().replace(/[:：]\s*$/, '');
        if (!term) return;

        let defHtml = '';
        const fullHtml = li.innerHTML;
        const strongHtml = strong.outerHTML;
        const afterStrong = fullHtml.slice(fullHtml.indexOf(strongHtml) + strongHtml.length);
        defHtml = this.cleanTermDefinition(afterStrong);
        if (!defHtml) {
          const text = (li.textContent || '').trim();
          const stripped = text.replace(term, '').replace(/^[\s\-–—:·•]+/, '').trim();
          defHtml = this.escapeHtml(stripped);
        }
        if (!defHtml) return;
        cards.push({ term, defHtml });
      });

      if (cards.length < 2) return;

      const voice = this.classifyTermVoice(heading.textContent);
      const grid = document.createElement('div');
      grid.className = `term-card-grid term-card-grid--${voice}`;
      grid.setAttribute('data-term-voice', voice);
      grid.setAttribute('role', 'list');
      grid.innerHTML = cards
        .map(
          (c) => `
      <article class="term-card term-card--${voice}" role="listitem">
        <h3 class="term-card__term">${this.escapeHtml(c.term)}</h3>
        <div class="term-card__def">${c.defHtml}</div>
      </article>`
        )
        .join('');
      list.replaceWith(grid);
    });

    this.enhanceReportFolio(reportContainer);
  },

  collectReportFigures(text) {
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
  },

  renderReportFigures(figures) {
    return `<aside class="report-figures" aria-label="Key figures">${figures
      .map(
        (fig) =>
          `<div class="report-figure"><span class="report-figure__value">${this.escapeHtml(
            fig.value
          )}</span><span class="report-figure__label">${this.escapeHtml(fig.label)}</span></div>`
      )
      .join('')}</aside>`;
  },

  classifyTermVoice(headingText) {
    const t = String(headingText || '').toLowerCase();
    if (/guid(e|ance)|remembrance|integration|practice/.test(t)) return 'guidance';
    if (/nuance|caveat|further exploration/.test(t)) return 'caveat';
    if (/reminder|takeaway|revelation|insight|dot connection/.test(t)) return 'takeaway';
    if (/terminolog|glossary|definition/.test(t)) return 'glossary';
    return 'glossary';
  },

  enhanceReportFolio(reportContainer) {
    if (!reportContainer) return;

    const firstH1 = reportContainer.querySelector(':scope > h1');
    if (firstH1) firstH1.remove();

    const firstP = reportContainer.querySelector(':scope > p');
    if (firstP) firstP.classList.add('report-lead');

    if (firstP && !reportContainer.querySelector('.report-figures')) {
      const figures = this.collectReportFigures(reportContainer.textContent);
      if (figures.length >= 2) {
        firstP.insertAdjacentHTML('afterend', this.renderReportFigures(figures));
      }
    }

    reportContainer.querySelectorAll('.term-card-grid').forEach((grid) => {
      if (grid.dataset.termVoice) return;
      let heading = grid.previousElementSibling;
      while (heading && !/^H[23]$/.test(heading.tagName)) {
        heading = heading.previousElementSibling;
      }
      const voice = this.classifyTermVoice(heading ? heading.textContent : '');
      grid.dataset.termVoice = voice;
      grid.classList.add(`term-card-grid--${voice}`);
      grid.querySelectorAll('.term-card').forEach((card) => card.classList.add(`term-card--${voice}`));
    });

    const quotes = [...reportContainer.querySelectorAll('blockquote')];
    if (quotes.length) {
      const headings = [...reportContainer.querySelectorAll('h2')];
      const passage = headings.find((h) => /notable|passage|direct insight/i.test(h.textContent || ''));
      let pool = quotes;
      if (passage) {
        const after = quotes.filter((q) => passage.compareDocumentPosition(q) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (after.length) pool = after;
      }
      const monument = pool.reduce((best, cur) =>
        (cur.textContent || '').trim().length > (best.textContent || '').trim().length ? cur : best
      );
      quotes.forEach((bq) => {
        if ((bq.textContent || '').trim().length < 40) return;
        if (bq === monument && (bq.textContent || '').trim().length >= 80) {
          bq.classList.add('report-pullquote');
          bq.classList.remove('report-insight-card');
          if (!bq.querySelector('.report-pullquote__source')) {
            const foot = document.createElement('footer');
            foot.className = 'report-pullquote__source';
            foot.textContent = 'Thalon Thor · transmission';
            bq.appendChild(foot);
          }
        } else {
          bq.classList.add('report-insight-card');
        }
      });
    }

    this.enhanceReportCoda(reportContainer);
    this.ensureFolioMasthead();
  },

  enhanceReportCoda(reportContainer) {
    if (!reportContainer || reportContainer.querySelector('.report-coda')) return;
    const closeH2 = [...reportContainer.querySelectorAll('h2')].find((h) =>
      /closing invitation/i.test(h.textContent || '')
    );
    if (!closeH2) return;
    const p = closeH2.nextElementSibling;
    if (!p || p.tagName !== 'P') return;
    const markSrc =
      document.querySelector('.report-folio-mark, .nav-logo-mark-img')?.getAttribute('src') ||
      'images/21st-mark.webp';
    const coda = document.createElement('footer');
    coda.className = 'report-coda';
    coda.innerHTML = `<div class="report-coda__rule" aria-hidden="true"></div><p class="report-coda__text">${p.innerHTML}</p><img class="report-coda__mark" src="${this.escapeHtml(markSrc)}" alt="" width="40" height="40" decoding="async" />`;
    closeH2.replaceWith(coda);
    p.remove();
  },

  ensureFolioMasthead() {
    if (document.querySelector('.report-folio-masthead')) return;
    const card = document.querySelector('.dive-report-card');
    const toolbar = document.getElementById('report-study-toolbar');
    if (!card || !toolbar) return;

    const path =
      document.querySelector('.deep-dive-hero-meta__path')?.textContent?.trim() ||
      document.querySelector('.deep-dive-hero .page-hero-eyebrow')?.textContent?.trim() ||
      '';
    const time =
      [...document.querySelectorAll('.deep-dive-hero-meta__item, .deep-dive-reading-time')]
        .map((el) => el.textContent.trim())
        .find((t) => /min read/i.test(t)) || '';
    const markSrc =
      document.querySelector('.nav-logo-mark-img')?.getAttribute('src') || 'images/21st-mark.webp';

    const parts = ['<span class="report-folio-kicker">Decoded report</span>'];
    if (path) parts.push(`<span class="report-folio-path">${this.escapeHtml(path)}</span>`);
    if (time) parts.push(`<span class="report-folio-time">${this.escapeHtml(time)}</span>`);

    const header = document.createElement('header');
    header.className = 'report-folio-masthead';
    header.innerHTML = `<img src="${this.escapeHtml(markSrc)}" alt="" class="report-folio-mark" width="36" height="36" decoding="async" /><div class="report-folio-meta">${parts.join('<span class="report-folio-dot" aria-hidden="true">·</span>')}</div>`;
    card.insertBefore(header, toolbar);
  },

  /**
   * Scroll-spy for dive section pills. Uses document position (not IO ratios)
   * so the last section whose top has crossed the sticky offset wins.
   * While the hero is still in view, no segment is active (avoids Infographics
   * lighting up gold/violet on first paint before the reader has scrolled).
   */
  bindSectionPillSpy(sectionIds, setActive) {
    if (!sectionIds?.length || typeof setActive !== 'function') return () => {};

    const getMarkerY = () => this.getDiveChromeOffset();

    const update = () => {
      const heroPills = document.getElementById('jump-to-pills');
      // Still reading the hero — keep segments neutral
      if (heroPills) {
        const heroBottom = heroPills.getBoundingClientRect().bottom;
        const nav = document.querySelector('.navbar');
        const navH = nav ? nav.getBoundingClientRect().height : this.NAVBAR_HEIGHT;
        if (heroBottom > navH + 24) {
          setActive(null);
          return;
        }
      }

      const marker = getMarkerY();
      let current = null;
      for (const id of sectionIds) {
        const el = this.resolveSectionTarget(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - marker <= 8) current = id;
      }
      // If nothing has crossed yet (rare after hero), leave clear
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return update;
  },

  /* ── Phase 4: reading comfort (font size) ── */
  REPORT_SIZE_KEY: '21st-memory-report-size-v1',
  REPORT_SIZES: ['sm', 'md', 'lg'],

  REPORT_FOCUS_KEY: '21st-memory-report-focus-v1',

  /**
   * Size controls, Focus mode, and print. Safe to call twice.
   */
  initReadingComfort(options = {}) {
    const toolbar =
      options.toolbar ||
      document.getElementById('report-study-toolbar');
    const reportRoot =
      options.reportRoot ||
      document.getElementById('report-container');
    if (!toolbar || !reportRoot) return;

    toolbar.hidden = false;
    this.ensureReadingComfortControls(toolbar);
    if (toolbar.dataset.comfortBound === '1') return;
    toolbar.dataset.comfortBound = '1';

    let size = 'md';
    try {
      const storedSize = localStorage.getItem(this.REPORT_SIZE_KEY);
      if (this.REPORT_SIZES.includes(storedSize)) size = storedSize;
    } catch (_) { /* ignore */ }

    const applySize = (next) => {
      size = this.REPORT_SIZES.includes(next) ? next : 'md';
      document.body.setAttribute('data-report-size', size);
      reportRoot.setAttribute('data-report-size', size);
      toolbar.querySelectorAll('[data-report-size]').forEach((btn) => {
        const on = btn.getAttribute('data-report-size') === size;
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      try {
        localStorage.setItem(this.REPORT_SIZE_KEY, size);
      } catch (_) { /* ignore */ }
    };

    applySize(size);

    toolbar.querySelectorAll('[data-report-size]').forEach((btn) => {
      btn.addEventListener('click', () => applySize(btn.getAttribute('data-report-size')));
    });

    let focusOn = false;
    try {
      focusOn = localStorage.getItem(this.REPORT_FOCUS_KEY) === '1';
    } catch (_) { /* ignore */ }

    const applyFocus = (on) => {
      focusOn = !!on;
      document.body.classList.toggle('reading-focus', focusOn);
      toolbar.querySelectorAll('[data-report-focus]').forEach((btn) => {
        btn.classList.toggle('is-active', focusOn);
        btn.setAttribute('aria-pressed', focusOn ? 'true' : 'false');
      });
      try {
        localStorage.setItem(this.REPORT_FOCUS_KEY, focusOn ? '1' : '0');
      } catch (_) { /* ignore */ }
    };

    applyFocus(focusOn);
    toolbar.querySelectorAll('[data-report-focus]').forEach((btn) => {
      btn.addEventListener('click', () => applyFocus(!focusOn));
    });

    toolbar.querySelector('[data-report-print]')?.addEventListener('click', () => {
      window.print();
    });
  },

  ensureReadingComfortControls(toolbar) {
    if (!toolbar) return;

    if (!toolbar.querySelector('[data-report-size]')) {
      const printBtn = toolbar.querySelector('[data-report-print]');
      const group = document.createElement('div');
      group.className = 'report-study-group';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Text size');
      group.innerHTML = `
      <span class="report-study-label" id="report-size-label">Text</span>
      <button type="button" class="report-study-btn report-study-btn--size" data-report-size="sm" aria-pressed="false" aria-labelledby="report-size-label" title="Smaller text">A</button>
      <button type="button" class="report-study-btn report-study-btn--size report-study-btn--size-md" data-report-size="md" aria-pressed="true" aria-labelledby="report-size-label" title="Default text">A</button>
      <button type="button" class="report-study-btn report-study-btn--size report-study-btn--size-lg" data-report-size="lg" aria-pressed="false" aria-labelledby="report-size-label" title="Larger text">A</button>
    `;
      toolbar.insertBefore(group, toolbar.firstChild);
      if (!printBtn) {
        const print = document.createElement('button');
        print.type = 'button';
        print.className = 'report-study-btn';
        print.setAttribute('data-report-print', '');
        print.setAttribute('aria-label', 'Print or save report as PDF');
        print.textContent = 'Print';
        toolbar.appendChild(print);
      }
    }

    if (!toolbar.querySelector('[data-report-focus]')) {
      const focus = document.createElement('button');
      focus.type = 'button';
      focus.className = 'report-study-btn report-study-btn--focus';
      focus.setAttribute('data-report-focus', '');
      focus.setAttribute('aria-pressed', 'false');
      focus.textContent = 'Focus';
      const printBtn = toolbar.querySelector('[data-report-print]');
      if (printBtn) toolbar.insertBefore(focus, printBtn);
      else toolbar.appendChild(focus);
    }
  }
};

window.TopicUtils = TopicUtils;
window.scrollToSection = (id) => TopicUtils.scrollToSection(id);