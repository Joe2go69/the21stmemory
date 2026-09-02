// Homepage — self-contained (no topics-utils.js dependency)

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderArchiveBadgeSkeleton() {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  badge.setAttribute('aria-busy', 'true');
  badge.innerHTML = `
    <div class="codex-home-metrics-grid" aria-hidden="true">
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
    </div>
    <div class="codex-home-progress" aria-hidden="true">
      <span class="skeleton skeleton-bar" style="width:100%;height:0.35rem;border-radius:9999px"></span>
    </div>
  `;
}

function animateMetricCounts(root) {
  const nodes = root.querySelectorAll('[data-count-to]');
  if (!nodes.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  nodes.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    if (!Number.isFinite(target)) return;
    if (reduced) {
      el.textContent = String(target);
      return;
    }

    const duration = 900;
    const start = performance.now();
    el.textContent = '0';

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function animateProgressBars(root) {
  const bars = root.querySelectorAll('.archive-progress-fill[data-progress]');
  if (!bars.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  bars.forEach((fill) => {
    const target = fill.dataset.progress || '0';
    if (reduced) {
      fill.style.width = `${target}%`;
      return;
    }
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      fill.style.width = `${target}%`;
    });
  });
}

function renderLiveArchiveBadge(live, total, sources) {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  const pct = total ? Math.round((live / total) * 100) : 0;
  const soon = Math.max(0, total - live);
  const sourceCount = Number.isFinite(sources) ? sources : 0;
  badge.setAttribute('aria-busy', 'false');

  badge.innerHTML = `
    <div class="codex-home-metrics-grid">
      <div class="codex-home-metric">
        <div class="codex-home-metric-value" data-count-to="${sourceCount}">${sourceCount}</div>
        <div class="codex-home-metric-label">Transmissions</div>
      </div>
      <div class="codex-home-metric">
        <div class="codex-home-metric-value" data-count-to="${total}">${total}</div>
        <div class="codex-home-metric-label">Topics</div>
      </div>
      <div class="codex-home-metric">
        <div class="codex-home-metric-value" data-count-to="${live}">${live}</div>
        <div class="codex-home-metric-label">Ready now</div>
      </div>
      <div class="codex-home-metric">
        <div class="codex-home-metric-value" data-count-to="${soon}">${soon}</div>
        <div class="codex-home-metric-label">Coming soon</div>
      </div>
    </div>
    <div class="codex-home-progress">
      <div class="codex-home-progress-meta">
        <span>${live} of ${total} revelations decoded</span>
        <span>${pct}% complete</span>
      </div>
      <div class="archive-progress-bar" role="progressbar" aria-valuenow="${live}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Archive progress">
        <div class="archive-progress-fill" data-progress="${pct}" style="width: ${pct}%"></div>
      </div>
    </div>
  `;
  animateProgressBars(badge);
  animateMetricCounts(badge);
}

function renderVideoPoster(title, wrap) {
  const poster = (wrap && wrap.dataset.posterUrl) || 'images/video-poster.webp';
  return `
    <img src="${escapeHtml(poster)}" alt="" class="home-video-poster-img video-poster-img absolute inset-0 w-full h-full object-cover" width="960" height="540" decoding="async" data-poster-fallback="brand" />
    <div class="video-particle-vignette absolute inset-0 pointer-events-none" aria-hidden="true"></div>
    <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" aria-hidden="true">
      <div class="play-button">
        <svg viewBox="0 0 24 24" fill="currentColor" class="play-button__icon" aria-hidden="true">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
  `;
}

function bindHomePosterFallback(root) {
  if (!root) return;
  root.querySelectorAll('.home-video-poster-img').forEach((img) => {
    if (img.dataset.fallbackBound === 'true') return;
    img.dataset.fallbackBound = 'true';
    const useBrand = () => {
      if (img.dataset.usedBrand === 'true') return;
      img.dataset.usedBrand = 'true';
      img.src = 'images/video-poster.webp';
    };
    img.addEventListener('error', useBrand);
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) useBrand();
  });
}

/** Lightweight click-to-play for homepage featured video facade. */
function setupHomeVideos(root) {
  if (!root) return;
  const wraps = Array.from(root.querySelectorAll('[data-rumble-embed]'));

  wraps.forEach((wrap) => {
    if (wrap.dataset.clickBound === 'true') return;
    wrap.dataset.clickBound = 'true';

    const loadEmbed = () => {
      if (wrap.dataset.loaded === 'true') return;
      const embedUrl = wrap.dataset.rumbleEmbed;
      const title = wrap.dataset.videoTitle || '21st Memory video';
      if (!embedUrl) return;

      // Stop sibling embeds
      wraps.forEach((other) => {
        if (other === wrap || other.dataset.loaded !== 'true') return;
        const otherTitle = other.dataset.videoTitle || '21st Memory video';
        other.innerHTML = renderVideoPoster(otherTitle, other);
        bindHomePosterFallback(other);
        other.dataset.loaded = 'false';
        other.classList.add('cursor-pointer');
        other.setAttribute('role', 'button');
        other.setAttribute('tabindex', '0');
        other.setAttribute('aria-label', `Play video: ${otherTitle}`);
      });

      wrap.innerHTML = (typeof window.renderRumbleEmbedHtml === 'function')
        ? window.renderRumbleEmbedHtml(embedUrl, title)
        : `<iframe src="${escapeHtml(embedUrl)}" width="100%" height="100%" allowfullscreen
                class="w-full h-full absolute inset-0 border-0 video-embed-frame" title="${escapeHtml(title)}"
                style="color-scheme:dark;background-color:#0F0A1F"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>
           <div class="video-embed-cover" aria-hidden="true"></div>`;
      wrap.dataset.loaded = 'true';
      wrap.classList.remove('cursor-pointer');
      wrap.removeAttribute('role');
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('aria-label');
      if (typeof window.revealRumbleEmbed === 'function') window.revealRumbleEmbed(wrap);
    };

    wrap.addEventListener('click', loadEmbed);
    wrap.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        loadEmbed();
      }
    });
  });
}

function initVideoPlayPulse(root) {
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wraps = root.querySelectorAll('.video-poster-wrap');
  if (!wraps.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const pulseTarget =
          entry.target.querySelector('.play-button') ||
          entry.target.querySelector('.video-poster-img') ||
          entry.target.querySelector('.video-play-icon');
        if (pulseTarget) pulseTarget.classList.add('is-pulse-once');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  wraps.forEach((wrap) => observer.observe(wrap));
}

async function loadHomeArchiveStats() {
  renderArchiveBadgeSkeleton();

  try {
    const response = await fetch('data/archive-stats.json', { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const stats = await response.json();
    renderLiveArchiveBadge(stats.live, stats.total, stats.sources);
    return stats;
  } catch (error) {
    console.warn('Archive stats unavailable:', error);
    const badge = document.getElementById('live-archive-badge');
    if (badge) {
      badge.setAttribute('aria-busy', 'false');
      badge.innerHTML = `
        <p class="codex-home-metrics-fallback">Archive stats temporarily unavailable</p>
      `;
    }
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadHomeArchiveStats();

  const codexRoot = document.getElementById('codex');
  if (typeof hydrateSiteIcons === 'function' && codexRoot) {
    hydrateSiteIcons(codexRoot);
  }

  const rumbleGrid = document.getElementById('home-rumble-grid');
  setupHomeVideos(rumbleGrid);
  bindHomePosterFallback(rumbleGrid);
  initVideoPlayPulse(rumbleGrid);
});
