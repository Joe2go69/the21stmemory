// Homepage — live archive stats, journey strip, click-to-play videos

const JOURNEY_TOPICS = [
  { step: 1, id: 'nature-of-reality', title: 'Nature of Reality', image: 'images/nat of real.webp' },
  { step: 2, id: 'parasitic-takeover', title: 'The Parasitic Takeover', image: 'images/alice/parasite.webp' },
  { step: 3, id: 'resets-hidden-history', title: 'Resets & Hidden History', image: 'images/alice/reset.webp' },
  { step: 4, id: 'ascension-event', title: 'Ascension Event', image: 'images/alice/Ascension Event.webp' },
  { step: 5, id: 'npc-population', title: 'NPC Population', image: 'images/alice/NPC Population.webp' }
];

const FALLBACK_STATS = { live: 56, total: 59 };

function renderLiveArchiveBadge(live, total) {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  const pct = total ? Math.round((live / total) * 100) : 0;
  badge.innerHTML = `
    <div class="codex-archive-status-label">Archive progress</div>
    <div class="live-archive-badge-text">
      <span class="live-archive-badge-dot" aria-hidden="true"></span>
      <span><strong>${live}</strong> of <strong>${total}</strong> revelations decoded · <strong>${pct}%</strong> complete</span>
    </div>
    <div class="live-archive-mini-bar" role="progressbar" aria-valuenow="${live}" aria-valuemin="0" aria-valuemax="${total}">
      <div class="live-archive-mini-fill" data-progress="${pct}" style="width: ${pct}%"></div>
    </div>
  `;
  TopicUtils.animateProgressBars(badge);
}

function renderJourneyStrip() {
  const strip = document.getElementById('journey-strip');
  if (!strip) return;

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div>
        <div class="journey-strip-title">Start your journey</div>
        <p class="journey-strip-sub">Five foundational revelations — follow the path from simulation to awakening.</p>
      </div>
      <span class="journey-strip-hint" aria-hidden="true">Swipe →</span>
    </div>
    <div class="journey-scroll" role="list" aria-label="Start your journey — five foundational topics">
      ${JOURNEY_TOPICS.map(topic => `
        <a href="deep-dive.html?source=alice&topic=${topic.id}" class="journey-card" role="listitem">
          <div class="journey-card-thumb">
            <img src="${TopicUtils.encodeAssetPath(topic.image)}" alt="${topic.title}" loading="lazy" width="184" height="138">
            <span class="journey-card-step">Step ${topic.step}</span>
          </div>
          <div class="journey-card-body">
            <div class="journey-card-title">${topic.title}</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

async function loadHomeArchiveStats() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch('data/alice-stats.json', { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const stats = await response.json();
    if (stats.live != null && stats.total != null) {
      renderLiveArchiveBadge(stats.live, stats.total);
    }
  } catch (error) {
    console.warn('Using fallback archive stats:', error);
    renderLiveArchiveBadge(FALLBACK_STATS.live, FALLBACK_STATS.total);
  } finally {
    clearTimeout(timeout);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderJourneyStrip();
  loadHomeArchiveStats();
});