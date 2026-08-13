// Topics page — source viewer with filtering, sorting, and progress

const debouncedRenderTopicsList = TopicUtils.debounce(() => {
  renderTopicsList();
  syncTopicsUrlFromState();
}, 250);

let topicsPageState = {
  sourceId: 'alice',
  data: null,
  stats: { live: 0, total: 0 },
  filters: { status: 'all', category: 'all', search: '' }
};

function syncTopicsUrlFromState() {
  const { status, category, search } = topicsPageState.filters;
  TopicUtils.replaceUrlParams({
    source: topicsPageState.sourceId,
    status,
    category,
    q: search
  });
}

function applyTopicsFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const category = params.get('category');
  const q = params.get('q');
  if (status === 'all' || status === 'ready' || status === 'soon') {
    topicsPageState.filters.status = status;
  }
  if (category) {
    topicsPageState.filters.category = category;
  }
  if (typeof q === 'string') {
    topicsPageState.filters.search = q;
  }
}

function topicImageFallbackHtml() {
  const icon = typeof renderSiteIcon === "function" ? renderSiteIcon("archive", "card-icon-sm") : "";
  return `<div class="topic-image-fallback">${icon}<span>Image unavailable</span></div>`;
}

function topicImageComingSoonHtml({ compact = false } = {}) {
  const icon = typeof renderSiteIcon === "function" ? renderSiteIcon("archive", compact ? "card-icon-sm" : "card-icon-sm") : "";
  if (compact) {
    return `<div class="topic-image-fallback topic-image-fallback--soon topic-image-fallback--compact" title="Coming soon">${icon}</div>`;
  }
  return `<div class="topic-image-fallback topic-image-fallback--soon">${icon}<span>Coming soon</span></div>`;
}

function renderTopicImage(topicImage, alt, { loading = "lazy", isPlaceholder = false, compact = false } = {}) {
  if (isPlaceholder || TopicUtils.isPlaceholderImage(topicImage)) {
    return topicImageComingSoonHtml({ compact });
  }
  if (!topicImage) return topicImageFallbackHtml();
  return `<img src="${TopicUtils.encodeAssetPath(topicImage)}" alt="${TopicUtils.escapeAttr(alt)}" class="topic-card-img w-full h-full object-cover" loading="${loading}">`;
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

function renderTopicLeaf(sourceId, leaf, extraClass = '', staggerIndex = 0) {
  if (!shouldShowTopic(leaf, topicsPageState.filters.status)) return '';
  const leafPh = leaf.is_placeholder;
  const leafClasses = `topic-leaf-btn topic-leaf-enter ${extraClass}${leafPh ? ' topic-leaf-btn--soon opacity-50 grayscale-[0.5]' : ''}`.trim();
  const leafBadge = leafPh ? '<span class="topic-badge topic-badge--inline">Soon</span>' : '';
  const topicAttrs = `data-topic-id="${TopicUtils.escapeAttr(leaf.id)}" id="topic-${TopicUtils.escapeAttr(leaf.id)}" style="--leaf-i:${staggerIndex}"`;
  const label = `<span class="topic-leaf-btn__label">${TopicUtils.escapeHtml(leaf.title)}</span>${leafBadge}`;
  if (leafPh) {
    return `<span class="${leafClasses}" ${topicAttrs} aria-disabled="true" title="Coming soon">${label}</span>`;
  }
  return `
    <a href="${TopicUtils.escapeAttr(TopicUtils.topicHref(sourceId, leaf.id, leafPh))}" class="${leafClasses}" ${topicAttrs}>
      ${label}
    </a>
  `;
}

function renderSubtopic(sourceId, sub) {
  const hasChildren = sub.subtopics && sub.subtopics.length > 0;

  if (hasChildren) {
    const visibleLeaves = sub.subtopics.filter(leaf => shouldShowTopic(leaf, topicsPageState.filters.status));
    if (!shouldShowTopic(sub, topicsPageState.filters.status) && visibleLeaves.length === 0) return '';

    const subPh = sub.is_placeholder;
    const subBadge = subPh ? '<span class="topic-badge topic-badge--section">Soon</span>' : '';
    const sectionId = `section-${sub.id}`;
    const expanded = TopicUtils.isSectionExpanded(sourceId, sectionId, true);

    let leavesHTML = visibleLeaves.map((leaf, i) => renderTopicLeaf(sourceId, leaf, '', i)).join('');
    if (!leavesHTML) return '';

    const viewLink = subPh
      ? ''
      : `<a href="${TopicUtils.escapeAttr(TopicUtils.topicHref(sourceId, sub.id, false))}" class="topic-section-link" data-topic-id="${TopicUtils.escapeAttr(sub.id)}">View →</a>`;

    return `
      <div class="topic-section-group" data-expanded="${expanded ? 'true' : 'false'}" data-section-id="${TopicUtils.escapeAttr(sectionId)}">
        <div class="topic-section-header">
          <button type="button" class="category-toggle-btn" aria-expanded="${expanded ? 'true' : 'false'}" aria-controls="${TopicUtils.escapeAttr(sectionId)}-children" data-toggle-section>
            <span class="chevron" aria-hidden="true">${typeof renderSiteIcon === 'function' ? renderSiteIcon('chevron', 'card-icon-sm') : ''}</span>
            <span class="category-toggle-btn__label flex-1 min-w-0">${TopicUtils.escapeHtml(sub.title)}</span>${subBadge}
            <span class="topic-control-count flex-shrink-0">${visibleLeaves.length}</span>
          </button>
          ${viewLink}
        </div>
        <div id="${sectionId}-children" class="topic-section-children" data-section-children${expanded ? '' : ' style="max-height:0"'}>
          ${leavesHTML}
        </div>
      </div>
    `;
  }

  if (!shouldShowTopic(sub, topicsPageState.filters.status)) return '';
  const subPh = sub.is_placeholder;
  const leafClasses = `topic-leaf-btn mb-3 inline-flex max-w-md${subPh ? ' topic-leaf-btn--soon opacity-50 grayscale-[0.5]' : ''}`;
  const leafBadge = subPh ? '<span class="topic-badge topic-badge--inline">Soon</span>' : '';
  const topicAttrs = `data-topic-id="${TopicUtils.escapeAttr(sub.id)}" id="topic-${TopicUtils.escapeAttr(sub.id)}"`;
  const label = `<span class="topic-leaf-btn__label">${TopicUtils.escapeHtml(sub.title)}</span>${leafBadge}`;
  if (subPh) {
    return `<span class="${leafClasses}" ${topicAttrs} aria-disabled="true" title="Coming soon">${label}</span>`;
  }
  return `
    <a href="${TopicUtils.escapeAttr(TopicUtils.topicHref(sourceId, sub.id, false))}" class="${leafClasses}" ${topicAttrs}>
      ${label}
    </a>
  `;
}

function renderMainRootBlock(sourceId, root) {
  if (!root || !shouldShowTopic(root, topicsPageState.filters.status)) return '';
  const isPh = !!root.is_placeholder;
  const topicAttrs = `data-topic-id="${TopicUtils.escapeAttr(root.id)}" id="topic-${TopicUtils.escapeAttr(root.id)}"`;
  const cardInner = `
        <div class="topic-main-root-media">
          ${renderTopicImage(root.topic_image, `${root.title} visual`, { loading: 'eager', isPlaceholder: isPh })}
          <span class="topic-main-root-media-fade" aria-hidden="true"></span>
        </div>
        <div class="topic-main-root-content">
          <div class="topic-main-root-badges">
            <div class="topic-main-root-badge">${isPh ? 'Coming soon' : 'Essence · Start here'}</div>
            ${!isPh && root.video_language_count
              ? `<div class="topic-main-root-lang-chip" aria-label="Videos available in ${TopicUtils.escapeAttr(String(root.video_language_count))} languages">Videos in ${TopicUtils.escapeHtml(String(root.video_language_count))} languages</div>`
              : ''}
          </div>
          <h3 class="topic-main-root-title">${TopicUtils.escapeHtml(root.title)}</h3>
          <p class="topic-main-root-desc">${TopicUtils.escapeHtml(root.description || '')}</p>
          <div class="topic-main-root-footer">
            <span class="topic-main-root-explore">
              ${isPh ? 'Coming soon' : 'Begin the transmission <span aria-hidden="true">→</span>'}
            </span>
          </div>
        </div>`;

  const card = isPh
    ? `<div class="topic-main-root-card topic-main-root-card--soon" ${topicAttrs} aria-disabled="true">${cardInner}</div>`
    : `<a href="${TopicUtils.escapeAttr(TopicUtils.topicHref(sourceId, root.id, false))}"
         class="topic-main-root-card group" ${topicAttrs}>${cardInner}</a>`;

  return `
    <div class="topic-main-root-block" data-category-id="${root.id}">
      <p class="topic-main-root-eyebrow">Root transmission</p>
      ${card}
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
  const rootClasses = `topic-root-card group mb-6${isPh ? ' topic-root-card--soon' : ''}`;
  const placeholderBadge = isPh ? '<div class="topic-badge topic-badge--corner">Soon</div>' : '';
  const topicAttrs = `data-topic-id="${TopicUtils.escapeAttr(category.id)}" id="topic-${TopicUtils.escapeAttr(category.id)}"`;

  let subsHTML = '';
  if (category.subtopics?.length) {
    subsHTML = category.subtopics.map(sub => renderSubtopic(sourceId, sub)).join('');
    if (subsHTML) {
      subsHTML = `<div class="topic-section-subs">${subsHTML}</div>`;
    }
  }

  const showRoot = shouldShowTopic(category, topicsPageState.filters.status) || topicsPageState.filters.status === 'all';
  if (!showRoot && !subsHTML) return '';

  const rootInner = `
          <div class="topic-root-media">
            ${renderTopicImage(category.topic_image, `${category.title} visual`, { isPlaceholder: isPh, compact: true })}
            <span class="topic-root-media-fade" aria-hidden="true"></span>
          </div>
          <div class="topic-root-content">
            <h3 class="topic-category-title">${TopicUtils.escapeHtml(category.title)}</h3>
            <span class="topic-category-count">${subCount} ${subCount === 1 ? 'category' : 'categories'}</span>
            <p class="topic-category-desc">${TopicUtils.escapeHtml(category.description || '')}</p>
            <div class="topic-root-footer">
              <span class="explore-badge ${isPh ? 'explore-badge--soon' : ''}">
                ${isPh ? 'Coming soon' : 'Explore category <span aria-hidden="true">→</span>'}
              </span>
            </div>
          </div>
          ${placeholderBadge}`;

  const rootCard = isPh
    ? `<div class="${rootClasses}" ${topicAttrs} aria-disabled="true">${rootInner}</div>`
    : `<a href="${TopicUtils.escapeAttr(TopicUtils.topicHref(sourceId, category.id, false))}"
           class="${rootClasses}" ${topicAttrs}>${rootInner}</a>`;

  return `
    <div class="mb-12 relative topic-category-block" data-category-id="${category.id}">
      ${showRoot ? rootCard : ''}
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
    container.innerHTML = RenderUtils.renderDiscoveryEmpty({
      title: 'No topics found',
      message: 'Try another keyword, switch status to All, or clear search to browse categories.',
      icon: 'search',
      actions: [
        { label: 'Clear search & filters', primary: true, attrs: 'data-topics-clear-filters' },
        { label: 'Back to Codex', href: 'codex.html' }
      ]
    });
    container.querySelector('[data-topics-clear-filters]')?.addEventListener('click', () => {
      topicsPageState.filters.search = '';
      topicsPageState.filters.status = 'all';
      topicsPageState.filters.category = 'all';
      renderFilterControls();
      renderTopicsList();
      syncTopicsUrlFromState();
      document.getElementById('topics-search-input')?.focus();
    });
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
  const sourceId = topicsPageState.sourceId;

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
      const sectionId = group.dataset.sectionId;
      if (sectionId) {
        TopicUtils.setSectionExpanded(sourceId, sectionId, expanded);
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
    container.innerHTML = RenderUtils.renderDiscoveryEmpty({
      title: 'No topics in this view',
      message: 'This category or status filter has nothing to show. Reset filters to explore the full transmission.',
      icon: 'archive',
      actions: [
        { label: 'Show all topics', primary: true, attrs: 'data-topics-clear-filters' },
        { label: 'Back to Codex', href: 'codex.html' }
      ]
    });
    container.querySelector('[data-topics-clear-filters]')?.addEventListener('click', () => {
      topicsPageState.filters.search = '';
      topicsPageState.filters.status = 'all';
      topicsPageState.filters.category = 'all';
      renderFilterControls();
      renderTopicsList();
      syncTopicsUrlFromState();
    });
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

  const prevInput = controls.querySelector('#topics-search-input');
  const shouldRefocusSearch = document.activeElement === prevInput;
  const selectionStart = prevInput?.selectionStart ?? null;
  const selectionEnd = prevInput?.selectionEnd ?? null;

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
    <button type="button" data-filter-category="${TopicUtils.escapeAttr(tab.id)}" class="topic-control-btn topic-control-btn-sm ${filters.category === tab.id ? 'active' : ''}">
      ${TopicUtils.escapeHtml(tab.label)}
    </button>
  `).join('');

  controls.innerHTML = `
    <div class="topics-filter-sticky-wrap">
      <div class="topics-filter-panel">
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
              value="${TopicUtils.escapeAttr(filters.search)}"
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
      syncTopicsUrlFromState();
    });
  });

  controls.querySelectorAll('[data-filter-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      topicsPageState.filters.category = btn.dataset.filterCategory;
      renderFilterControls();
      renderTopicsList();
      syncTopicsUrlFromState();
    });
  });

  if (shouldRefocusSearch && searchInput) {
    searchInput.focus();
    if (selectionStart != null && selectionEnd != null) {
      searchInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

function renderSourceHeader(data, sourceId, stats) {
  const breadcrumbs = TopicUtils.renderSourceBreadcrumbs({ sourceTitle: data.title });
  const live = stats.live || 0;
  const total = stats.total || 0;
  const soon = Math.max(0, total - live);
  const readyPct = total ? Math.round((live / total) * 100) : 0;
  const statusMeta = typeof RenderUtils.sourceStatusMeta === 'function'
    ? RenderUtils.sourceStatusMeta(live, total, soon)
    : `${live} of ${total} ready`;
  const seriesLabel = typeof RenderUtils.sourcePlainLabel === 'function'
    ? RenderUtils.sourcePlainLabel(sourceId)
    : 'Transmission archive';
  // Text-free card art for the hero (same as Codex cards); keep data.image for other uses
  const heroImage = (typeof RenderUtils.sourceCardImage === 'function'
    ? RenderUtils.sourceCardImage({ id: sourceId, image: data.image })
    : data.image) || data.image || '';
  const descHtml = (data.description || '')
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p>${TopicUtils.escapeHtml(p)}</p>`)
    .join('');
  const pdfBtn = data.pdf_url
    ? `<a href="${TopicUtils.escapeAttr(data.pdf_url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary source-hero-pdf">
         ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''}
         View original PDF
       </a>`
    : '';

  document.getElementById('source-header').innerHTML = `
    ${breadcrumbs}
    <article class="source-hero static-card" aria-labelledby="source-hero-title">
      <div class="source-hero-grid">
        <div class="source-hero-copy">
          <p class="source-hero-eyebrow">${TopicUtils.escapeHtml(seriesLabel)}</p>
          <h1 id="source-hero-title" class="source-hero-title">${TopicUtils.escapeHtml(data.title)}</h1>
          ${data.subtitle ? `<p class="source-hero-deck">${TopicUtils.escapeHtml(data.subtitle)}</p>` : ''}
          <p class="source-hero-meta">${TopicUtils.escapeHtml(statusMeta)}</p>
          <div class="source-hero-progress" aria-hidden="true">
            <div class="source-hero-progress__fill" style="width:${readyPct}%"></div>
          </div>
          <div class="source-hero-desc">${descHtml}</div>
          <div class="source-hero-actions">
            <a href="#explore-topics" class="btn-primary">Explore topics ↓</a>
            <a href="codex.html" class="btn-secondary">← Back to Codex</a>
            ${pdfBtn}
          </div>
        </div>
        <div class="source-hero-media">
          ${heroImage
            ? `<img src="${TopicUtils.encodeAssetPath(heroImage)}"
                    alt="${TopicUtils.escapeAttr(data.title)}"
                    class="source-hero-img"
                    width="640" height="800" loading="eager" decoding="async" data-img-fallback>`
            : ''}
          <span class="source-hero-media-fade" aria-hidden="true"></span>
        </div>
      </div>
    </article>
  `;

  if (typeof RenderUtils.setupImageFallbacks === 'function') {
    RenderUtils.setupImageFallbacks(document.getElementById('source-header'), 'img[data-img-fallback]');
  }
}

function getTopicsNavExtraState() {
  return {
    page: 'topics',
    sourceId: topicsPageState.sourceId,
    filters: { ...topicsPageState.filters }
  };
}

function applyPendingTopicsFilters() {
  const pending = TopicUtils.peekNavReturnState();
  if (!pending || pending.page !== 'topics') return false;
  if (pending.sourceId && pending.sourceId !== topicsPageState.sourceId) return false;
  if (!pending.filters || typeof pending.filters !== 'object') return false;

  const next = { ...topicsPageState.filters };
  if (pending.filters.status) next.status = pending.filters.status;
  if (pending.filters.category) next.category = pending.filters.category;
  if (typeof pending.filters.search === 'string') next.search = pending.filters.search;
  topicsPageState.filters = next;
  return true;
}

function finishTopicsScrollRestore() {
  return TopicUtils.applyNavReturnAfterRender({
    page: 'topics',
    sourceId: topicsPageState.sourceId,
    delay: 60
  });
}

let topicsPendingHash = null;

async function loadSourceViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawSource = urlParams.get('source');
  const container = document.getElementById('topics-container');
  const headerEl = document.getElementById('source-header');

  if (headerEl) headerEl.innerHTML = TopicUtils.skeleton('topics-header');
  if (container) container.innerHTML = TopicUtils.skeleton('topics-list');

  try {
    const resolved = await TopicUtils.resolveSourceId(rawSource);
    if (!resolved.ok) {
      const errorHtml = TopicUtils.renderSourceError(resolved);
      if (headerEl) headerEl.innerHTML = errorHtml;
      if (container) container.innerHTML = '';
      document.title = 'Transmission not found | The 21st Memory';
      return;
    }

    const sourceId = resolved.sourceId;
    topicsPageState.sourceId = sourceId;

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
    RenderUtils.setupImageFallbacks(headerEl);

    container.innerHTML = `
      <div id="topics-controls"></div>
      <div id="topics-main-root-section" hidden></div>
      <div class="topics-categories-section">
        <div class="flex items-center justify-between gap-4 mb-10">
          <h2 class="text-4xl font-semibold tracking-tight">Topics by Category</h2>
          <p class="hidden md:block text-xs text-mem-dim tracking-wide m-0">Click any card to dive deep</p>
        </div>
        <div id="topics-list"></div>
      </div>
    `;

    // URL first (share/refresh), then nav-return overrides for Back fidelity
    applyTopicsFiltersFromUrl();
    const restoring = applyPendingTopicsFilters();
    // Drop invalid category ids from URL / restore
    if (
      topicsPageState.filters.category !== 'all' &&
      !data.topics.some((t) => t.id === topicsPageState.filters.category)
    ) {
      topicsPageState.filters.category = 'all';
    }
    renderFilterControls();
    renderTopicsList();
    syncTopicsUrlFromState();
    TopicUtils.animateProgressBars(headerEl);

    TopicUtils.attachTopicNavCapture(container, getTopicsNavExtraState);
    TopicUtils.attachTopicNavCapture(headerEl, getTopicsNavExtraState);

    const restored = (restoring || TopicUtils.peekNavReturnState()?.page === 'topics')
      ? finishTopicsScrollRestore()
      : null;
    if (!restored && topicsPendingHash) {
      TopicUtils.applyCapturedHash(topicsPendingHash, { delay: 80 });
      topicsPendingHash = null;
    }
  } catch (e) {
    console.error('Topics load error:', e);
    const sourceId = topicsPageState.sourceId || rawSource || 'unknown';
    const errorHtml = `
      <div class="text-center py-20">
        <div class="text-red-400 text-xl mb-4">Could not load topics data</div>
        <p class="text-mem-soft max-w-md mx-auto">${TopicUtils.escapeHtml(e.message)}</p>
        <p class="text-sm mt-8 text-mem-muted">Check the browser console (F12) for more details.<br>
        Make sure <strong>data/${TopicUtils.escapeHtml(sourceId)}-topics-index.json</strong> exists and is valid JSON.</p>
        <a href="codex.html" class="btn-primary">← Back to Codex</a>
      </div>`;
    if (headerEl) headerEl.innerHTML = errorHtml;
    if (container) container.innerHTML = errorHtml;
  }
}

function initTopicsPage() {
  TopicUtils.disableNativeScrollRestoration();
  topicsPendingHash = TopicUtils.captureAndClearHash();
  loadSourceViewer();

  // bfcache: page already has correct scroll/DOM — drop pending restore so it does not re-fire later
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    TopicUtils.consumeNavReturnState((data) =>
      data.page === 'topics' && (!data.sourceId || data.sourceId === topicsPageState.sourceId)
    );
  });
}

document.addEventListener('DOMContentLoaded', initTopicsPage);