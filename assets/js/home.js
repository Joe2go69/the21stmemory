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

  nodes.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    if (!Number.isFinite(target)) return;
    el.textContent = String(target);
  });
}

function animateProgressBars(root) {
  const bars = root.querySelectorAll('.archive-progress-fill[data-progress]');
  if (!bars.length) return;
  bars.forEach((fill) => {
    const target = fill.dataset.progress || '0';
    fill.style.width = `${target}%`;
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
        <div class="codex-home-metric-label">Series</div>
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
        <div class="codex-home-metric-label">On the way</div>
      </div>
    </div>
    <div class="codex-home-progress">
      <div class="codex-home-progress-meta">
        <span>${live} of ${total} topics ready</span>
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

function seriesStatus(live, total) {
  const soon = Math.max(0, total - live);
  if (!total && !live) return { text: 'Topics on the way', tone: 'source-card--soon' };
  if (live === 0) return { text: `${total} topics · On the way`, tone: 'source-card--soon' };
  if (soon === 0) return { text: `${live} topics · Complete`, tone: 'source-card--ready' };
  return { text: `${live} of ${total} ready`, tone: 'source-card--mixed' };
}

function renderHomeSeriesCard(source, stats) {
  const id = String(source.id || '');
  const title = source.title || id;
  const live = Number(stats?.live) || 0;
  const total = Number(stats?.total) || 0;
  const status = seriesStatus(live, total);
  const safeId = escapeHtml(id);
  const stem = `images/${safeId}-codex-card`;
  return `
    <a href="topics.html?source=${safeId}" class="memory-card content-card source-card ${status.tone} home-series-card">
      <div class="source-card-media" style="background-color:#0F0A1F">
        <img src="${stem}-960.webp"
             srcset="${stem}-640.webp 640w, ${stem}-960.webp 960w"
             sizes="(max-width: 720px) 100vw, 320px"
             alt=""
             class="source-card-img"
             width="960" height="523" loading="lazy" decoding="async">
        <span class="source-card-media-fade" aria-hidden="true"></span>
      </div>
      <div class="source-card-body">
        <h3 class="source-card-title">${escapeHtml(title)}</h3>
        <p class="source-card-meta">${escapeHtml(status.text)}</p>
        <div class="source-card-action card-action">Open this series <span class="source-card-action-arrow" aria-hidden="true">→</span></div>
      </div>
    </a>`;
}

function bindHomeSeriesImages(root) {
  root.querySelectorAll('.source-card-img').forEach((img) => {
    const dropBroken = () => img.remove();
    img.addEventListener('error', dropBroken, { once: true });
    // Lazy images that have not been requested yet report complete + naturalWidth 0.
    // Only treat as broken when the browser actually selected a source.
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) dropBroken();
  });
}

async function loadHomeSeries() {
  const grid = document.getElementById('home-series-grid');
  if (!grid) return;

  try {
    const response = await fetch('data/sources.json', { credentials: 'same-origin', cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const sources = (Array.isArray(data.sources) ? data.sources : [])
      .filter((source) => source && /^[\w-]+$/.test(source.id))
      .sort((a, b) => (a.title || a.id).localeCompare(b.title || b.id));

    if (!sources.length) throw new Error('No series');

    const statsList = await Promise.all(sources.map(async (source) => {
      try {
        const statsResponse = await fetch(`data/${source.id}-stats.json`, { credentials: 'same-origin', cache: 'no-cache' });
        if (!statsResponse.ok) return null;
        return statsResponse.json();
      } catch (error) {
        console.warn(`Series stats unavailable for ${source.id}:`, error);
        return null;
      }
    }));

    grid.innerHTML = sources.map((source, index) => renderHomeSeriesCard(source, statsList[index])).join('');
    grid.setAttribute('aria-busy', 'false');
    if (typeof window.realignMeasuredHash === 'function') window.realignMeasuredHash();
    bindHomeSeriesImages(grid);
  } catch (error) {
    console.warn('Series list unavailable:', error);
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = '<p class="home-series-fallback">The series list is temporarily unavailable.</p>';
    if (typeof window.realignMeasuredHash === 'function') window.realignMeasuredHash();
  }
}

function readUnfinishedQuiz() {
  try {
    const map = JSON.parse(localStorage.getItem('21st-memory-quiz-resume-v1') || '{}');
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const entries = Object.entries(map).filter(([, blob]) => {
      if (!blob || blob.v !== 1 || !blob.savedAt) return false;
      return Date.now() - Number(blob.savedAt) <= maxAge;
    });
    entries.sort((a, b) => Number(b[1].savedAt) - Number(a[1].savedAt));
    if (!entries.length) return null;
    const [key, blob] = entries[0];
    if (!/^[\w-]+\/[\w-]+$/.test(key)) return null;
    const title = String(blob.title || '').trim();
    if (!title) return null;
    return { href: `quiz/${key}.html`, title, label: 'Continue' };
  } catch (_) {
    return null;
  }
}

function readLastDive() {
  try {
    const blob = JSON.parse(localStorage.getItem('21st-memory-last-dive-v1') || 'null');
    if (!blob || !blob.href || !blob.title) return null;
    if (!/^dive\/[\w-]+\/[\w-]+\.html$/.test(blob.href)) return null;
    return { href: blob.href, title: String(blob.title), label: 'Return to' };
  } catch (_) {
    return null;
  }
}

function paintHomeResume() {
  const el = document.getElementById('home-resume');
  if (!el) return;
  const item = readUnfinishedQuiz() || readLastDive();
  if (!item) {
    el.hidden = true;
    el.textContent = '';
    return;
  }
  el.hidden = false;
  el.innerHTML = `<a class="text-link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)} · ${escapeHtml(item.title)}</a>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  paintHomeResume();
  await Promise.all([loadHomeArchiveStats(), loadHomeSeries()]);

  const codexRoot = document.getElementById('codex');
  if (typeof hydrateSiteIcons === 'function' && codexRoot) {
    hydrateSiteIcons(codexRoot);
  }

  const rumbleGrid = document.getElementById('home-rumble-grid');
  setupHomeVideos(rumbleGrid);
  bindHomePosterFallback(rumbleGrid);
  initVideoPlayPulse(rumbleGrid);
});
