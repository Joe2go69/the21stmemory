// Homepage — live archive stats, journey strip, essence entry, sticky CTA

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

function renderJourneyCard(topic) {
  const essenceClass = topic.isEssence ? ' journey-card--essence' : '';
  const allClass = topic.isViewAll ? ' journey-card--all' : '';
  const stepLabel = topic.isViewAll ? 'Archive' : (topic.isEssence ? 'Start' : `Step ${topic.step}`);

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
        <img src="${TopicUtils.encodeAssetPath(topic.image)}" alt="${topic.title}" loading="lazy" width="184" height="138">
        <span class="journey-card-step">${stepLabel}</span>
      </div>
      <div class="journey-card-body">
        <div class="journey-card-title">${topic.title}</div>
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
      title: 'View full archive →'
    });
  }

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div>
        <div class="journey-strip-title">Start your journey</div>
        <p class="journey-strip-sub">Begin with the Essence, then follow five foundational revelations — or jump to any topic in the archive.</p>
      </div>
      <span class="journey-strip-hint" aria-hidden="true">Swipe →</span>
    </div>
    <div class="journey-scroll" role="list" aria-label="Start your journey — essence and foundational topics">
      ${cards.map(topic => renderJourneyCard(topic)).join('')}
    </div>
  `;
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
      <div class="journey-strip-title">Start your journey</div>
      <p class="journey-strip-sub text-mem-muted">Journey topics loading…</p>
    </div>
  `;
  return null;
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
    return stats;
  } catch (error) {
    console.warn('Topic index stats unavailable, trying stats file:', error);
  }

  try {
    const stats = await fetchArchiveStatsFromFile();
    renderLiveArchiveBadge(stats.live, stats.total);
    return stats;
  } catch (error) {
    console.warn('Archive stats unavailable:', error);
    const badge = document.getElementById('live-archive-badge');
    if (badge) {
      badge.innerHTML = `
        <div class="codex-archive-status-label">Archive progress</div>
        <div class="live-archive-badge-text">Archive stats temporarily unavailable</div>
      `;
    }
    return null;
  }
}

function initStickyCodexBar() {
  const bar = document.getElementById('sticky-codex-bar');
  const hero = document.querySelector('header.hero-spotlight');
  const codexSection = document.getElementById('codex');
  if (!bar || !hero) return;

  const showAfter = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const codexVisible = codexSection
      ? codexSection.getBoundingClientRect().top < window.innerHeight * 0.65
      : false;
    const shouldShow = heroBottom < 0 && !codexVisible;
    bar.hidden = !shouldShow;
    bar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      showAfter();
      ticking = false;
    });
  }, { passive: true });

  showAfter();
}

document.addEventListener('DOMContentLoaded', async () => {
  const [stats] = await Promise.all([
    loadHomeArchiveStats(),
    loadJourneyStrip()
  ]);

  initStickyCodexBar();

  if (typeof hydrateSiteIcons === 'function') {
    hydrateSiteIcons(document.getElementById('codex'));
  }
});