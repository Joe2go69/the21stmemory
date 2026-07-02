// Homepage — live archive stats, journey strip, essence entry

const DEFAULT_SOURCE_ID = 'alice';
const ESSENCE_TOPIC_ID = 'essence-of-the-transmission';

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

function renderLiveArchiveBadge(live, total) {
  const badge = document.getElementById('live-archive-badge');
  if (!badge) return;

  const pct = total ? Math.round((live / total) * 100) : 0;
  const soon = Math.max(0, total - live);
  badge.setAttribute('aria-busy', 'false');

  badge.innerHTML = `
    <div class="codex-home-metrics-grid">
      <div class="codex-home-metric">
        <div class="codex-home-metric-value">${total}</div>
        <div class="codex-home-metric-label">Topics archived</div>
      </div>
      <div class="codex-home-metric">
        <div class="codex-home-metric-value">${live}</div>
        <div class="codex-home-metric-label">Ready now</div>
      </div>
      <div class="codex-home-metric">
        <div class="codex-home-metric-value">${soon}</div>
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
}

function renderJourneyCard(topic) {
  const essenceClass = topic.isEssence ? ' journey-card--essence' : '';
  const allClass = topic.isViewAll ? ' journey-card--all' : '';
  const stepLabel = topic.isViewAll ? 'Archive' : (topic.isEssence ? 'Start' : `${topic.step}`);

  if (topic.isViewAll) {
    return `
      <a href="${topic.href}" class="journey-card journey-card--all" role="listitem">
        <div class="journey-card-all-body">
          <div class="journey-card-all-count">${topic.countLabel}</div>
          <div class="journey-card-title">${topic.title}</div>
        </div>
      </a>
    `;
  }

  return `
    <a href="deep-dive.html?source=${DEFAULT_SOURCE_ID}&topic=${topic.id}" class="journey-card${essenceClass}${allClass}" role="listitem">
      <div class="journey-card-thumb">
        <img src="${TopicUtils.encodeAssetPath(topic.image)}" alt="" loading="lazy" width="184" height="138" data-img-fallback>
        <span class="journey-card-step">${stepLabel}</span>
      </div>
      <div class="journey-card-body">
        <div class="journey-card-title">${TopicUtils.escapeHtml(topic.title)}</div>
      </div>
    </a>
  `;
}

function renderJourneyStrip(topics, stats) {
  const strip = document.getElementById('journey-strip');
  if (!strip || !topics.length) return;

  const cards = [...topics];
  if (stats?.total) {
    cards.push({
      isViewAll: true,
      href: `topics.html?source=${DEFAULT_SOURCE_ID}#explore-topics`,
      countLabel: `${stats.total} topics`,
      title: 'View full archive'
    });
  }

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div>
        <h3 class="journey-strip-title">Recommended starting points</h3>
        <p class="journey-strip-sub">Begin with the Essence transmission, then explore foundational topics — or open any entry in the archive.</p>
      </div>
    </div>
    <div class="journey-scroll" role="list" aria-label="Recommended starting points">
      ${cards.map(topic => renderJourneyCard(topic)).join('')}
    </div>
  `;
  TopicUtils.setupImageFallbacks(strip);
}

function buildJourneyTopicsFromIndex(topicTree) {
  const topics = [];

  const essence = TopicUtils.findTopicById(topicTree, ESSENCE_TOPIC_ID);
  if (essence) {
    topics.push({
      step: 0,
      id: essence.id,
      title: essence.title,
      image: essence.topic_image || '',
      isEssence: true
    });
  }

  JOURNEY_TOPIC_IDS.forEach((id, index) => {
    const topic = TopicUtils.findTopicById(topicTree, id);
    if (!topic) return;
    topics.push({
      step: index + 1,
      id: topic.id,
      title: topic.title,
      image: topic.topic_image || ''
    });
  });

  return topics;
}

async function loadJourneyStrip() {
  const strip = document.getElementById('journey-strip');
  if (!strip) return;

  try {
    const topicData = await TopicUtils.fetchSourceIndex(DEFAULT_SOURCE_ID);
    const topics = buildJourneyTopicsFromIndex(topicData.topics || []);
    const stats = TopicUtils.countTopicStats(
      TopicUtils.normalizeTopicsFromIndex(topicData.topics || [])
    );

    if (topics.length) {
      renderJourneyStrip(topics, stats);
      return stats;
    }
  } catch (error) {
    console.warn('Journey strip unavailable:', error);
  }

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <h3 class="journey-strip-title">Recommended starting points</h3>
      <p class="journey-strip-sub text-mem-muted">Loading topics…</p>
    </div>
  `;
  return null;
}

async function fetchArchiveStatsFromIndex(sourceId = DEFAULT_SOURCE_ID) {
  const topicData = await TopicUtils.fetchSourceIndex(sourceId);
  const lightTopics = TopicUtils.normalizeTopicsFromIndex(topicData.topics || []);
  return TopicUtils.countTopicStats(lightTopics);
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
  await Promise.all([
    loadHomeArchiveStats(),
    loadJourneyStrip()
  ]);

  const codexRoot = document.getElementById('codex');
  if (typeof hydrateSiteIcons === 'function' && codexRoot) {
    hydrateSiteIcons(codexRoot);
  }
});