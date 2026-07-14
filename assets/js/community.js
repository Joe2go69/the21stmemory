// Community / Network page — filterable channel directory

const NETWORK_FILTERS = [
  { id: 'all', label: 'All channels' },
  { id: 'official', label: 'Official' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'rumble', label: 'Rumble' }
];

const NETWORK_SECTION_ORDER = ['official', 'telegram', 'rumble'];
const NETWORK_SECTION_LABELS = {
  official: 'Official',
  telegram: 'Telegram',
  rumble: 'Rumble'
};

let networkChannels = [];
let activeNetworkFilter = 'all';
let networkSearchQuery = '';
let networkSearchTimer = null;

function countFor(filterId) {
  if (filterId === 'all') return networkChannels.length;
  return networkChannels.filter((channel) => channel.section === filterId).length;
}

function setActiveNetworkFilter(filterId) {
  activeNetworkFilter = filterId;
  renderNetworkFilters();
  renderNetworkGrid();
  announceNetworkResults();
}

function getFilteredChannels() {
  let channels = activeNetworkFilter === 'all'
    ? networkChannels.slice()
    : networkChannels.filter((channel) => channel.section === activeNetworkFilter);

  const q = networkSearchQuery.trim().toLowerCase();
  if (q) {
    channels = channels.filter((channel) => {
      const haystack = [
        channel.title,
        channel.label,
        channel.description,
        channel.section,
        channel.action,
        channel.badge
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  return channels;
}

function renderNetworkFilters() {
  const container = document.getElementById('network-filters');
  const panel = document.getElementById('network-grid');
  if (!container) return;

  const activeId = `network-filter-${activeNetworkFilter}`;
  const hadFocus = document.activeElement && container.contains(document.activeElement);

  container.innerHTML = NETWORK_FILTERS.map((filter) => {
    const isActive = activeNetworkFilter === filter.id;
    const count = countFor(filter.id);
    return `
    <button type="button"
            id="network-filter-${TopicUtils.escapeAttr(filter.id)}"
            class="network-filter-btn topic-control-btn${isActive ? ' active' : ''}"
            data-network-filter="${TopicUtils.escapeAttr(filter.id)}"
            role="tab"
            aria-selected="${isActive}"
            aria-controls="network-grid"
            tabindex="${isActive ? '0' : '-1'}">
      <span>${TopicUtils.escapeHtml(filter.label)}</span>
      <span class="topic-control-count" aria-hidden="true">${count}</span>
    </button>
  `;
  }).join('');

  if (panel) {
    panel.setAttribute('aria-labelledby', activeId);
  }

  container.querySelectorAll('[data-network-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveNetworkFilter(btn.dataset.networkFilter);
    });
  });

  if (hadFocus) {
    document.getElementById(activeId)?.focus();
  }

  if (!container.dataset.tabsBound) {
    container.dataset.tabsBound = 'true';
    container.addEventListener('keydown', (event) => {
      const tabs = [...container.querySelectorAll('[role="tab"]')];
      const currentIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      const nextId = tabs[nextIndex]?.dataset.networkFilter;
      if (nextId) {
        setActiveNetworkFilter(nextId);
        document.getElementById(`network-filter-${nextId}`)?.focus();
      }
    });
  }
}

function renderNetworkSkeleton(count = 8) {
  return Array.from({ length: count }, () => `
    <div class="skeleton skeleton-panel channel-card rounded-3xl network-skeleton-card" aria-hidden="true">
      <div class="skeleton-bar" style="width:40%;height:0.7rem;margin-bottom:1rem;"></div>
      <div class="skeleton-bar" style="width:70%;height:1.25rem;margin-bottom:1.25rem;"></div>
      <div class="skeleton-bar" style="width:100%;height:0.75rem;margin-bottom:0.5rem;"></div>
      <div class="skeleton-bar" style="width:90%;height:0.75rem;margin-bottom:0.5rem;"></div>
      <div class="skeleton-bar" style="width:55%;height:0.75rem;margin-top:auto;"></div>
    </div>
  `).join('');
}

function renderFeaturedRow() {
  const section = document.getElementById('network-featured');
  const grid = document.getElementById('network-featured-grid');
  if (!section || !grid) return;

  const featured = networkChannels
    .filter((channel) => channel.featured)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));

  if (!featured.length) {
    section.hidden = true;
    grid.innerHTML = '';
    return;
  }

  section.hidden = false;
  grid.innerHTML = featured
    .map((channel) => RenderUtils.renderNetworkCard(channel, { featured: true }))
    .join('');

  if (typeof hydrateSiteIcons === 'function') {
    hydrateSiteIcons(grid);
  }
}

function renderFeaturedSkeleton() {
  return Array.from({ length: 4 }, () => `
    <div class="skeleton network-skeleton-card" aria-hidden="true">
      <div class="skeleton-bar" style="width:35%;height:0.65rem;margin-bottom:0.75rem;"></div>
      <div class="skeleton-bar" style="width:60%;height:1.1rem;margin-bottom:0.85rem;"></div>
      <div class="skeleton-bar" style="width:100%;height:0.65rem;margin-bottom:0.4rem;"></div>
      <div class="skeleton-bar" style="width:85%;height:0.65rem;margin-bottom:0.4rem;"></div>
      <div class="skeleton-bar" style="width:40%;height:0.65rem;margin-top:auto;"></div>
    </div>
  `).join('');
}

function renderNetworkCardsHtml(channels, { groupBySection = false } = {}) {
  if (!channels.length) return '';

  if (!groupBySection) {
    return channels.map((channel) => RenderUtils.renderNetworkCard(channel)).join('');
  }

  return NETWORK_SECTION_ORDER.map((section) => {
    const items = channels.filter((channel) => channel.section === section);
    if (!items.length) return '';
    const label = NETWORK_SECTION_LABELS[section] || section;
    return `
      <div class="col-span-full network-section-heading">
        <h3 class="network-section-title">${TopicUtils.escapeHtml(label)}</h3>
      </div>
      ${items.map((channel) => RenderUtils.renderNetworkCard(channel)).join('')}
    `;
  }).join('');
}

function renderNetworkGrid() {
  const grid = document.getElementById('network-grid');
  if (!grid) return;

  const channels = getFilteredChannels();
  grid.setAttribute('aria-busy', 'false');

  if (!channels.length) {
    const hasData = networkChannels.length > 0;
    const searching = networkSearchQuery.trim().length > 0;
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-mem-muted network-empty-state">
        <p class="mb-4">${
          !hasData
            ? 'Could not load network directory.'
            : searching
              ? 'No channels match your search.'
              : 'No channels match this filter.'
        }</p>
        ${!hasData ? `
          <button type="button" class="btn-primary network-retry-btn" id="network-retry-btn">
            Try again
          </button>
        ` : searching ? `
          <button type="button" class="btn-secondary network-retry-btn" id="network-clear-search-btn">
            Clear search
          </button>
        ` : ''}
      </div>
    `;

    document.getElementById('network-retry-btn')?.addEventListener('click', () => {
      loadNetworkData();
    });
    document.getElementById('network-clear-search-btn')?.addEventListener('click', () => {
      const input = document.getElementById('network-search');
      networkSearchQuery = '';
      if (input) input.value = '';
      renderNetworkGrid();
      announceNetworkResults();
      input?.focus();
    });
    return;
  }

  const groupBySection = activeNetworkFilter === 'all' && !networkSearchQuery.trim();
  grid.innerHTML = renderNetworkCardsHtml(channels, { groupBySection });

  if (typeof hydrateSiteIcons === 'function') {
    hydrateSiteIcons(grid);
  }
}

function announceNetworkResults() {
  const live = document.getElementById('network-live');
  if (!live) return;

  const channels = getFilteredChannels();
  const filterLabel = NETWORK_FILTERS.find((f) => f.id === activeNetworkFilter)?.label || 'channels';
  const q = networkSearchQuery.trim();

  if (!networkChannels.length) {
    live.textContent = 'Network directory unavailable.';
    return;
  }

  if (q) {
    live.textContent = `Showing ${channels.length} channel${channels.length === 1 ? '' : 's'} matching “${q}”.`;
  } else if (activeNetworkFilter === 'all') {
    live.textContent = `Showing all ${channels.length} channels.`;
  } else {
    live.textContent = `Showing ${channels.length} ${filterLabel} channel${channels.length === 1 ? '' : 's'}.`;
  }
}

function bindNetworkSearch() {
  const input = document.getElementById('network-search');
  if (!input || input.dataset.bound) return;
  input.dataset.bound = 'true';

  input.addEventListener('input', () => {
    clearTimeout(networkSearchTimer);
    networkSearchTimer = setTimeout(() => {
      networkSearchQuery = input.value || '';
      renderNetworkGrid();
      announceNetworkResults();
    }, 180);
  });
}

function getNetworkPayload() {
  const el = document.getElementById('network-data');
  if (el?.textContent?.trim()) {
    try {
      return JSON.parse(el.textContent);
    } catch (error) {
      console.warn('Invalid inline network data:', error);
    }
  }
  return null;
}

function renderNoscriptList(channels) {
  const noscriptHost = document.getElementById('network-noscript-list');
  if (!noscriptHost || !channels.length) return;

  noscriptHost.innerHTML = channels.map((channel) => {
    const title = TopicUtils.escapeHtml(channel.title || 'Channel');
    const label = TopicUtils.escapeHtml(channel.label || '');
    const href = TopicUtils.escapeAttr(channel.href || '#');
    const section = TopicUtils.escapeHtml(NETWORK_SECTION_LABELS[channel.section] || channel.section || '');
    return `<li><a href="${href}" rel="noopener noreferrer">${title}${label ? ` — ${label}` : ''}${section ? ` (${section})` : ''}</a></li>`;
  }).join('');
}

async function loadNetworkData() {
  const grid = document.getElementById('network-grid');
  const featuredGrid = document.getElementById('network-featured-grid');
  const featuredSection = document.getElementById('network-featured');
  if (grid) {
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = renderNetworkSkeleton(6);
  }
  if (featuredGrid) {
    if (featuredSection) featuredSection.hidden = false;
    featuredGrid.innerHTML = renderFeaturedSkeleton();
  }

  try {
    const inline = getNetworkPayload();
    if (inline?.channels) {
      networkChannels = inline.channels;
    } else {
      const response = await fetch('data/network.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      networkChannels = data.channels || [];
    }
  } catch (error) {
    console.error('Failed to load network data:', error);
    networkChannels = [];
  }

  renderFeaturedRow();
  renderNetworkFilters();
  renderNetworkGrid();
  announceNetworkResults();
  renderNoscriptList(networkChannels);
}

document.addEventListener('DOMContentLoaded', () => {
  bindNetworkSearch();
  loadNetworkData();
});
