// Shared topic-tree utilities for Codex, Topics, and Deep-Dive pages

const TopicUtils = {
  NAVBAR_HEIGHT: 80,
  SCROLL_EXTRA_OFFSET: 32,

  isPlaceholder(item) {
    if (item.is_placeholder != null) return !!item.is_placeholder;
    return !item.report ||
      (item.report && item.report.includes('TODO')) ||
      (item.topic_image || '').includes('PLACEHOLDER') ||
      (item.report && item.report.length < 400);
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

  debounce(fn, wait = 250) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), wait);
    };
  },

  setupClickToPlayVideos(root = document) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-rumble-embed]').forEach(wrap => {
      if (wrap.dataset.clickBound === 'true') return;
      wrap.dataset.clickBound = 'true';
      wrap.addEventListener('click', () => {
        if (wrap.dataset.loaded === 'true') return;
        const embedUrl = wrap.dataset.rumbleEmbed;
        const title = wrap.dataset.videoTitle || '21st Memory video';
        if (!embedUrl) return;

        wrap.innerHTML = `
          <iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen
                  class="w-full h-full absolute inset-0" title="${title}"></iframe>
        `;
        wrap.dataset.loaded = 'true';
        wrap.classList.remove('cursor-pointer');
      });
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

  scrollToAnchor(elementId, delay = 150) {
    setTimeout(() => {
      const target = document.getElementById(elementId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPosition = rect.top + scrollTop - this.NAVBAR_HEIGHT - this.SCROLL_EXTRA_OFFSET;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }, delay);
  },

  scrollToSection(sectionId) {
    this.scrollToAnchor(sectionId, 0);
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
            <span class="text-white font-medium" aria-current="page">${sourceTitle}</span>
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
        <a href="${crumb.href}" class="breadcrumb-link hover:text-white transition">${crumb.label}</a>
      </li>
    `).join('');

    const current = `
      <li class="breadcrumb-item flex items-center gap-1">
        <span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>
        <span class="text-white font-medium" aria-current="page">${currentTitle}</span>
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
    const statusBadge = entry.is_placeholder
      ? '<span class="codex-meta-pill codex-meta-pill--soon">Coming soon</span>'
      : '<span class="codex-meta-pill">Ready</span>';
    const sourceLabel = options.showSource && entry.sourceTitle
      ? `<div class="card-label text-mem-indigo">${entry.sourceTitle}</div>`
      : '';
    const useThumb = this.isResolvableTopicImage(entry.topic_image, entry.is_placeholder);
    const thumb = useThumb
      ? `<img src="${TopicUtils.encodeAssetPath(entry.topic_image)}" alt="" class="codex-search-card-thumb-img" loading="lazy" onerror="this.parentElement.classList.add('codex-search-card-thumb--fallback')">`
      : '';
    const thumbClass = useThumb ? '' : ' codex-search-card-thumb--fallback';

    return `
      <a href="${entry.href}" class="codex-search-card channel-card group">
        <div class="codex-search-card-thumb${thumbClass}">
          ${thumb}
        </div>
        <div class="codex-search-card-body">
          <div class="codex-search-card-top">
            <div class="min-w-0">
              ${sourceLabel}
              <h3 class="codex-search-card-title">${entry.title}</h3>
            </div>
            ${statusBadge}
          </div>
          <p class="codex-search-card-desc">${entry.description || path}</p>
          <div class="codex-search-card-path">${path}</div>
        </div>
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
                <a href="#${item.id}" class="report-toc-link" data-toc-link="${item.id}">${item.text}</a>
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