// Topics page — source viewer with filtering, sorting, and progress

let topicsPageState = {
  sourceId: 'alice',
  data: null,
  stats: { live: 0, total: 0 },
  filters: { status: 'all', category: 'all', search: '' }
};

function shouldShowTopic(item, statusFilter) {
  if (statusFilter === 'ready') return !item.is_placeholder;
  if (statusFilter === 'soon') return item.is_placeholder;
  return true;
}

function renderTopicLeaf(sourceId, leaf, extraClass = '') {
  if (!shouldShowTopic(leaf, topicsPageState.filters.status)) return '';
  const leafPh = leaf.is_placeholder;
  const leafClasses = `topic-leaf-btn ${extraClass} ${leafPh ? 'opacity-50 grayscale-[0.5] pointer-events-none' : ''}`;
  const leafBadge = leafPh ? ' <span class="text-[8px] ml-1 px-1 py-px bg-amber-400/80 text-[#1A1433] font-bold rounded">SOON</span>' : '';
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
    const toggleClasses = `category-toggle mb-4 w-full max-w-xl ${subPh ? 'opacity-50 grayscale-[0.4] pointer-events-none' : ''}`;
    const subBadge = subPh ? '<span class="text-[8px] ml-2 px-1.5 py-px bg-amber-400/90 text-[#1A1433] font-bold rounded">SOON</span>' : '';

    let leavesHTML = visibleLeaves.map(leaf => renderTopicLeaf(sourceId, leaf)).join('');
    if (!leavesHTML) return '';

    return `
      <a href="deep-dive.html?source=${sourceId}&topic=${sub.id}" class="${toggleClasses}">
        <span class="chevron">▸</span>
        <span class="flex-1">${sub.title}${subBadge}</span>
        <span class="text-xs px-3 py-1 bg-white/10 rounded-full text-mem-muted">${visibleLeaves.length} topics</span>
      </a>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-14 mb-8">
        ${leavesHTML}
      </div>
    `;
  }

  if (!shouldShowTopic(sub, topicsPageState.filters.status)) return '';
  const subPh = sub.is_placeholder;
  const leafClasses = `topic-leaf-btn mb-3 inline-flex max-w-md ${subPh ? 'opacity-50 grayscale-[0.5] pointer-events-none' : ''}`;
  const leafBadge = subPh ? ' <span class="text-[8px] ml-1 px-1 py-px bg-amber-400/80 text-[#1A1433] font-bold rounded">SOON</span>' : '';
  return `
    <a href="deep-dive.html?source=${sourceId}&topic=${sub.id}" class="${leafClasses}">
      <span>${sub.title}${leafBadge}</span>
    </a>
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
  const rootClasses = `topic-root-card channel-card group no-underline mb-6 ${isPh ? 'opacity-60 grayscale-[0.25] pointer-events-none' : ''}`;
  const placeholderBadge = isPh ? '<div class="absolute -top-1 -right-1 text-[8px] px-2 py-px bg-amber-400 text-[#1A1433] font-bold tracking-[1px] rounded-bl-lg rounded-tr-lg shadow">COMING SOON</div>' : '';

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
          <div class="flex items-center gap-5">
            <div class="root-icon flex-shrink-0 overflow-hidden border-2 border-mem-accent/60 shadow-[0_10px_30px_rgba(109,40,217,0.35)]">
              ${category.topic_image
                ? `<img src="${category.topic_image}" alt="${category.title} visual" class="w-full h-full object-cover" loading="lazy" onerror="this.outerHTML='<div class=\\'flex items-center justify-center h-full text-mem-accent text-xs font-mono tracking-[2px] opacity-70\\'>TOPIC</div>'">`
                : '<div class="flex items-center justify-center h-full text-mem-accent text-xs font-mono tracking-[2px] opacity-70">TOPIC</div>'
              }
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3 mb-2.5">
                <h3 class="text-3xl md:text-[2.05rem] font-semibold tracking-tighter text-white group-hover:text-mem-indigo transition-colors leading-tight">${category.title}</h3>
                <div class="text-[10px] px-2.5 py-1 bg-white/10 rounded-full text-mem-muted font-mono tracking-[0.5px] whitespace-nowrap self-start mt-1">${subCount} CATEGORIES</div>
              </div>
              <p class="text-mem-soft text-[14.5px] leading-relaxed pr-1">${category.description || ''}</p>
            </div>
          </div>
          <div class="mt-auto pt-5">
            <div class="explore-badge inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[1.5px] w-full">
              Explore this realm <span class="text-lg leading-none">→</span>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-3xl pointer-events-none"></div>
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
      ${matches.map(entry => {
        const path = entry.pathTitles.length > 1
          ? entry.pathTitles.slice(0, -1).join(' › ')
          : data.title;
        const statusBadge = entry.is_placeholder
          ? '<span class="codex-meta-pill codex-meta-pill--soon">Coming soon</span>'
          : '<span class="codex-meta-pill">Ready</span>';
        return `
          <a href="${entry.href}" class="codex-topic-result channel-card group">
            <div class="codex-topic-result-top">
              <div>
                <h3 class="text-lg font-semibold text-white group-hover:text-mem-indigo transition-colors">${entry.title}</h3>
              </div>
              ${statusBadge}
            </div>
            <p class="text-sm text-mem-muted mt-2 line-clamp-2">${entry.description || path}</p>
            <div class="text-xs text-mem-soft mt-3">${path}</div>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function renderTopicsList() {
  const { data, sourceId, filters } = topicsPageState;
  const container = document.getElementById('topics-list');
  if (!container || !data) return;

  if (TopicUtils.normalizeSearch(filters.search)) {
    renderTopicsSearchResults();
    return;
  }

  let categories = data.topics;
  if (filters.category !== 'all') {
    categories = categories.filter(c => c.id === filters.category);
  }
  let html = categories.map(cat => renderCategoryBlock(sourceId, cat)).join('');
  if (!html.trim()) {
    html = `<div class="text-center py-16 text-mem-muted">No topics match the current filter. Try a different view.</div>`;
  }
  container.innerHTML = html;
}

function renderFilterControls() {
  const { data, filters, stats } = topicsPageState;
  const controls = document.getElementById('topics-controls');
  if (!controls || !data) return;

  const soonCount = Math.max(0, stats.total - stats.live);
  const categoryTabs = [
    { id: 'all', label: 'All Categories' },
    ...data.topics.map(c => ({ id: c.id, label: c.title }))
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
          <span class="codex-search-icon" aria-hidden="true">⌕</span>
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
    renderTopicsList();
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
    <div class="grid md:grid-cols-12 gap-12 items-start">
      <div class="md:col-span-7 flex flex-col h-full">
        <div class="source-text-block">
          <div class="inline-flex items-center px-4 py-1 rounded-full bg-mem-violet/10 text-mem-indigo text-xs font-semibold tracking-wide mb-4">
            Codex archive · ${stats.live} of ${stats.total} topics live
          </div>
          <h1 class="text-5xl md:text-6xl font-semibold tracking-tighter leading-none">${data.title}</h1>
          <p class="text-2xl text-mem-muted mt-3">${data.subtitle}</p>
          <div class="mt-4">
            <div class="archive-progress-bar" role="progressbar" aria-valuenow="${stats.live}" aria-valuemin="0" aria-valuemax="${stats.total}" aria-label="Archive progress">
              <div class="archive-progress-fill" style="width: ${stats.total ? Math.round((stats.live / stats.total) * 100) : 0}%"></div>
            </div>
            <p class="text-sm text-mem-muted mt-2">${stats.live} of ${stats.total} topics available now • ${stats.total - stats.live} coming soon</p>
          </div>
          <div class="text-lg leading-relaxed text-mem-soft mt-6">
            ${data.description.split('\n\n').map(p => `<p class="mb-4 last:mb-0">${p}</p>`).join('')}
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mt-auto pt-10">
          <a href="#explore-topics" class="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-semibold">Explore topics ↓</a>
          <a href="codex.html" class="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-semibold">← Back to Codex</a>
        </div>
      </div>
      <div class="md:col-span-5 flex flex-col h-full">
        <img src="${data.image}" alt="${data.title}"
             class="rounded-3xl shadow-2xl w-full max-w-md md:max-w-sm border border-mem-violet/20"
             width="600" height="400" loading="eager">
        <div class="mt-auto pt-6">
          <a href="${data.pdf_url}" target="_blank"
             class="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-semibold w-full max-w-[260px]">
            ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} View original PDF
          </a>
        </div>
      </div>
    </div>
  `;
}

async function loadSourceViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const sourceId = urlParams.get('source') || 'alice';
  topicsPageState.sourceId = sourceId;
  const container = document.getElementById('topics-container');

  try {
    const response = await fetch(`data/${sourceId}-topics.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status} - File not found or server error`);

    const fullData = await response.json();
    document.title = `21st Memory Topics | ${fullData.title}`;

    const data = {
      ...fullData,
      topics: TopicUtils.createLightweightTopics(fullData.topics || [])
    };
    topicsPageState.data = data;

    const stats = TopicUtils.countTopicStats(data.topics);
    topicsPageState.stats = stats;
    renderSourceHeader(data, sourceId, stats);

    container.innerHTML = `
      <div id="topics-controls"></div>
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-4xl font-semibold tracking-tight">Topics by Category</h2>
        <div class="hidden md:block text-xs px-4 py-1.5 bg-mem-violet/10 text-mem-muted rounded-full tracking-wide">Click any card to dive deep</div>
      </div>
      <div id="topics-list"></div>
    `;

    renderFilterControls();
    renderTopicsList();

    if (window.location.hash === '#explore-topics') {
      TopicUtils.scrollToAnchor('explore-topics');
    }
  } catch (e) {
    console.error('Topics load error:', e);
    container.innerHTML = `
      <div class="text-center py-20">
        <div class="text-red-400 text-xl mb-4">❌ Could not load topics data</div>
        <p class="text-mem-soft max-w-md mx-auto">${e.message}</p>
        <p class="text-sm mt-8 text-mem-muted">Check the browser console (F12) for more details.<br>
        Make sure <strong>data/${sourceId}-topics.json</strong> exists and is valid JSON.</p>
      </div>`;
  }
}

window.addEventListener('load', loadSourceViewer);