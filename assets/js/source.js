// Source listening room — click-to-play Rumble facades (one at a time)

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSourcePoster(title, wrap) {
  const poster = (wrap && wrap.dataset.posterUrl) || 'images/video-poster.webp';
  return `
    <img src="${escapeHtml(poster)}" alt="" class="source-poster-img video-poster-img absolute inset-0 w-full h-full object-cover" width="960" height="540" decoding="async" data-poster-fallback="brand" />
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

function bindSourcePosterFallback(root) {
  if (!root) return;
  root.querySelectorAll('.source-poster-img').forEach((img) => {
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

function setupSourceVideos(root) {
  if (!root) return;
  const wraps = Array.from(root.querySelectorAll('[data-rumble-embed]'));

  wraps.forEach((wrap) => {
    if (wrap.dataset.clickBound === 'true') return;
    wrap.dataset.clickBound = 'true';

    const loadEmbed = () => {
      if (wrap.dataset.loaded === 'true') return;
      const embedUrl = wrap.dataset.rumbleEmbed;
      const title = wrap.dataset.videoTitle || 'Source transmission';
      if (!embedUrl) return;

      wraps.forEach((other) => {
        if (other === wrap || other.dataset.loaded !== 'true') return;
        const otherTitle = other.dataset.videoTitle || 'Source transmission';
        other.innerHTML = renderSourcePoster(otherTitle, other);
        bindSourcePosterFallback(other);
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

function initSourcePlayPulse(root) {
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
          entry.target.querySelector('.video-poster-img');
        if (pulseTarget) pulseTarget.classList.add('is-pulse-once');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  wraps.forEach((wrap) => observer.observe(wrap));
}

function initSeriesJump(stack) {
  const nav = document.querySelector('.series-jump');
  if (!nav || !stack) return;

  const chips = Array.from(nav.querySelectorAll('a[href^="#part-"]'));
  const parts = Array.from(stack.querySelectorAll('.source-plate[id^="part-"]'));
  if (!chips.length || !parts.length) return;

  const setActive = (id) => {
    chips.forEach((chip) => {
      const on = chip.getAttribute('href') === `#${id}`;
      chip.classList.toggle('is-active', on);
      if (on) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      setActive(visible[0].target.id);
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] }
  );

  parts.forEach((part) => observer.observe(part));
  const initial = (window.location.hash || '').replace(/^#/, '');
  setActive(parts.some((part) => part.id === initial) ? initial : parts[0].id);
}

document.addEventListener('DOMContentLoaded', () => {
  const stack = document.getElementById('source-video-stack')
    || document.getElementById('series-video-stack');
  setupSourceVideos(stack);
  bindSourcePosterFallback(stack);
  initSourcePlayPulse(stack);
  initSeriesJump(stack);
});
