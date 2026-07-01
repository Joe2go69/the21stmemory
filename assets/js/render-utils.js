// Shared render helpers — enforces card/media class contracts across pages

const RenderUtils = {
  renderNetworkCard(channel) {
    return this.renderChannelCard({
      ...channel,
      external: true,
      extraClass: 'rounded-3xl'
    });
  },

  renderMediaFrame(imgSrc, alt, options = {}) {
    const {
      width = 600,
      height = 400,
      loading = 'lazy',
      className = 'w-full max-w-md'
    } = options;

    return `
      <div class="media-frame surface-media ${className}">
        <img src="${imgSrc}" alt="${alt}" width="${width}" height="${height}" loading="${loading}">
      </div>
    `;
  },

  renderEmptyState(icon, message, options = {}) {
    const mutedClass = options.muted ? ' media-empty-state--muted' : '';
    const iconHtml = typeof renderSiteIcon === 'function' ? renderSiteIcon(icon, 'card-icon-lg') : '';
    return `
      <div class="media-empty-state${mutedClass}">
        <div class="media-empty-state-icon" aria-hidden="true">${iconHtml}</div>
        <p class="media-empty-state-text">${message}</p>
      </div>
    `;
  },

  renderChannelCard({ href, label, title, description, action, icon, external = true, extraClass = '' }) {
    const rel = external ? ' rel="noopener noreferrer"' : '';
    const target = external ? ' target="_blank"' : '';
    return `
      <a href="${href}"${target}${rel}
         class="memory-card content-card channel-card group flex flex-col h-full p-6 sm:p-8 no-underline ${extraClass}">
        <div class="flex items-start justify-between mb-4">
          <div>
            ${label ? `<span class="card-label">${label}</span>` : ''}
            <h3 class="text-2xl font-semibold mt-1 leading-none text-white">${title}</h3>
          </div>
          ${icon ? `<span data-icon="${icon}" data-icon-class="card-icon-lg"></span>` : ''}
        </div>
        <p class="flex-grow text-mem-prose leading-relaxed mb-6">${description}</p>
        <div class="inline-flex items-center gap-2 text-mem-soft group-hover:text-white font-medium card-action">
          ${action}
          <span class="group-hover:translate-x-1 transition">→</span>
        </div>
      </a>
    `;
  },

  renderSourceCard(source, options = {}) {
    const soon = options.soonCount || 0;
    const showImage = options.showImage !== false;
    const imageHTML = showImage && source.image
      ? `<div class="mb-6"><img src="${source.image}" alt="${source.title}" class="w-full h-40 max-h-48 object-cover rounded-t-3xl" width="400" height="160" loading="lazy"></div>`
      : showImage
        ? `<div class="mb-6 h-40 bg-mem-inset rounded-t-3xl flex items-center justify-center">${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}</div>`
        : '';

    const soonPill = soon
      ? `<span class="codex-meta-pill codex-meta-pill--soon">${soon} soon</span>`
      : '';

    return `
      <a href="topics.html?source=${source.id}"
         class="memory-card content-card channel-card group flex flex-col h-full source-card p-6 sm:p-8"
         data-source-id="${source.id}">
        ${imageHTML}
        <div class="flex items-start justify-between mb-4">
          <div>
            <span class="card-label">${(source.id || 'source').toUpperCase()} TRANSMISSION</span>
            <h3 class="text-2xl font-semibold mt-1 leading-none text-white">${source.title}</h3>
          </div>
          ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
        </div>
        <p class="flex-grow text-mem-prose leading-relaxed mb-4 line-clamp-3">${source.subtitle || source.description || ''}</p>
        <div class="codex-source-meta">
          <span class="codex-meta-pill">${source.stats.live} ready</span>
          ${soonPill}
        </div>
        <div class="flex-grow"></div>
        <div class="inline-flex items-center gap-2 text-mem-soft group-hover:text-white font-medium card-action mt-4">
          Explore this source
          <span class="group-hover:translate-x-1 transition">→</span>
        </div>
      </a>
    `;
  }
};