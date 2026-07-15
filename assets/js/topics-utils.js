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

        wrap.innerHTML = `
          <iframe src="${this.escapeHtml(embedUrl)}" width="100%" height="100%" allowfullscreen
                  class="w-full h-full absolute inset-0 border-0" title="${this.escapeHtml(title)}"></iframe>
        `;
        wrap.dataset.loaded = 'true';
        wrap.classList.remove('cursor-pointer');
        wrap.removeAttribute('role');
        wrap.removeAttribute('tabindex');
        wrap.removeAttribute('aria-label');
      };

      wrap.addEventListener('click', loadEmbed);
      wrap.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          loadEmbed();
        }
      });
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
            ? `deep-dive.html?source=${meta.sourceId}&topic=${item.id}`
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

  scrollToAnchor(elementId, delay = 150, behavior = 'smooth') {
    setTimeout(() => {
      const target = document.getElementById(elementId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = rect.top + scrollTop - this.NAVBAR_HEIGHT - this.SCROLL_EXTRA_OFFSET;
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
        <a href="codex.html" class="btn-primary inline-flex items-center justify-center px-8 py-3 mt-8 text-sm font-semibold">← Back to Codex</a>
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
      const path = url.pathname.split('/').pop() || '';
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
          href: `deep-dive.html?source=${sourceId}&topic=${item.id}`
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
      : '<span class="codex-meta-pill">Ready</span>';
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
        <div class="skeleton-panel static-card rounded-2xl">
          <div class="skeleton-grid skeleton-grid--4">${block('3.5rem')}${block('3.5rem')}${block('3.5rem')}${block('3.5rem')}</div>
          ${bar('100%')}
        </div>`,
      'codex-grid': `
        <div class="skeleton-grid skeleton-grid--sources">
          ${Array(2).fill(`<div class="skeleton skeleton-source-card static-card rounded-3xl">${block('10rem')}${bar('70%')}${bar('90%')}</div>`).join('')}
        </div>`,
      'topics-header': `
        <div class="skeleton-panel static-card rounded-3xl glow-purple">
          <div class="skeleton-grid skeleton-grid--header">
            <div>${bar('40%')}${block('2.5rem')}${block('1.5rem')}${bar('100%')}${bar('85%')}</div>
            <div class="skeleton skeleton-block skeleton-block--image"></div>
          </div>
        </div>`,
      'topics-list': `
        <div class="skeleton-panel">
          ${bar('50%')}
          ${Array(3).fill(`<div class="skeleton skeleton-category-card static-card rounded-3xl mt-6">${block('5rem')}${bar('60%')}</div>`).join('')}
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

  buildReportToc(reportContainer, tocContainer) {
    if (!reportContainer || !tocContainer) return;

    const headings = reportContainer.querySelectorAll('h2, h3');
    if (!headings.length) {
      tocContainer.hidden = true;
      return;
    }

    const items = [];
    headings.forEach((heading, index) => {
      const id = `report-section-${index}`;
      heading.id = id;
      items.push({
        id,
        text: heading.textContent.trim(),
        level: heading.tagName === 'H3' ? 3 : 2
      });
    });

    tocContainer.hidden = false;
    tocContainer.innerHTML = `
      <div class="report-toc-inner static-card rounded-2xl">
        <div class="report-toc-label">On this page</div>
        <nav aria-label="Report sections">
          <ul class="report-toc-list">
            ${items.map(item => `
              <li class="report-toc-item report-toc-item--h${item.level}">
                <a href="#${item.id}" class="report-toc-link" data-toc-link="${item.id}">${this.escapeHtml(item.text)}</a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </div>
    `;

    const links = tocContainer.querySelectorAll('[data-toc-link]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle('active', link.dataset.tocLink === entry.target.id);
        });
      });
    }, { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' });

    headings.forEach(heading => observer.observe(heading));

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.tocLink);
        if (!target) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top = target.getBoundingClientRect().top + scrollTop - this.NAVBAR_HEIGHT - this.SCROLL_EXTRA_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
};

window.TopicUtils = TopicUtils;
window.scrollToSection = (id) => TopicUtils.scrollToSection(id);