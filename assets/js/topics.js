// Topics page — source viewer with filtering, sorting, and progress

const debouncedRenderTopicsList = TopicUtils.debounce(() => renderTopicsList(), 250);

let topicsPageState = {
  sourceId: 'alice',
  data: null,
  stats: { live: 0, total: 0 },
  filters: { status: 'all', category: 'all', search: '' }
};

function topicImageFallbackHtml() {
  const icon = typeof renderSiteIcon === "function" ? renderSiteIcon("archive", "card-icon-sm") : "";
  return `<div class="topic-image-fallback">${icon}<span>Image unavailable</span></div>`;
}

function topicImageComingSoonHtml() {
  const icon = typeof renderSiteIcon === "function" ? renderSiteIcon("archive", "card-icon-sm") : "";
  return `<div class="topic-image-fallback topic-image-fallback--soon">${icon}<span>Coming soon</span></div>`;
}

function renderTopicImage(topicImage, alt, { loading = "lazy", isPlaceholder = false } = {}) {
  if (isPlaceholder || TopicUtils.isPlaceholderImage(topicImage)) {
    return topicImageComingSoonHtml();
  }
  if (!topicImage) return topicImageFallbackHtml();
  return `<img src="${TopicUtils.encodeAssetPath(topicImage)}" alt="${alt}" class="topic-card-img w-full h-full object-cover" loading="${loading}">`;
}

function setupTopicImageFallbacks(container) {
  if (!container) return;
  container.querySelectorAll(".topic-card-img").forEach(img => {
    img.addEventListener("error", () => {
      const wrap = document.createElement("div");
      wrap.innerHTML = topicImageFallbackHtml();
      const fallback = wrap.firstElementChild;
      if (fallback) img.replaceWith(fallback);
      if (typeof hydrateSiteIcons === "function") hydrateSiteIcons(wrap);
    }, { once: true });
  });
}

function shouldShowTopic(item, statusFilter) {
  if (statusFilter === 'ready') return !item.is_placeholder;
  if (statusFilter === 'soon') return item.is_placeholder;
  return true;
}

function renderTopicLeaf(sourceId, leaf, extraClass = '') {
  if (!shouldShowTopic(leaf, topicsPageState.filters.status)) return '';
  const leafPh = leaf.is_placeholder;
  const leafClasses = `topic-leaf-btn ${extraClass} ${leafPh ? 'opacity-50 grayscale-[0.5] pointer-events-none' : ''}`;
  const leafBadge = leafPh ? ' <span class="topic-badge topic-badge--inline">SOON</span>' : '';
  return `
    <a href="deep-dive.html?source=${sourceId}&topic=${leaf.id}" class="${leafClasses}">
      <span>${leaf.title}${leafBadge}</span>
    </a>
  `;
}

function renderSubtopic(sourceId, sub) {
  const hasChildren = sub.subtopics && sub.subtopics.length > 0;

  if (hasChildren) {
    const visibleLeaves = sub.subtopics.filter(leaf => shouldShowTopic(leaf, topicsPageState.filters.status));
    if (!shouldShowTopic(sub, topicsPageState.filters.status) && visibleLeaves.length === 0) return '';

    const subPh = sub.is_placeholder;
    const subBadge = subPh ? '<span class="topic-badge topic-badge--section">SOON</span>' : '';
    const sectionId = `section-${sub.id}`;

    let leavesHTML = visibleLeaves.map(leaf => renderTopicLeaf(sourceId, leaf)).join('');
    if (!leavesHTML) return '';

    const viewLink = subPh
      ? ''
      : `<a href="deep-dive.html?source=${sourceId}&topic=${sub.id}" class="topic-section-link">View →</a>`;

    return `
      <div class="topic-section-group" data-expanded="true" data-section-id="${sectionId}">
        <div class="topic-section-header">
          <button type="button" class="category-toggle-btn" aria-expanded="true" aria-controls="${sectionId}-children" data-toggle-section>
            <span class="chevron" aria-hidden="true">${typeof renderSiteIcon === 'function' ? renderSiteIcon('chevron', 'card-icon-sm') : ''}</span>
            <span class="flex-1 min-w-0 truncate">${sub.title}${subBadge}</span>
            <span class="text-xs px-2.5 py-0.5 bg-white/10 rounded-full text-mem-muted flex-shrink-0">${visibleLeaves.length}</span>
          </button>
          ${viewLink}
        </div>
        <div id="${sectionId}-children" class="topic-section-children" data-section-children>
          ${leavesHTML}
        </div>
      </div>
    `;
  }

  if (!shouldShowTopic(sub, topicsPageState.filters.status)) return '';
  const subPh = sub.is_placeholder;
  const leafClasses = `topic-leaf-btn mb-3 inline-flex max-w-md ${subPh ? 'opacity-50 grayscale-[0.5] pointer-events-none' : ''}`;
  const leafBadge = subPh ? ' <span class="topic-badge topic-badge--inline">SOON</span>' : '';
  return `
    <a href="deep-dive.html?source=${sourceId}&topic=${sub.id}" class="${leafClasses}">
      <span>${sub.title}${leafBadge}</span>
    </a>
  `;
}

function renderMainRootBlock(sourceId, root) {
  if (!root || !shouldShowTopic(root, topicsPageState.filters.status)) return '';

  return `
    <div class="topic-main-root-block" data-category-id="${root.id}">
      <div class="topic-main-root-eyebrow" aria-hidden="true">
        ${typeof renderSiteIcon === 'function' ? renderSiteIcon('star', 'card-icon-sm') : ''}
        Root transmission
      </div>
      <a href="deep-dive.html?source=${sourceId}&topic=${root.id}"
         class="topic-main-root-card channel-card surface-interactive group no-underline">
        <div class="topic-main-root-card__glow" aria-hidden="true"></div>
        <div class="topic-main-root-card__header">
          <div class="topic-main-root-icon flex-shrink-0 overflow-hidden">
            ${renderTopicImage(root.topic_image, `${root.title} visual`, { loading: "eager", isPlaceholder: root.is_placeholder })}
          </div>
          <div class="topic-main-root-card__body">
            <div class="topic-main-root-badge">Essence · Start Here</div>
            <h3 class="topic-main-root-title group-hover:text-mem-indigo transition-colors">${root.title}</h3>
            <p class="topic-main-root-desc">${root.description || ''}</p>
          </div>
        </div>
        <div class="topic-main-root-footer">
          <div class="topic-main-root-explore inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[1.5px] w-full">
            Begin the transmission <span class="text-lg leading-none">→</span>
          </div>
        </div>
      </a>
    </div>
  `;
}

function renderCategoryBlock(sourceId, category) {
  const isPh = category.is_placeholder;
  if (!shouldShowTopic(category, topicsPageState.filters.status) && topicsPageState.filters.status !== 'all') {
    const hasVisibleChildren = category.subtopics?.some(sub => {
      if (sub.subtopics?.length) {
        return sub.subtopics.some(leaf => shouldShowTopic(leaf, topicsPageState.filters.status)) ||
          shouldShowTopic(sub, topicsPageState.filters.status);
      }
      return shouldShowTopic(sub, topicsPageState.filters.status);
    });
    if (!hasVisibleChildren) return '';
  }

  const subCount = category.subtopics ? category.subtopics.length : 0;
  const rootClasses = `topic-root-card channel-card surface-interactive group no-underline mb-6 p-6 sm:p-8 ${isPh ? 'opacity-60 grayscale-[0.25] pointer-events-none' : ''}`;
  const placeholderBadge = isPh ? '<div class="topic-badge topic-badge--corner">Coming soon</div>' : '';

  let subsHTML = '';
  if (category.subtopics?.length) {
    subsHTML = category.subtopics.map(sub => renderSubtopic(sourceId, sub)).join('');
    if (subsHTML) {
      subsHTML = `<div class="pl-4 md:pl-8 border-l-2 border-mem-violet/20">${subsHTML}</div>`;
    }
  }

  const showRoot = shouldShowTopic(category, topicsPageState.filters.status) || topicsPageState.filters.status === 'all';
  if (!showRoot && !subsHTML) return '';

  return `
    <div class="mb-12 relative topic-category-block" data-category-id="${category.id}">
      ${showRoot ? `
        <a href="${isPh ? '#' : `deep-dive.html?source=${sourceId}&topic=${category.id}`}"
           class="${rootClasses}"
           ${isPh ? 'tabindex="-1" aria-disabled="true"' : ''}>
          <div class="topic-root-card__header">
            <div class="root-icon flex-shrink-0 overflow-hidden border-2 border-mem-accent/60 shadow-[0_10px_30px_rgba(109,40,217,0.35)]">
              ${renderTopicImage(category.topic_image, `${category.title} visual`, { isPlaceholder: isPh })}
            </div>
            <div class="topic-root-card__body">
              <h3 class="topic-category-title group-hover:text-mem-indigo transition-colors">${category.title}</h3>
              <span class="topic-category-count">${subCount} ${subCount === 1 ? 'category' : 'categories'}</span>
              <p class="topic-category-desc">${category.description || ''}</p>
            </div>
          </div>
          <div class="mt-auto pt-5">
            <div class="explore-badge inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[1.5px] w-full">
              Explore category <span class="text-lg leading-none">→</span>
            </div>
          </div>
          <div class="topic-root-shimmer"></div>
          ${placeholderBadge}
        </a>
      ` : ''}
      ${subsHTML}
    </div>
  `;
}

function renderTopicsSearchResults() {
  const { data, sourceId, filters } = topicsPageState;
  const container = document.getElementById('topics-list');
  if (!container || !data) return;

  const flat = TopicUtils.flattenTopicTree(data.topics, {
    sourceId,
    sourceTitle: data.title
  });

  let matches = flat.filter(entry => TopicUtils.matchesSearch(entry, filters.search));
  matches = TopicUtils.filterEntriesByStatus(matches, filters.status);

  if (!matches.length) {
    container.innerHTML = `
      <div class="text-center py-16 codex-empty-state">
        <div class="text-lg font-semibold mb-2">No topics found</div>
        <p class="text-mem-muted">Try another keyword or adjust your status filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="codex-topic-results-grid">
      ${matches.map(entry => TopicUtils.renderTopicSearchCard(entry, {
        pathLabel: entry.pathTitles.length > 1
          ? entry.pathTitles.slice(0, -1).join(' › ')
          : data.title
      })).join('')}
    </div>
  `;
}

function setupCollapsibleSections(container) {
  if (!container) return;

  container.querySelectorAll('[data-toggle-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.topic-section-group');
      if (!group) return;
      const expanded = group.dataset.expanded !== 'true';
      group.dataset.expanded = expanded ? 'true' : 'false';
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      const children = group.querySelector('[data-section-children]');
      if (children && expanded) {
        children.style.maxHeight = `${children.scrollHeight}px`;
      } else if (children) {
        children.style.maxHeight = '0';
      }
    });
  });

  container.querySelectorAll('[data-section-children]').forEach(children => {
    const group = children.closest('.topic-section-group');
    if (group?.dataset.expanded === 'true') {
      children.style.maxHeight = `${children.scrollHeight}px`;
    }
  });
}

function renderMainRootSection() {
  const { data, sourceId, filters } = topicsPageState;
  const section = document.getElementById('topics-main-root-section');
  if (!section || !data) return;

  const mainRoots = data.topics.filter(t => t.is_main_root);
  const showSection = filters.category === 'all' && !TopicUtils.normalizeSearch(filters.search) && mainRoots.length > 0;

  if (!showSection) {
    section.innerHTML = '';
    section.hidden = true;
    return;
  }

  const visibleRoots = mainRoots.filter(root => shouldShowTopic(root, filters.status));
  if (!visibleRoots.length) {
    section.innerHTML = '';
    section.hidden = true;
    return;
  }

  section.hidden = false;
  section.innerHTML = `
    <div class="topics-main-root-section">
      <div class="topics-main-root-header">
        <h2 class="topics-main-root-heading">Where to Begin</h2>
        <p class="topics-main-root-subheading">Start with the essence transmission — a complete overview before exploring each category below.</p>
      </div>
      ${visibleRoots.map(root => renderMainRootBlock(sourceId, root)).join('')}
    </div>
    <div class="topics-section-divider" aria-hidden="true">
      <span class="topics-section-divider__line"></span>
      <span class="topics-section-divider__label">Explore by category</span>
      <span class="topics-section-divider__line"></span>
    </div>
  `;
  setupTopicImageFallbacks(section);
}

function renderTopicsList() {
  const { data, sourceId, filters } = topicsPageState;
  const container = document.getElementById('topics-list');
  if (!container || !data) return;

  renderMainRootSection();

  if (TopicUtils.normalizeSearch(filters.search)) {
    renderTopicsSearchResults();
    return;
  }

  let categories = data.topics.filter(t => !t.is_main_root);
  if (filters.category !== 'all') {
    categories = categories.filter(c => c.id === filters.category);
  }

  const html = categories.map(cat => renderCategoryBlock(sourceId, cat)).join('');
  if (!html.trim()) {
    container.innerHTML = `<div class="text-center py-16 text-mem-muted">No topics match the current filter. Try a different view.</div>`;
  } else {
    container.innerHTML = html;
    setupCollapsibleSections(container);
    setupTopicImageFallbacks(container);
  }
}

function renderFilterControls() {
  const { data, filters, stats } = topicsPageState;
  const controls = document.getElementById('topics-controls');
  if (!controls || !data) return;

  const soonCount = Math.max(0, stats.total - stats.live);
  const categoryTabs = [
    { id: 'all', label: 'All Categories' },
    ...data.topics.filter(c => !c.is_main_root).map(c => ({ id: c.id, label: c.title }))
  ];

  const statusButtons = ['all', 'ready', 'soon'].map(f => {
    const label = f === 'all' ? 'All Topics' : f === 'ready' ? 'Ready' : 'Coming Soon';
    const count = f === 'all' ? stats.total : f === 'ready' ? stats.live : soonCount;
    return `
      <button type="button" data-filter-status="${f}" class="topic-control-btn ${filters.status === f ? 'active' : ''}">
        ${label}<span class="topic-control-count">${count}</span>
      </button>
    `;
  }).join('');

  const categoryButtons = categoryTabs.map(tab => `
    <button type="button" data-filter-category="${tab.id}" class="topic-control-btn topic-control-btn-sm ${filters.category === tab.id ? 'active' : ''}">
      ${tab.label}
    </button>
  `).join('');

  controls.innerHTML = `
    <div class="topics-filter-panel static-card rounded-2xl mb-8">
      <div class="topics-filter-header">
        <div>
          <div class="topics-filter-title">Browse the Archive</div>
          <p class="topics-filter-subtitle">Search topics or filter by availability and category</p>
        </div>
        <div class="topics-filter-summary">
          <span class="topics-filter-stat"><strong>${stats.live}</strong> ready</span>
          <span class="topics-filter-stat-divider" aria-hidden="true"></span>
          <span class="topics-filter-stat"><strong>${soonCount}</strong> coming soon</span>
        </div>
      </div>
      <div class="codex-search-row mb-4">
        <label class="codex-search-field" for="topics-search-input">
          <span class="codex-search-icon" aria-hidden="true">${typeof renderSiteIcon === 'function' ? renderSiteIcon('search', 'card-icon-sm') : ''}</span>
          <input
            id="topics-search-input"
            type="search"
            class="codex-search-input"
            placeholder="Search topics in this transmission…"
            value="${filters.search.replace(/"/g, '&quot;')}"
            autocomplete="off"
            spellcheck="false"
          >
        </label>
      </div>
      <div class="topics-filter-toolbar">
        <div class="topics-filter-section topics-filter-section--status">
          <span class="topics-filter-label">Status</span>
          <div class="topics-filter-btn-group">${statusButtons}</div>
        </div>
        <div class="topics-filter-section topics-filter-section--category ${TopicUtils.normalizeSearch(filters.search) ? 'opacity-50 pointer-events-none' : ''}">
          <span class="topics-filter-label">Category</span>
          <div class="topics-filter-btn-group topics-filter-btn-group--scroll">${categoryButtons}</div>
        </div>
      </div>
    </div>
  `;

  const searchInput = controls.querySelector('#topics-search-input');
  searchInput?.addEventListener('input', (event) => {
    topicsPageState.filters.search = event.target.value;
    debouncedRenderTopicsList();
  });

  controls.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      topicsPageState.filters.status = btn.dataset.filterStatus;
      renderFilterControls();
      renderTopicsList();
    });
  });

  controls.querySelectorAll('[data-filter-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      topicsPageState.filters.category = btn.dataset.filterCategory;
      renderFilterControls();
      renderTopicsList();
    });
  });
}

function renderSourceHeader(data, sourceId, stats) {
  const breadcrumbs = TopicUtils.renderSourceBreadcrumbs({ sourceTitle: data.title });

  document.getElementById('source-header').innerHTML = `
    ${breadcrumbs}
    <div class="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
      <div class="md:col-span-7 flex flex-col h-full">
        <div class="source-text-block">
          <div class="inline-flex items-center px-4 py-1 rounded-full bg-mem-violet/10 text-mem-indigo text-xs font-semibold tracking-wide mb-4">
            Codex archive · ${stats.live} of ${stats.total} topics live
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter leading-none">${data.title}</h1>
          <p class="text-lg md:text-2xl text-mem-muted mt-3">${data.subtitle}</p>
          <div class="mt-4">
            <div class="archive-progress-bar" role="progressbar" aria-valuenow="${stats.live}" aria-valuemin="0" aria-valuemax="${stats.total}" aria-label="Archive progress">
              <div class="archive-progress-fill" data-progress="${stats.total ? Math.round((stats.live / stats.total) * 100) : 0}" style="width: ${stats.total ? Math.round((stats.live / stats.total) * 100) : 0}%"></div>
            </div>
            <p class="text-sm text-mem-muted mt-2">${stats.live} of ${stats.total} topics available now • ${stats.total - stats.live} coming soon</p>
          </div>
          <div class="text-lg leading-relaxed text-mem-soft mt-6">
            ${(data.description || '').split('\n\n').map(p => `<p class="mb-4 last:mb-0">${p}</p>`).join('')}
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mt-auto pt-10">
          <a href="#explore-topics" class="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-semibold">Explore topics ↓</a>
          <a href="codex.html" class="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-semibold">← Back to Codex</a>
        </div>
      </div>
      <div class="md:col-span-5 flex flex-col h-full items-center md:items-end">
        ${RenderUtils.renderMediaFrame(TopicUtils.encodeAssetPath(data.image), data.title, { loading: 'eager', className: 'w-full max-w-md md:max-w-sm' })}
        ${data.pdf_url ? `
        <div class="mt-auto pt-6">
          <a href="${data.pdf_url}" target="_blank"
             class="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-semibold w-full max-w-[260px]">
            ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} View original PDF
          </a>
        </div>` : ''}
      </div>
    </div>
  `;
}

async function loadSourceViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const sourceId = urlParams.get('source') || 'alice';
  topicsPageState.sourceId = sourceId;
  const container = document.getElementById('topics-container');
  const headerEl = document.getElementById('source-header');

  if (headerEl) headerEl.innerHTML = TopicUtils.skeleton('topics-header');
  if (container) container.innerHTML = TopicUtils.skeleton('topics-list');

  try {
    const fullData = await TopicUtils.fetchSourceIndex(sourceId);
    document.title = `21st Memory Topics | ${fullData.title}`;

    const data = {
      ...fullData,
      topics: TopicUtils.normalizeTopicsFromIndex(fullData.topics || [])
    };
    topicsPageState.data = data;

    const stats = TopicUtils.countTopicStats(data.topics);
    topicsPageState.stats = stats;
    renderSourceHeader(data, sourceId, stats);

    container.innerHTML = `
      <div id="topics-controls"></div>
      <div id="topics-main-root-section" hidden></div>
      <div class="topics-categories-section">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-4xl font-semibold tracking-tight">Topics by Category</h2>
          <div class="hidden md:block text-xs px-4 py-1.5 bg-mem-violet/10 text-mem-muted rounded-full tracking-wide">Click any card to dive deep</div>
        </div>
        <div id="topics-list"></div>
      </div>
    `;

    renderFilterControls();
    renderTopicsList();
    TopicUtils.animateProgressBars(headerEl);

    if (window.location.hash === '#explore-topics') {
      TopicUtils.scrollToAnchor('explore-topics');
    }
  } catch (e) {
    console.error('Topics load error:', e);
    const errorHtml = `
      <div class="text-center py-20">
        <div class="text-red-400 text-xl mb-4">Could not load topics data</div>
        <p class="text-mem-soft max-w-md mx-auto">${e.message}</p>
        <p class="text-sm mt-8 text-mem-muted">Check the browser console (F12) for more details.<br>
        Make sure <strong>data/${sourceId}-topics-index.json</strong> exists and is valid JSON.</p>
      </div>`;
    if (headerEl) headerEl.innerHTML = errorHtml;
    if (container) container.innerHTML = errorHtml;
  }
}

window.addEventListener('load', loadSourceViewer);