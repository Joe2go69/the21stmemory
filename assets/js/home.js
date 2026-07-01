// Homepage — live archive stats, journey strip, click-to-play videos

const DEFAULT_SOURCE_ID = 'alice';

const JOURNEY_TOPIC_IDS = [
  'nature-of-reality',
  'parasitic-takeover',
  'resets-hidden-history',
  'ascension-event',
  'npc-population'
];

function renderArchiveBadgeSkeleton() {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  badge.innerHTML = `
    <div class="codex-archive-status-label">Archive progress</div>
    <div class="live-archive-badge-text" aria-hidden="true">
      <span class="skeleton skeleton-bar" style="width: 12rem; height: 0.85rem"></span>
    </div>
    <div class="live-archive-mini-bar" aria-hidden="true">
      <span class="skeleton skeleton-bar" style="width: 100%; height: 100%; border-radius: 9999px"></span>
    </div>
  `;
}

function renderLiveArchiveBadge(live, total) {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  const pct = total ? Math.round((live / total) * 100) : 0;
  badge.setAttribute('aria-busy', 'false');
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

function renderJourneyStrip(topics) {
  const strip = document.getElementById('journey-strip');
  if (!strip || !topics.length) return;

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div>
        <div class="journey-strip-title">Start your journey</div>
        <p class="journey-strip-sub">Five foundational revelations — follow the path from simulation to awakening.</p>
      </div>
      <span class="journey-strip-hint" aria-hidden="true">Swipe →</span>
    </div>
    <div class="journey-scroll" role="list" aria-label="Start your journey — five foundational topics">
      ${topics.map(topic => `
        <a href="deep-dive.html?source=${DEFAULT_SOURCE_ID}&topic=${topic.id}" class="journey-card" role="listitem">
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

function buildJourneyTopicsFromIndex(topicTree) {
  return JOURNEY_TOPIC_IDS.map((id, index) => {
    const topic = TopicUtils.findTopicById(topicTree, id);
    if (!topic) return null;
    return {
      step: index + 1,
      id: topic.id,
      title: topic.title,
      image: topic.topic_image || ''
    };
  }).filter(Boolean);
}

async function loadJourneyStrip() {
  const strip = document.getElementById('journey-strip');
  if (!strip) return;

  try {
    const topicData = await TopicUtils.fetchSourceIndex(DEFAULT_SOURCE_ID);
    const topics = buildJourneyTopicsFromIndex(topicData.topics || []);
    if (topics.length) {
      renderJourneyStrip(topics);
      return;
    }
  } catch (error) {
    console.warn('Journey strip unavailable:', error);
  }

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div class="journey-strip-title">Start your journey</div>
      <p class="journey-strip-sub text-mem-muted">Journey topics loading…</p>
    </div>
  `;
}

async function fetchArchiveStatsFromIndex(sourceId = DEFAULT_SOURCE_ID) {
  const topicData = await TopicUtils.fetchSourceIndex(sourceId);
  const lightTopics = TopicUtils.normalizeTopicsFromIndex(topicData.topics || []);
  return TopicUtils.countTopicStats(lightTopics);
}

async function fetchArchiveStatsFromFile(sourceId = DEFAULT_SOURCE_ID) {
  const response = await fetch(`data/${sourceId}-stats.json`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const stats = await response.json();
  if (stats.live == null || stats.total == null) {
    throw new Error('Invalid stats payload');
  }
  return stats;
}

async function loadHomeArchiveStats() {
  renderArchiveBadgeSkeleton();

  try {
    const stats = await fetchArchiveStatsFromIndex();
    renderLiveArchiveBadge(stats.live, stats.total);
    return;
  } catch (error) {
    console.warn('Topic index stats unavailable, trying stats file:', error);
  }

  try {
    const stats = await fetchArchiveStatsFromFile();
    renderLiveArchiveBadge(stats.live, stats.total);
  } catch (error) {
    console.warn('Archive stats unavailable:', error);
    const badge = document.getElementById('live-archive-badge');
    if (badge) {
      badge.innerHTML = `
        <div class="codex-archive-status-label">Archive progress</div>
        <div class="live-archive-badge-text">Archive stats temporarily unavailable</div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadJourneyStrip();
  loadHomeArchiveStats();
});