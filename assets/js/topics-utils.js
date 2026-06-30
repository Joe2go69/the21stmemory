// Shared topic-tree utilities for Codex, Topics, and Deep-Dive pages

const TopicUtils = {
  NAVBAR_HEIGHT: 80,
  SCROLL_EXTRA_OFFSET: 32,

  isPlaceholder(item) {
    return !item.report ||
      (item.report && item.report.includes('TODO')) ||
      (item.topic_image || '').includes('PLACEHOLDER') ||
      (item.report && item.report.length < 400);
  },

  createLightweightTopics(topics) {
    return (topics || []).map(item => {
      const light = {
        id: item.id,
        title: item.title,
        topic_image: item.topic_image || '',
        description: item.description || '',
        is_placeholder: this.isPlaceholder(item)
      };
      if (item.subtopics && item.subtopics.length > 0) {
        light.subtopics = this.createLightweightTopics(item.subtopics);
      }
      return light;
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
  }
};

window.TopicUtils = TopicUtils;
window.scrollToSection = (id) => TopicUtils.scrollToSection(id);