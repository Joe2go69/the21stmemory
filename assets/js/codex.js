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
}, 250);

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
    <div class="codex-stats-bar static-card rounded-2xl">
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
    const label = value === 'all' ? 'All' : value === 'ready' ? 'Ready' : 'Coming soon';
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
    <div class="codex-toolbar static-card rounded-2xl">
      <div class="codex-toolbar-header">
        <div>
          <div class="topics-filter-title">Search the archive</div>
          <p class="topics-filter-subtitle">Find transmissions and topics across the full Codex</p>
        </div>
      </div>
      <div class="codex-search-row">
        <label class="codex-search-field" for="codex-search-input">
          <span class="codex-search-icon" aria-hidden="true">⌕</span>
          <input
            id="codex-search-input"
            type="search"
            class="codex-search-input"
            placeholder="Search topics, sources, or keywords…"
            value="${TopicUtils.escapeAttr(query)}"
            autocomplete="off"
            spellcheck="false"
          >
        </label>
        <div class="codex-sort-wrap">
          <label class="codex-sort-label" for="codex-sort-select">Sort</label>
          <select id="codex-sort-select" class="codex-sort-select">
            <option value="alpha" ${sort === 'alpha' ? 'selected' : ''}>A–Z</option>
            <option value="topics" ${sort === 'topics' ? 'selected' : ''}>Most topics</option>
            <option value="live" ${sort === 'live' ? 'selected' : ''}>Most ready</option>
          </select>
        </div>
      </div>
      <div class="topics-filter-section topics-filter-section--status">
        <span class="topics-filter-label">Status</span>
        <div class="topics-filter-btn-group">${statusButtons}</div>
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
  });

  el.querySelectorAll('[data-codex-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      codexState.filters.status = btn.dataset.codexStatus;
      renderToolbar();
      renderCodexViews();
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
    container.innerHTML = `
      <div class="col-span-full codex-empty-state">
        <div class="text-lg font-semibold mb-2">No transmissions match your search</div>
        <p class="text-mem-muted">Try a different keyword or clear the status filter.</p>
      </div>
    `;
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
    list.innerHTML = `
      <div class="codex-empty-state">
        <div class="text-lg font-semibold mb-2">No topics found for this search</div>
        <p class="text-mem-muted">Search titles, descriptions, or category names across the archive.</p>
      </div>
    `;
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

    renderArchiveStats();
    renderToolbar();
    renderCodexViews();
    TopicUtils.animateProgressBars(statsEl);
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

function handleCodexPillScroll() {
  if (window.location.hash === '#codex-pill') {
    TopicUtils.scrollToAnchor('codex-pill', 200);
  }
}

function initCodexSearchFromUrl() {
  const query = new URLSearchParams(window.location.search).get('q');
  if (query) codexState.filters.query = query;
}

document.addEventListener('DOMContentLoaded', () => {
  initCodexSearchFromUrl();
  loadSources();
  handleCodexPillScroll();
});