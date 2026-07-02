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
    const safeSrc = TopicUtils.encodeAssetPath(imgSrc || '');
    const safeAlt = TopicUtils.escapeHtml(alt || '');

    return `
      <div class="media-frame surface-media ${className}">
        <img src="${safeSrc}" alt="${safeAlt}" width="${width}" height="${height}" loading="${loading}" data-img-fallback>
      </div>
    `;
  },

  renderLazyRumbleCard(video) {
    const embed = TopicUtils.escapeAttr(video.embed_url || '');
    const title = TopicUtils.escapeHtml(video.title || '21st Memory video');
    const poster = video.poster || video.thumbnail || '';
    const posterSrc = poster ? TopicUtils.encodeAssetPath(poster) : '';

    const playerHtml = posterSrc
      ? `<div class="video-poster-wrap absolute inset-0"
               data-rumble-embed="${embed}"
               data-video-title="${title}"
               role="button"
               tabindex="0"
               aria-label="Play video: ${title}">
            <img src="${posterSrc}" alt="" loading="lazy" data-img-fallback>
            <div class="video-play-btn" aria-hidden="true">
              <span class="video-play-icon">▶</span>
            </div>
          </div>`
      : `<iframe src="${embed}" width="100%" height="100%" allowfullscreen
                  class="w-full h-full border-0 absolute inset-0" title="${title}" loading="lazy"></iframe>`;

    return `
      <div class="channel-card video-card rounded-3xl overflow-hidden flex flex-col border border-mem-subtle">
        <div class="aspect-video bg-black relative overflow-hidden">
          ${playerHtml}
        </div>
        <div class="px-4 py-3 flex-shrink-0 border-t border-mem-subtle/50">
          <div class="font-semibold text-[15px] tracking-tight leading-tight text-mem-body line-clamp-2">${title}</div>
        </div>
      </div>
    `;
  },

  setupImageFallbacks(container, selector = 'img[data-img-fallback]') {
    TopicUtils.setupImageFallbacks(container, selector);
  },

  renderEmptyState(icon, message, options = {}) {
    const mutedClass = options.muted ? ' media-empty-state--muted' : '';
    const iconHtml = typeof renderSiteIcon === 'function' ? renderSiteIcon(icon, 'card-icon-lg') : '';
    const safeMessage = TopicUtils.escapeHtml(message || '');
    return `
      <div class="media-empty-state${mutedClass}">
        <div class="media-empty-state-icon" aria-hidden="true">${iconHtml}</div>
        <p class="media-empty-state-text">${safeMessage}</p>
      </div>
    `;
  },

  renderChannelCard({ href, label, title, description, action, icon, external = true, extraClass = '' }) {
    const rel = external ? ' rel="noopener noreferrer"' : '';
    const target = external ? ' target="_blank"' : '';
    const safeHref = TopicUtils.escapeAttr(href || '#');
    const safeLabel = label ? TopicUtils.escapeHtml(label) : '';
    const safeTitle = TopicUtils.escapeHtml(title || '');
    const safeDescription = TopicUtils.escapeHtml(description || '');
    const safeAction = TopicUtils.escapeHtml(action || '');
    return `
      <a href="${safeHref}"${target}${rel}
         class="memory-card content-card channel-card group flex flex-col h-full p-6 sm:p-8 no-underline ${extraClass}">
        <div class="flex items-start justify-between mb-4">
          <div>
            ${safeLabel ? `<span class="card-label">${safeLabel}</span>` : ''}
            <h3 class="text-2xl font-semibold mt-1 leading-none text-white">${safeTitle}</h3>
          </div>
          ${icon ? `<span data-icon="${icon}" data-icon-class="card-icon-lg"></span>` : ''}
        </div>
        <p class="flex-grow text-mem-prose leading-relaxed mb-6">${safeDescription}</p>
        <div class="inline-flex items-center gap-2 text-mem-soft group-hover:text-white font-medium card-action">
          ${safeAction}
          <span class="group-hover:translate-x-1 transition">→</span>
        </div>
      </a>
    `;
  },

  renderSourceCard(source, options = {}) {
    const soon = options.soonCount || 0;
    const showImage = options.showImage !== false;
    const imageHTML = showImage && source.image
      ? `<div class="mb-6"><img src="${TopicUtils.encodeAssetPath(source.image)}" alt="${TopicUtils.escapeHtml(source.title)}" class="w-full h-40 max-h-48 object-cover rounded-t-3xl source-card-img" width="400" height="160" loading="lazy" data-img-fallback></div>`
      : showImage
        ? `<div class="mb-6 h-40 bg-mem-inset rounded-t-3xl flex items-center justify-center">${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}</div>`
        : '';

    const soonPill = soon
      ? `<span class="codex-meta-pill codex-meta-pill--soon">${soon} soon</span>`
      : '';

    const safeId = TopicUtils.escapeAttr(source.id || 'source');
    const safeTitle = TopicUtils.escapeHtml(source.title || '');
    const safeBlurb = TopicUtils.escapeHtml(source.subtitle || source.description || '');

    return `
      <a href="topics.html?source=${safeId}"
         class="memory-card content-card channel-card group flex flex-col h-full source-card p-6 sm:p-8"
         data-source-id="${safeId}">
        ${imageHTML}
        <div class="flex items-start justify-between mb-4">
          <div>
            <span class="card-label">${TopicUtils.escapeHtml((source.id || 'source').toUpperCase())} TRANSMISSION</span>
            <h3 class="text-2xl font-semibold mt-1 leading-none text-white">${safeTitle}</h3>
          </div>
          ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
        </div>
        <p class="flex-grow text-mem-prose leading-relaxed mb-4 line-clamp-3">${safeBlurb}</p>
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