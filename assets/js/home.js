// Homepage — live archive stats + video facades

function renderArchiveBadgeSkeleton() {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  badge.setAttribute('aria-busy', 'true');
  badge.innerHTML = `
    <div class="codex-home-metrics-grid" aria-hidden="true">
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
      <div class="codex-home-metric"><span class="skeleton skeleton-bar" style="width:3rem;height:2rem"></span><span class="skeleton skeleton-bar" style="width:5rem;height:0.65rem;margin-top:0.5rem"></span></div>
    </div>
    <div class="codex-home-progress" aria-hidden="true">
      <span class="skeleton skeleton-bar" style="width:100%;height:0.35rem;border-radius:9999px"></span>
    </div>
  `;
}

/** Soft count-up for metric numbers (skipped when reduced-motion). */
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
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function renderLiveArchiveBadge(live, total) {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  const pct = total ? Math.round((live / total) * 100) : 0;
  const soon = Math.max(0, total - live);
  badge.setAttribute('aria-busy', 'false');

  badge.innerHTML = `
    <div class="codex-home-metrics-grid">
      <div class="codex-home-metric">
        <div class="codex-home-metric-value" data-count-to="${total}">${total}</div>
        <div class="codex-home-metric-label">Topics archived</div>
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
  TopicUtils.animateProgressBars(badge);
  animateMetricCounts(badge);
}

/** One soft play-button pulse when a facade first enters the viewport. */
function initVideoPlayPulse(root) {
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wraps = root.querySelectorAll('.video-poster-wrap');
  if (!wraps.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const pulseTarget = entry.target.querySelector('.play-button')
        || entry.target.querySelector('.video-poster-img')
        || entry.target.querySelector('.video-play-icon');
      if (pulseTarget) pulseTarget.classList.add('is-pulse-once');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  wraps.forEach((wrap) => observer.observe(wrap));
}

async function loadHomeArchiveStats() {
  renderArchiveBadgeSkeleton();

  try {
    const stats = await TopicUtils.fetchArchiveStats();
    renderLiveArchiveBadge(stats.live, stats.total);
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
  if (rumbleGrid && typeof TopicUtils !== 'undefined' && TopicUtils.setupClickToPlayVideos) {
    TopicUtils.setupClickToPlayVideos(rumbleGrid);
  }
  initVideoPlayPulse(rumbleGrid);
});
