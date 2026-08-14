// Codex page — archive stats, search, and source cards

let codexState = {
  sources: [],
  allTopics: [],
  archiveStats: { sources: 0, live: 0, total: 0 },
  filters: { query: '', status: 'all', sort: 'alpha' },
  loading: true,
  searchIndexBuilt: false,
  searchIndexPromise: null
};

const debouncedRenderCodexViews = TopicUtils.debounce(async () => {
  if (TopicUtils.normalizeSearch(codexState.filters.query)) {
    await ensureSearchIndex();
  }
  renderCodexViews();
  syncCodexUrlFromState();
}, 250);

function syncCodexUrlFromState() {
  const { query, status, sort } = codexState.filters;
  TopicUtils.replaceUrlParams({
    q: query,
    status,
    sort
  });
}

function applyCodexFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const status = params.get('status');
  const sort = params.get('sort');
  if (typeof q === 'string') codexState.filters.query = q;
  if (status === 'all' || status === 'ready' || status === 'soon') {
    codexState.filters.status = status;
  }
  if (sort === 'alpha' || sort === 'topics' || sort === 'live') {
    codexState.filters.sort = sort;
  }
}

function ensureSearchIndex() {
  if (codexState.searchIndexBuilt) return Promise.resolve();
  if (!codexState.searchIndexPromise) {
    codexState.searchIndexPromise = Promise.resolve().then(() => {
      codexState.allTopics = codexState.sources.flatMap((bundle) =>
        TopicUtils.flattenTopicTree(bundle.topics, {
          sourceId: bundle.id,
          sourceTitle: bundle.title
        })
      );
      codexState.searchIndexBuilt = true;
    });
  }
  return codexState.searchIndexPromise;
}

function getSoonCount(stats) {
  return Math.max(0, (stats?.total || 0) - (stats?.live || 0));
}

function sortSources(sources, sortKey) {
  const sorted = [...sources];
  if (sortKey === 'topics') {
    return sorted.sort((a, b) => b.stats.total - a.stats.total);
  }
  if (sortKey === 'live') {
    return sorted.sort((a, b) => b.stats.live - a.stats.live);
  }
  return sorted.sort((a, b) => a.title.localeCompare(b.title));
}

function getFilteredSources() {
  const { query, status, sort } = codexState.filters;
  let sources = codexState.sources.filter(source => {
    const entry = {
      title: source.title,
      description: source.description,
      id: source.id,
      sourceTitle: source.title,
      pathTitles: []
    };
    if (!TopicUtils.matchesSearch(entry, query)) return false;
    if (status === 'ready') return source.stats.live > 0;
    if (status === 'soon') return getSoonCount(source.stats) > 0;
    return true;
  });
  return sortSources(sources, sort);
}

function getFilteredTopicResults() {
  const { query, status } = codexState.filters;
  if (!TopicUtils.normalizeSearch(query)) return [];
  let results = codexState.allTopics.filter(entry => TopicUtils.matchesSearch(entry, query));
  return TopicUtils.filterEntriesByStatus(results, status).slice(0, 24);
}

function renderArchiveStats() {
  const el = document.getElementById('codex-archive-stats');
  if (!el) return;

  const { sources, live, total } = codexState.archiveStats;
  const soon = Math.max(0, total - live);
  const pct = total ? Math.round((live / total) * 100) : 0;

  el.innerHTML = `
    <div class="codex-stats-bar codex-hub-panel">
      <div class="codex-stats-grid">
        <div class="codex-stat">
          <div class="codex-stat-value">${sources}</div>
          <div class="codex-stat-label">Transmissions</div>
        </div>
        <div class="codex-stat">
          <div class="codex-stat-value">${total}</div>
          <div class="codex-stat-label">Topics</div>
        </div>
        <div class="codex-stat">
          <div class="codex-stat-value">${live}</div>
          <div class="codex-stat-label">Ready now</div>
        </div>
        <div class="codex-stat">
          <div class="codex-stat-value">${soon}</div>
          <div class="codex-stat-label">Coming soon</div>
        </div>
      </div>
      <div class="codex-stats-progress">
        <div class="flex items-center justify-between text-xs text-mem-muted mb-2">
          <span>Archive progress</span>
          <span>${pct}% complete</span>
        </div>
        <div class="archive-progress-bar" role="progressbar" aria-valuenow="${live}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Archive progress">
          <div class="archive-progress-fill" data-progress="${pct}" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

function renderToolbar() {
  const el = document.getElementById('codex-toolbar');
  if (!el) return;

  const prevInput = el.querySelector('#codex-search-input');
  const shouldRefocusSearch = document.activeElement === prevInput;
  const selectionStart = prevInput?.selectionStart ?? null;
  const selectionEnd = prevInput?.selectionEnd ?? null;

  const { query, status, sort } = codexState.filters;
  const statusButtons = ['all', 'ready', 'soon'].map(value => {
    const label = value === 'all' ? 'All' : value === 'ready' ? 'Ready' : 'Soon';
    const count = value === 'all'
      ? codexState.archiveStats.total
      : value === 'ready'
        ? codexState.archiveStats.live
        : Math.max(0, codexState.archiveStats.total - codexState.archiveStats.live);
    return `
      <button type="button" data-codex-status="${value}" class="topic-control-btn ${status === value ? 'active' : ''}">
        ${label}<span class="topic-control-count">${count}</span>
      </button>
    `;
  }).join('');

  el.innerHTML = `
    <div class="codex-toolbar codex-hub-panel archive-toolbar">
      <div class="codex-search-row">
        <label class="codex-search-field" for="codex-search-input">
          <span class="codex-search-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </span>
          <input
            id="codex-search-input"
            type="search"
            class="codex-search-input"
            placeholder="Search topics…"
            value="${TopicUtils.escapeAttr(query)}"
            autocomplete="off"
            spellcheck="false"
          >
        </label>
        <div class="codex-sort-wrap">
          <label class="codex-sort-label" for="codex-sort-select">Sort</label>
          <select id="codex-sort-select" class="codex-sort-select" aria-label="Sort transmissions">
            <option value="alpha" ${sort === 'alpha' ? 'selected' : ''}>A–Z</option>
            <option value="topics" ${sort === 'topics' ? 'selected' : ''}>Most topics</option>
            <option value="live" ${sort === 'live' ? 'selected' : ''}>Most ready</option>
          </select>
        </div>
      </div>
      <div class="topics-filter-section topics-filter-section--status archive-filter-row">
        <span class="topics-filter-label">Status</span>
        <div class="topics-filter-btn-group topics-filter-btn-group--spaced" role="group" aria-label="Filter by status">${statusButtons}</div>
      </div>
    </div>
  `;

  const searchInput = el.querySelector('#codex-search-input');
  const sortSelect = el.querySelector('#codex-sort-select');

  searchInput?.addEventListener('input', (event) => {
    codexState.filters.query = event.target.value;
    debouncedRenderCodexViews();
  });

  sortSelect?.addEventListener('change', (event) => {
    codexState.filters.sort = event.target.value;
    renderSourcesGrid();
    syncCodexUrlFromState();
  });

  el.querySelectorAll('[data-codex-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      codexState.filters.status = btn.dataset.codexStatus;
      renderToolbar();
      renderCodexViews();
      syncCodexUrlFromState();
    });
  });

  if (shouldRefocusSearch && searchInput) {
    searchInput.focus();
    if (selectionStart != null && selectionEnd != null) {
      searchInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

function renderSourceCard(source) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = RenderUtils.renderSourceCard(
    { ...source, stats: source.stats },
    { soonCount: getSoonCount(source.stats) }
  );
  return wrapper.firstElementChild;
}

function renderSourcesGrid() {
  const container = document.getElementById('sources-grid');
  if (!container) return;

  if (codexState.loading) {
    container.innerHTML = TopicUtils.skeleton('codex-grid');
    return;
  }

  const sources = getFilteredSources();
  container.innerHTML = '';

  if (!sources.length) {
    const hasQuery = !!TopicUtils.normalizeSearch(codexState.filters.query);
    const hasStatus = codexState.filters.status !== 'all';
    container.innerHTML = `
      <div class="col-span-full">
        ${RenderUtils.renderDiscoveryEmpty({
          title: 'No transmissions match',
          message: hasQuery
            ? 'Try a different keyword, or clear filters to see the full archive.'
            : hasStatus
              ? 'No transmissions in this status. Switch to All to browse everything.'
              : 'The Codex is loading sources — try again in a moment.',
          icon: 'search',
          actions: [
            ...(hasQuery || hasStatus
              ? [{ label: 'Clear filters', primary: true, attrs: 'data-codex-clear-filters' }]
              : []),
            { label: 'Browse quizzes', href: 'quizzes.html' }
          ]
        })}
      </div>
    `;
    container.querySelector('[data-codex-clear-filters]')?.addEventListener('click', () => {
      codexState.filters.query = '';
      codexState.filters.status = 'all';
      renderToolbar();
      renderCodexViews();
      syncCodexUrlFromState();
      document.getElementById('codex-search-input')?.focus();
    });
    return;
  }

  sources.forEach((source) => container.appendChild(renderSourceCard(source)));
  RenderUtils.setupImageFallbacks(container, 'img[data-img-fallback], .source-card-img');
}

function renderTopicSearchResults() {
  const section = document.getElementById('codex-topic-results');
  const list = document.getElementById('codex-topic-results-list');
  if (!section || !list) return;

  const query = TopicUtils.normalizeSearch(codexState.filters.query);
  if (!query) {
    section.hidden = true;
    list.innerHTML = '';
    return;
  }

  const results = getFilteredTopicResults();
  section.hidden = false;

  if (!results.length) {
    list.innerHTML = RenderUtils.renderDiscoveryEmpty({
      title: 'No topics found',
      message: 'Search titles, descriptions, or categories — or clear the query to browse transmissions.',
      icon: 'search',
      actions: [
        { label: 'Clear search', primary: true, attrs: 'data-codex-clear-search' },
        { label: 'Explore Alice', href: 'topics.html?source=alice' }
      ]
    });
    list.querySelector('[data-codex-clear-search]')?.addEventListener('click', () => {
      codexState.filters.query = '';
      renderToolbar();
      renderCodexViews();
      syncCodexUrlFromState();
      document.getElementById('codex-search-input')?.focus();
    });
    return;
  }

  list.innerHTML = results.map(entry => TopicUtils.renderTopicSearchCard(entry, { showSource: true })).join('');
}

function renderCodexViews() {
  renderSourcesGrid();
  renderTopicSearchResults();
}

async function loadSourceBundle(source) {
  try {
    const topicData = await TopicUtils.fetchSourceIndex(source.id);
    const lightTopics = TopicUtils.normalizeTopicsFromIndex(topicData.topics || []);
    const stats = TopicUtils.countTopicStats(lightTopics);
    return {
      id: source.id,
      title: topicData.title,
      subtitle: topicData.subtitle || '',
      description: topicData.description || '',
      image: topicData.image || '',
      stats,
      topics: lightTopics
    };
  } catch (error) {
    console.error(`Failed to load topics for ${source.id}:`, error);
    return {
      id: source.id,
      title: `${source.id.charAt(0).toUpperCase() + source.id.slice(1)} Transmission`,
      subtitle: '',
      description: '',
      image: '',
      stats: { live: 0, total: 0 },
      topics: [],
      error: true
    };
  }
}

let codexPendingHash = null;

function handleCodexPillScroll() {
  if (codexPendingHash) {
    TopicUtils.applyCapturedHash(codexPendingHash, { delay: 100 });
    codexPendingHash = null;
    return;
  }
  if (window.location.hash === '#codex-pill') {
    TopicUtils.scrollToAnchor('codex-pill', 100);
  }
}

function initCodexSearchFromUrl() {
  applyCodexFiltersFromUrl();
}

function getCodexNavExtraState() {
  return {
    page: 'codex',
    filters: { ...codexState.filters }
  };
}

function applyPendingCodexFilters() {
  const pending = TopicUtils.peekNavReturnState();
  if (!pending || pending.page !== 'codex') return false;
  if (!pending.filters || typeof pending.filters !== 'object') return false;

  if (typeof pending.filters.query === 'string') {
    codexState.filters.query = pending.filters.query;
  }
  if (pending.filters.status) codexState.filters.status = pending.filters.status;
  if (pending.filters.sort) codexState.filters.sort = pending.filters.sort;
  return true;
}

function finishCodexScrollRestore() {
  return TopicUtils.applyNavReturnAfterRender({
    page: 'codex',
    delay: 60
  });
}

async function loadSources() {
  const statsEl = document.getElementById('codex-archive-stats');
  const gridEl = document.getElementById('sources-grid');

  if (statsEl) statsEl.innerHTML = TopicUtils.skeleton('codex-stats');
  if (gridEl) gridEl.innerHTML = TopicUtils.skeleton('codex-grid');

  try {
    const [sourcesResponse, quickStats] = await Promise.all([
      fetch('data/sources.json'),
      TopicUtils.fetchArchiveStats().catch(() => null)
    ]);
    if (!sourcesResponse.ok) throw new Error(`HTTP ${sourcesResponse.status} — sources.json not found`);
    const sourcesData = await sourcesResponse.json();

    if (quickStats) {
      codexState.archiveStats = quickStats;
      renderArchiveStats();
    }

    const bundles = await Promise.all(sourcesData.sources.map(loadSourceBundle));

    codexState.sources = bundles;
    codexState.allTopics = [];
    codexState.searchIndexBuilt = false;
    codexState.searchIndexPromise = null;
    codexState.archiveStats = bundles.reduce((acc, bundle) => {
      acc.sources += 1;
      acc.live += bundle.stats.live;
      acc.total += bundle.stats.total;
      return acc;
    }, { sources: 0, live: 0, total: 0 });
    codexState.loading = false;

    // URL applied in init; nav-return overrides for Back fidelity
    const restoring = applyPendingCodexFilters();
    if (TopicUtils.normalizeSearch(codexState.filters.query)) {
      await ensureSearchIndex();
    }

    renderArchiveStats();
    renderToolbar();
    renderCodexViews();
    syncCodexUrlFromState();
    TopicUtils.animateProgressBars(statsEl);

    const captureRoot = document.getElementById('main') || document.body;
    TopicUtils.attachTopicNavCapture(captureRoot, getCodexNavExtraState);

    const restored = (restoring || TopicUtils.peekNavReturnState()?.page === 'codex')
      ? finishCodexScrollRestore()
      : null;
    if (!restored) {
      handleCodexPillScroll();
    }
  } catch (error) {
    console.error('Failed to load sources:', error);
    codexState.loading = false;
    if (statsEl) statsEl.innerHTML = '';
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="col-span-full text-center py-12 codex-empty-state">
          ${typeof renderSiteIcon === 'function' ? renderSiteIcon('library', 'card-icon-lg') : ''}
          <div class="text-xl font-semibold mb-2">Archive unavailable</div>
          <p class="text-mem-muted">Could not load Codex data. Please try again later.</p>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TopicUtils.disableNativeScrollRestoration();
  codexPendingHash = TopicUtils.captureAndClearHash();
  initCodexSearchFromUrl();
  loadSources();

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    TopicUtils.consumeNavReturnState((data) => data.page === 'codex');
  });
});