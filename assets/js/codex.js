// Codex page — archive stats, search, and source cards

let codexState = {
  sources: [],
  allTopics: [],
  archiveStats: { sources: 0, live: 0, total: 0 },
  filters: { query: '', status: 'all', sort: 'alpha' },
  loading: true
};

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
          <div class="archive-progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

function renderToolbar() {
  const el = document.getElementById('codex-toolbar');
  if (!el) return;

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
            value="${query.replace(/"/g, '&quot;')}"
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
    renderCodexViews();
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
}

function renderSourceCard(source) {
  const card = document.createElement('a');
  card.href = `topics.html?source=${source.id}`;
  card.className = 'memory-card content-card channel-card group flex flex-col h-full source-card';
  card.dataset.sourceId = source.id;

  const soon = getSoonCount(source.stats);
  const imageHTML = source.image
    ? `<div class="mb-6"><img src="${source.image}" alt="${source.title}" class="w-full h-40 max-h-48 object-cover rounded-t-3xl" width="400" height="160" loading="lazy"></div>`
    : `<div class="mb-6 h-40 bg-mem-inset rounded-t-3xl flex items-center justify-center">${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}</div>`;

  card.innerHTML = `
    ${imageHTML}
    <div class="flex items-start justify-between mb-4">
      <div>
        <div class="card-label text-mem-indigo">${source.id}</div>
        <h3 class="text-2xl font-semibold mt-1 text-white">${source.title}</h3>
      </div>
      ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
    </div>
    <p class="text-sm text-mem-muted mb-4 line-clamp-2">${source.subtitle || source.description || ''}</p>
    <div class="codex-source-meta">
      <span class="codex-meta-pill">${source.stats.live} ready</span>
      ${soon ? `<span class="codex-meta-pill codex-meta-pill--soon">${soon} soon</span>` : ''}
    </div>
    <div class="flex-grow"></div>
    <div class="inline-flex items-center text-sm font-semibold text-mem-indigo group-hover:text-white card-action mt-4">
      Explore this source
      <span class="group-hover:translate-x-1 transition ml-2">→</span>
    </div>
  `;

  return card;
}

function renderSourcesGrid() {
  const container = document.getElementById('sources-grid');
  if (!container) return;

  if (codexState.loading) {
    container.innerHTML = `<div class="col-span-full codex-loading">Loading archive…</div>`;
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

  sources.forEach(source => container.appendChild(renderSourceCard(source)));
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

  list.innerHTML = results.map(entry => {
    const path = entry.pathTitles.length > 1
      ? entry.pathTitles.slice(0, -1).join(' › ')
      : entry.sourceTitle;
    const statusBadge = entry.is_placeholder
      ? '<span class="codex-meta-pill codex-meta-pill--soon">Coming soon</span>'
      : '<span class="codex-meta-pill">Ready</span>';

    return `
      <a href="${entry.href}" class="codex-topic-result channel-card group">
        <div class="codex-topic-result-top">
          <div>
            <div class="card-label text-mem-indigo">${entry.sourceTitle}</div>
            <h3 class="text-lg font-semibold text-white group-hover:text-mem-indigo transition-colors">${entry.title}</h3>
          </div>
          ${statusBadge}
        </div>
        <p class="text-sm text-mem-muted mt-2 line-clamp-2">${entry.description || path}</p>
        <div class="text-xs text-mem-soft mt-3">${path}</div>
      </a>
    `;
  }).join('');
}

function renderCodexViews() {
  renderSourcesGrid();
  renderTopicSearchResults();
}

async function loadSourceBundle(source) {
  try {
    const topicResponse = await fetch(`data/${source.id}-topics.json`);
    if (!topicResponse.ok) throw new Error(`HTTP ${topicResponse.status}`);
    const topicData = await topicResponse.json();
    const lightTopics = TopicUtils.createLightweightTopics(topicData.topics || []);
    const stats = TopicUtils.countTopicStats(lightTopics);
    const flatTopics = TopicUtils.flattenTopicTree(lightTopics, {
      sourceId: source.id,
      sourceTitle: topicData.title
    });

    return {
      id: source.id,
      title: topicData.title,
      subtitle: topicData.subtitle || '',
      description: topicData.description || '',
      image: topicData.image || '',
      stats,
      topics: lightTopics,
      flatTopics
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
      flatTopics: [],
      error: true
    };
  }
}

async function loadSources() {
  const statsEl = document.getElementById('codex-archive-stats');
  const gridEl = document.getElementById('sources-grid');

  try {
    const sourcesResponse = await fetch('data/sources.json');
    const sourcesData = await sourcesResponse.json();
    const bundles = await Promise.all(sourcesData.sources.map(loadSourceBundle));

    codexState.sources = bundles;
    codexState.allTopics = bundles.flatMap(bundle => bundle.flatTopics);
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

document.addEventListener('DOMContentLoaded', () => {
  loadSources();
  handleCodexPillScroll();
});