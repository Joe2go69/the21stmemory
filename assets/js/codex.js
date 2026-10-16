// Codex page — archive stats, search, and source cards

let codexState = {
  sources: [],
  allTopics: [],
  archiveStats: { sources: 0, live: 0, total: 0 },
  filters: { query: '', status: 'all', sort: 'alpha' },
  loading: true,
  resultLimit: 24,
  hasScrolledToResults: false,
  searchIndexBuilt: false,
  searchIndexPromise: null
};

const CODEX_RESULTS_PAGE = 24;

const debouncedRenderCodexViews = TopicUtils.debounce(async () => {
  const hasQuery = !!TopicUtils.normalizeSearch(codexState.filters.query);
  if (hasQuery) {
    await ensureSearchIndex();
  }
  renderToolbarStatusVisibility();
  renderCodexViews();
  syncCodexUrlFromState();
  if (hasQuery) scrollResultsIntoViewOnMobile();
}, 250);

/**
 * Phones: the hero + stats push the search box low, and the keyboard covers
 * whatever is under it. On the first keystroke of a search, bring the search
 * box to the top so results are visible directly under it.
 */
function scrollResultsIntoViewOnMobile() {
  if (codexState.hasScrolledToResults) return;
  if (!window.matchMedia('(max-width: 767px)').matches) return;
  const toolbar = document.getElementById('codex-toolbar');
  if (!toolbar) return;
  codexState.hasScrolledToResults = true;
  const nav = document.querySelector('.navbar');
  const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 64;
  const top = toolbar.getBoundingClientRect().top + window.pageYOffset - navH - 8;
  if (Math.abs(top - window.pageYOffset) < 24) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
}

/** Lower score = better match. Infinity = no match. */
function scoreTopicMatch(entry, q, tokens) {
  const title = TopicUtils.normalizeSearch(entry.title);
  const desc = TopicUtils.normalizeSearch(entry.description);
  const rest = TopicUtils.normalizeSearch([
    entry.id,
    entry.sourceTitle,
    entry.sourceId,
    ...(entry.pathTitles || [])
  ].join(' '));
  const wordStart = (text, term) => text.startsWith(term) || text.includes(` ${term}`)
    || new RegExp(`[^a-z0-9]${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text);

  if (title === q) return 0;
  if (title.startsWith(q)) return 1;
  if (wordStart(title, q)) return 2;
  if (title.includes(q)) return 3;
  if (tokens.length > 1 && tokens.every(t => title.includes(t))) return 4;
  if (desc.includes(q)) return 5;
  const all = `${title} ${desc} ${rest}`;
  if (tokens.length > 1 && tokens.every(t => title.includes(t) || desc.includes(t))) return 6;
  if (all.includes(q)) return 7;
  if (tokens.length > 1 && tokens.every(t => all.includes(t))) return 8;
  return Infinity;
}

function rankTopicResults(entries, query) {
  const q = TopicUtils.normalizeSearch(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return entries
    .map((entry, order) => ({ entry, order, score: scoreTopicMatch(entry, q, tokens) }))
    .filter(r => Number.isFinite(r.score))
    .sort((a, b) => (a.score - b.score)
      || ((a.entry.is_placeholder ? 1 : 0) - (b.entry.is_placeholder ? 1 : 0))
      || (a.order - b.order))
    .map(r => r.entry);
}

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
    return TopicUtils.matchesSearch(entry, query);
  });
  return sortSources(sources, sort);
}

/** All ranked topic matches for the current query + status (no limit). */
function getFilteredTopicResults() {
  const { query, status } = codexState.filters;
  if (!TopicUtils.normalizeSearch(query)) return [];
  const ranked = rankTopicResults(codexState.allTopics, query);
  return TopicUtils.filterEntriesByStatus(ranked, status);
}

function renderArchiveStats() {
  const el = document.getElementById('codex-archive-stats');
  if (!el) return;

  const { sources, live, total } = codexState.archiveStats;
  const soon = Math.max(0, total - live);
  const pct = total ? Math.round((live / total) * 100) : 0;
  el.setAttribute('aria-busy', 'false');

  el.innerHTML = `
    <div class="codex-stats-bar codex-hub-panel">
      <div class="codex-stats-grid">
        <div class="codex-stat">
          <div class="codex-stat-value">${sources}</div>
          <div class="codex-stat-label">Series</div>
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
          <div class="codex-stat-label">On the way</div>
        </div>
      </div>
      <div class="codex-stats-progress">
        <div class="flex items-center justify-between text-xs text-mem-muted mb-2">
          <span>${live} of ${total} topics ready</span>
          <span>${pct}% complete</span>
        </div>
        <div class="archive-progress-bar" role="progressbar" aria-valuenow="${live}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Archive progress">
          <div class="archive-progress-fill" data-progress="${pct}" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

/** Counts on the Status chips reflect the current search, not the whole archive. */
function getStatusCount(value) {
  const { query } = codexState.filters;
  if (!TopicUtils.normalizeSearch(query) || !codexState.searchIndexBuilt) {
    if (value === 'all') return codexState.archiveStats.total;
    if (value === 'ready') return codexState.archiveStats.live;
    return Math.max(0, codexState.archiveStats.total - codexState.archiveStats.live);
  }
  const ranked = rankTopicResults(codexState.allTopics, query);
  return TopicUtils.filterEntriesByStatus(ranked, value).length;
}

/** Show the Ready/Soon chips only while a search is active; refresh their counts. */
function renderToolbarStatusVisibility() {
  const row = document.getElementById('codex-status-row');
  if (!row) return;
  row.hidden = !TopicUtils.normalizeSearch(codexState.filters.query);
  row.querySelectorAll('[data-codex-status]').forEach(btn => {
    const countEl = btn.querySelector('.topic-control-count');
    if (countEl) countEl.textContent = String(getStatusCount(btn.dataset.codexStatus));
  });
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
    const count = getStatusCount(value);
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
      <div class="topics-filter-section topics-filter-section--status archive-filter-row" id="codex-status-row"${TopicUtils.normalizeSearch(query) ? '' : ' hidden'}>
        <span class="topics-filter-label">Status</span>
        <div class="topics-filter-btn-group topics-filter-btn-group--spaced" role="group" aria-label="Filter by status">${statusButtons}</div>
      </div>
    </div>
  `;

  const searchInput = el.querySelector('#codex-search-input');
  const sortSelect = el.querySelector('#codex-sort-select');

  searchInput?.addEventListener('input', (event) => {
    codexState.filters.query = event.target.value;
    codexState.resultLimit = CODEX_RESULTS_PAGE;
    if (!TopicUtils.normalizeSearch(event.target.value)) codexState.hasScrolledToResults = false;
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
      codexState.resultLimit = CODEX_RESULTS_PAGE;
      renderToolbar();
      renderCodexViews();
      syncCodexUrlFromState();
    });
  });

  if (typeof initVaultSelects === 'function') initVaultSelects(el);

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
  const seriesHeading = document.getElementById('codex-series-heading');
  const hasActiveQuery = !!TopicUtils.normalizeSearch(codexState.filters.query);

  // While searching, the topic results own the empty state. If no series
  // matches the query, hide the Series block instead of stacking a second
  // "nothing found" message under the first.
  if (hasActiveQuery && !sources.length) {
    container.hidden = true;
    if (seriesHeading) seriesHeading.hidden = true;
    return;
  }
  container.hidden = false;
  if (seriesHeading) seriesHeading.hidden = false;

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
            { label: 'Explore Alice', href: 'topics.html?source=alice' }
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

  const allResults = getFilteredTopicResults();
  const results = allResults.slice(0, codexState.resultLimit);
  section.hidden = false;

  const countEl = document.getElementById('codex-topic-results-count');
  const moreWrap = document.getElementById('codex-topic-results-more');
  if (countEl) {
    countEl.textContent = allResults.length
      ? `${allResults.length} ${allResults.length === 1 ? 'match' : 'matches'}`
      : '';
  }
  if (moreWrap) {
    const remaining = allResults.length - results.length;
    moreWrap.hidden = remaining <= 0;
    moreWrap.innerHTML = remaining > 0
      ? `<button type="button" class="btn-secondary codex-show-more-btn" data-codex-show-more>Show more <span class="codex-show-more-count">(${remaining} more)</span></button>`
      : '';
    moreWrap.querySelector('[data-codex-show-more]')?.addEventListener('click', () => {
      const firstNew = codexState.resultLimit;
      codexState.resultLimit += CODEX_RESULTS_PAGE;
      renderTopicSearchResults();
      // Keep keyboard users in place: move focus to the first newly shown result.
      const cards = list.querySelectorAll('.codex-search-card');
      const target = cards[firstNew];
      if (target) {
        const focusable = target.matches('a') ? target : target.querySelector('a');
        if (focusable) focusable.focus({ preventScroll: true });
      }
    });
  }

  if (!results.length) {
    const statusNote = codexState.filters.status !== 'all';
    list.innerHTML = RenderUtils.renderDiscoveryEmpty({
      title: 'No topics found',
      message: statusNote
        ? 'Nothing matches with this filter. Try All, a different keyword, or clear the search to browse the series.'
        : 'Try a different keyword, or clear the search to browse the series.',
      icon: 'search',
      actions: [
        { label: 'Clear search', primary: true, attrs: 'data-codex-clear-search' },
        { label: 'Explore Alice', href: 'topics.html?source=alice' }
      ]
    });
    list.querySelector('[data-codex-clear-search]')?.addEventListener('click', () => {
      codexState.filters.query = '';
      codexState.filters.status = 'all';
      codexState.hasScrolledToResults = false;
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

function sourceGridSkeletonHtml(count) {
  const n = Math.max(1, count || 4);
  const card = `<div class="skeleton skeleton-source-card" aria-hidden="true" style="background-color:#0F0A1F"><div class="skeleton skeleton-block" style="height:10rem"></div><div class="skeleton skeleton-bar" style="width:70%"></div><div class="skeleton skeleton-bar" style="width:90%"></div></div>`;
  return card.repeat(n);
}

async function loadSources() {
  const statsEl = document.getElementById('codex-archive-stats');
  const gridEl = document.getElementById('sources-grid');

  if (statsEl && !statsEl.querySelector('.codex-stats-bar')) {
    statsEl.setAttribute('aria-busy', 'true');
    statsEl.innerHTML = TopicUtils.skeleton('codex-stats');
  }
  if (gridEl && !gridEl.querySelector('.source-card, .skeleton-source-card')) {
    gridEl.innerHTML = sourceGridSkeletonHtml(4);
  }

  try {
    const [sourcesResponse, quickStats] = await Promise.all([
      fetch('data/sources.json'),
      TopicUtils.fetchArchiveStats().catch(() => null)
    ]);
    if (!sourcesResponse.ok) throw new Error(`HTTP ${sourcesResponse.status} — sources.json not found`);
    const sourcesData = await sourcesResponse.json();
    const sourceList = sourcesData.sources || [];

    if (quickStats && Number.isFinite(quickStats.sources)) {
      codexState.archiveStats = {
        sources: quickStats.sources,
        live: quickStats.live,
        total: quickStats.total
      };
      renderArchiveStats();
    }

    if (gridEl && !gridEl.querySelector('.source-card')) {
      gridEl.innerHTML = sourceGridSkeletonHtml(sourceList.length);
    }

    const bundles = await Promise.all(sourceList.map(loadSourceBundle));

    codexState.sources = bundles;
    codexState.allTopics = [];
    codexState.searchIndexBuilt = false;
    codexState.searchIndexPromise = null;
    if (!quickStats || !Number.isFinite(quickStats.sources)) {
      codexState.archiveStats = bundles.reduce((acc, bundle) => {
        acc.sources += 1;
        acc.live += bundle.stats.live;
        acc.total += bundle.stats.total;
        return acc;
      }, { sources: 0, live: 0, total: 0 });
    }
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
    if (statsEl) {
      statsEl.setAttribute('aria-busy', 'false');
      statsEl.innerHTML = '';
    }
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