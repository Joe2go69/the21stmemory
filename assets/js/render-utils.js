// Shared render helpers — enforces card/media class contracts across pages

const RenderUtils = {
  renderNetworkCard(channel, options = {}) {
    if (options.featured) {
      return this.renderFeaturedNetworkCard(channel);
    }
    const extra = ['rounded-3xl'];
    if (options.extraClass) extra.push(options.extraClass);
    return this.renderChannelCard({
      ...channel,
      external: true,
      featured: false,
      extraClass: extra.join(' ')
    });
  },

  renderFeaturedNetworkCard(channel = {}) {
    const safeHref = TopicUtils.escapeAttr(channel.href || '#');
    const safeLabel = channel.label ? TopicUtils.escapeHtml(channel.label) : '';
    const safeTitle = TopicUtils.escapeHtml(channel.title || '');
    const safeDescription = TopicUtils.escapeHtml(channel.description || '');
    const safeAction = TopicUtils.escapeHtml(channel.action || 'Open');
    const safeSection = TopicUtils.escapeAttr(channel.section || '');
    const safeBadge = channel.badge ? TopicUtils.escapeHtml(channel.badge) : '';
    const iconName = TopicUtils.escapeAttr(channel.icon || 'network');
    const chip = safeBadge
      ? `<span class="network-start-card__chip network-start-card__chip--archive">${safeBadge}</span>`
      : `<span class="network-start-card__chip">Recommended</span>`;

    return `
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
         class="network-start-card"
         data-section="${safeSection}">
        <div class="network-start-card__top">
          <div class="network-start-card__meta">
            ${chip}
            ${safeLabel ? `<span class="network-start-card__label">${safeLabel}</span>` : ''}
          </div>
          <span class="network-start-card__icon" aria-hidden="true">
            <span data-icon="${iconName}" data-icon-class="card-icon-lg"></span>
          </span>
        </div>
        <h3 class="network-start-card__title">${safeTitle}</h3>
        <p class="network-start-card__desc">${safeDescription}</p>
        <span class="network-start-card__action">
          ${safeAction}
          <span class="sr-only"> (opens in a new tab)</span>
          <span aria-hidden="true">→</span>
        </span>
      </a>
    `;
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
    const customPoster = video.poster || video.thumbnail || '';
    const posterSrc = TopicUtils.encodeAssetPath(
      customPoster || (typeof TopicUtils.defaultVideoPosterPath === 'function'
        ? TopicUtils.defaultVideoPosterPath()
        : 'images/video-poster.webp')
    );
    const posterAttr = TopicUtils.escapeAttr(posterSrc);

    const playerHtml = `<div class="video-poster-wrap absolute inset-0 cursor-pointer"
               data-rumble-embed="${embed}"
               data-video-title="${title}"
               data-poster-src="${posterAttr}"
               role="button"
               tabindex="0"
               aria-label="Play video: ${title}">
            <img src="${posterAttr}" alt="" class="video-poster-img" width="640" height="400" loading="lazy" decoding="async" data-img-fallback>
          </div>`;

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

  /**
   * Discovery empty state for Codex / Topics / Network hubs.
   * actions: [{ label, href?, primary?, attrs? }]
   * attrs e.g. 'data-empty-action="clear-search"'
   */
  renderDiscoveryEmpty({
    title = 'Nothing found',
    message = 'Try adjusting your search or filters.',
    icon = 'search',
    actions = [],
    extraClass = ''
  } = {}) {
    const iconHtml = typeof renderSiteIcon === 'function'
      ? renderSiteIcon(icon, 'card-icon-lg')
      : '◎';
    const actionsHtml = (actions || []).map((a) => {
      const cls = a.primary ? 'btn-primary' : 'btn-secondary';
      const extra = a.attrs ? ` ${a.attrs}` : '';
      if (a.href) {
        return `<a href="${TopicUtils.escapeAttr(a.href)}" class="${cls} discovery-empty__btn"${extra}>${TopicUtils.escapeHtml(a.label)}</a>`;
      }
      return `<button type="button" class="${cls} discovery-empty__btn"${extra}>${TopicUtils.escapeHtml(a.label)}</button>`;
    }).join('');

    return `
      <div class="discovery-empty ${extraClass}" role="status">
        <div class="discovery-empty__icon" aria-hidden="true">${iconHtml}</div>
        <h3 class="discovery-empty__title">${TopicUtils.escapeHtml(title)}</h3>
        <p class="discovery-empty__message">${TopicUtils.escapeHtml(message)}</p>
        ${actionsHtml ? `<div class="discovery-empty__actions">${actionsHtml}</div>` : ''}
      </div>
    `;
  },

  renderChannelCard({
    href,
    label,
    title,
    description,
    action,
    icon,
    section = '',
    badge = '',
    external = true,
    featured = false,
    extraClass = ''
  }) {
    const rel = external ? ' rel="noopener noreferrer"' : '';
    const target = external ? ' target="_blank"' : '';
    const safeHref = TopicUtils.escapeAttr(href || '#');
    const safeLabel = label ? TopicUtils.escapeHtml(label) : '';
    const safeTitle = TopicUtils.escapeHtml(title || '');
    const safeDescription = TopicUtils.escapeHtml(description || '');
    const safeAction = TopicUtils.escapeHtml(action || '');
    const safeSection = TopicUtils.escapeAttr(section || '');
    const safeBadge = badge ? TopicUtils.escapeHtml(badge) : '';
    const sectionAttr = safeSection ? ` data-section="${safeSection}"` : '';
    const newTabHint = external
      ? '<span class="sr-only"> (opens in a new tab)</span>'
      : '';
    const badgeHtml = safeBadge
      ? `<span class="channel-card-badge">${safeBadge}</span>`
      : '';

    return `
      <a href="${safeHref}"${target}${rel}${sectionAttr}
         class="memory-card content-card channel-card group flex flex-col h-full no-underline ${extraClass}">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="min-w-0">
            ${badgeHtml}
            ${safeLabel ? `<span class="card-label">${safeLabel}</span>` : ''}
            <h3 class="text-xl font-semibold mt-1 leading-snug text-white">${safeTitle}</h3>
          </div>
          ${icon ? `<span data-icon="${TopicUtils.escapeAttr(icon)}" data-icon-class="card-icon-lg"></span>` : ''}
        </div>
        <p class="flex-grow text-mem-prose leading-relaxed mb-4 text-sm line-clamp-3">${safeDescription}</p>
        <div class="inline-flex items-center gap-2 text-mem-soft group-hover:text-white font-medium card-action mt-auto">
          ${safeAction}${newTabHint}
          <span class="group-hover:translate-x-1 transition" aria-hidden="true">→</span>
        </div>
      </a>
    `;
  },

  sourcePlainLabel(sourceId) {
    const map = {
      alice: 'Foundational rabbit-hole series',
      breakdown: 'Final-stage Great Awakening notes'
    };
    return map[sourceId] || 'Transmission archive';
  },

  /** Text-free card art for Codex grid + source hero. Topic images keep source.image. */
  sourceCardImage(source) {
    const map = {
      alice: 'images/alice-codex-card.webp',
      breakdown: 'images/breakdown-codex-card.webp'
    };
    return map[source?.id] || source?.image || '';
  },

  sourceStatusMeta(live, total, soon) {
    if (!total && !live) return 'Topics coming soon';
    if (live === 0) return `${total} topics · Coming soon`;
    if (soon === 0) return `${live} topics · Complete`;
    return `${live} of ${total} ready`;
  },

  renderSourceCard(source, options = {}) {
    const soon = options.soonCount || 0;
    const showImage = options.showImage !== false;
    const cardImage = this.sourceCardImage(source);
    const imageHTML = showImage && cardImage
      ? `<div class="source-card-media">
           <img src="${TopicUtils.encodeAssetPath(cardImage)}" alt="${TopicUtils.escapeHtml(source.title)}" class="source-card-img" width="400" height="180" loading="lazy" data-img-fallback>
           <span class="source-card-media-fade" aria-hidden="true"></span>
         </div>`
      : showImage
        ? `<div class="source-card-media source-card-media--placeholder" aria-hidden="true"></div>`
        : '';

    const live = source.stats?.live || 0;
    const total = source.stats?.total || (live + soon);
    const readyPct = total ? Math.round((live / total) * 100) : 0;
    const statusTone = live === 0
      ? 'source-card--soon'
      : soon === 0
        ? 'source-card--ready'
        : 'source-card--mixed';

    const safeId = TopicUtils.escapeAttr(source.id || 'source');
    const safeTitle = TopicUtils.escapeHtml(source.title || '');
    const plain = this.sourcePlainLabel(source.id);
    const safeDeck = TopicUtils.escapeHtml(source.subtitle || '');
    const statusMeta = this.sourceStatusMeta(live, total, soon);

    return `
      <a href="topics.html?source=${safeId}"
         class="memory-card content-card channel-card group source-card ${statusTone}"
         data-source-id="${safeId}">
        ${imageHTML}
        <div class="source-card-body">
          <span class="card-label">${TopicUtils.escapeHtml(plain)}</span>
          <h3 class="source-card-title">${safeTitle}</h3>
          ${safeDeck ? `<p class="source-card-deck">${safeDeck}</p>` : ''}
          <p class="source-card-meta">${TopicUtils.escapeHtml(statusMeta)}</p>
          <div class="source-card-progress" aria-hidden="true">
            <div class="source-card-progress__fill" style="width:${readyPct}%"></div>
          </div>
          <div class="source-card-action card-action">
            Explore this transmission
            <span class="source-card-action-arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </a>
    `;
  }
};