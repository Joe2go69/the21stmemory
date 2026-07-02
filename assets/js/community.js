// Community / Network page — filterable channel directory

const NETWORK_FILTERS = [
  { id: 'all', label: 'All channels' },
  { id: 'official', label: 'Official' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'rumble', label: 'Rumble' }
];

let networkChannels = [];
let activeNetworkFilter = 'all';

function setActiveNetworkFilter(filterId) {
  activeNetworkFilter = filterId;
  renderNetworkFilters();
  renderNetworkGrid();
}

function renderNetworkFilters() {
  const container = document.getElementById('network-filters');
  const panel = document.getElementById('network-grid');
  if (!container) return;

  container.innerHTML = NETWORK_FILTERS.map((filter) => {
    const isActive = activeNetworkFilter === filter.id;
    return `
    <button type="button"
            id="network-filter-${TopicUtils.escapeAttr(filter.id)}"
            class="network-filter-btn topic-control-btn${isActive ? ' active' : ''}"
            data-network-filter="${TopicUtils.escapeAttr(filter.id)}"
            role="tab"
            aria-selected="${isActive}"
            aria-controls="network-grid"
            tabindex="${isActive ? '0' : '-1'}">
      ${TopicUtils.escapeHtml(filter.label)}
    </button>
  `;
  }).join('');

  if (panel) {
    panel.setAttribute('aria-labelledby', `network-filter-${activeNetworkFilter}`);
  }

  container.querySelectorAll('[data-network-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveNetworkFilter(btn.dataset.networkFilter);
    });
  });

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

function renderNetworkGrid() {
  const grid = document.getElementById('network-grid');
  if (!grid) return;

  const channels = activeNetworkFilter === 'all'
    ? networkChannels
    : networkChannels.filter(channel => channel.section === activeNetworkFilter);

  if (!channels.length) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-mem-muted">
        ${networkChannels.length ? 'No channels match this filter.' : 'Could not load network directory.'}
      </div>
    `;
    return;
  }

  grid.innerHTML = channels.map(channel => RenderUtils.renderNetworkCard(channel)).join('');

  if (typeof hydrateSiteIcons === 'function') {
    hydrateSiteIcons(grid);
  }
}

async function loadNetworkData() {
  try {
    const response = await fetch('data/network.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    networkChannels = data.channels || [];
  } catch (error) {
    console.error('Failed to load network data:', error);
    networkChannels = [];
  }

  renderNetworkFilters();
  renderNetworkGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  loadNetworkData();
});