// Homepage — live archive stats, dual journey strips, video facades

const ARCHIVE_VIEW_ALL_HREF = 'codex.html';

/** Per-transmission starting paths — add a new entry when a transmission ships. */
const JOURNEY_PATHS = [
  {
    sourceId: 'alice',
    label: 'Following Alice',
    short: 'Foundational rabbit-hole series',
    essenceId: 'essence-of-the-transmission',
    topicIds: [
      'nature-of-reality',
      'parasitic-takeover',
      'resets-hidden-history',
      'ascension-event',
      'npc-population'
    ]
  },
  {
    sourceId: 'breakdown',
    label: 'Mega Breakdown',
    short: 'Final-stage Great Awakening notes',
    essenceId: 'essence-of-the-transmission',
    topicIds: [
      'the-purge-phases',
      'mass-reveal',
      '3d-overlay',
      'matrix-scaffolding',
      'ebs-operation'
    ]
  }
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
          <div class="journey-card-title">${TopicUtils.escapeHtml(topic.title)}</div>
        </div>
      </a>
    `;
  }

  return `
    <a href="${TopicUtils.diveUrl(topic.sourceId, topic.id)}" class="journey-card${essenceClass}${allClass}" role="listitem">
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

function buildJourneyTopicsFromIndex(sourceId, topicTree, pathConfig) {
  const topics = [];
  const essence = TopicUtils.findTopicById(topicTree, pathConfig.essenceId);
  if (essence && !essence.is_placeholder) {
    topics.push({
      step: 0,
      id: essence.id,
      sourceId,
      title: essence.title,
      image: essence.topic_image || '',
      isEssence: true
    });
  }

  (pathConfig.topicIds || []).forEach((id, index) => {
    const topic = TopicUtils.findTopicById(topicTree, id);
    if (!topic || topic.is_placeholder) return;
    topics.push({
      step: index + 1,
      id: topic.id,
      sourceId,
      title: topic.title,
      image: topic.topic_image || ''
    });
  });

  return topics;
}

function renderJourneyPathRow(pathConfig, topics, stats) {
  const cards = [...topics];
  if (stats) {
    cards.push({
      isViewAll: true,
      href: `topics.html?source=${pathConfig.sourceId}#explore-topics`,
      countLabel: `${stats.live || 0} ready`,
      title: `All ${pathConfig.label} topics`
    });
  }

  return `
    <section class="journey-path-row" data-source="${TopicUtils.escapeAttr(pathConfig.sourceId)}" aria-labelledby="journey-${pathConfig.sourceId}-title">
      <header class="journey-path-row__head">
        <div>
          <p class="journey-path-row__eyebrow">${TopicUtils.escapeHtml(pathConfig.short)}</p>
          <h3 id="journey-${pathConfig.sourceId}-title" class="journey-path-row__title">${TopicUtils.escapeHtml(pathConfig.label)}</h3>
        </div>
        <a href="topics.html?source=${pathConfig.sourceId}#explore-topics" class="journey-path-row__link">Open transmission →</a>
      </header>
      <div class="journey-scroll" role="list" aria-label="${TopicUtils.escapeAttr(pathConfig.label)} starting points">
        ${cards.map((topic) => renderJourneyCard(topic)).join('')}
      </div>
    </section>
  `;
}

function renderJourneyStrip(pathBlocks, archiveStats) {
  const strip = document.getElementById('journey-strip');
  if (!strip || !pathBlocks.length) return;

  const totalReady = archiveStats?.live || pathBlocks.reduce((n, b) => n + (b.stats?.live || 0), 0);

  strip.innerHTML = `
    <div class="codex-home-journey-head">
      <div>
        <h3 class="journey-strip-title">Recommended starting points</h3>
        <p class="journey-strip-sub">Begin with each transmission’s Essence, then walk a short path of core topics. The full Codex keeps growing as new transmissions land.</p>
      </div>
      <a href="${ARCHIVE_VIEW_ALL_HREF}" class="journey-strip-codex-link">
        Explore full Codex
        <span class="journey-strip-codex-meta">${totalReady ? `${totalReady} ready` : ''}</span>
      </a>
    </div>
    <div class="journey-path-stack">
      ${pathBlocks.map((block) => renderJourneyPathRow(block.config, block.topics, block.stats)).join('')}
    </div>
  `;
  TopicUtils.setupImageFallbacks(strip);
}

async function loadJourneyStrip() {
  const strip = document.getElementById('journey-strip');
  if (!strip) return;

  try {
    const pathBlocks = [];
    for (const config of JOURNEY_PATHS) {
      try {
        const topicData = await TopicUtils.fetchSourceIndex(config.sourceId);
        const tree = TopicUtils.normalizeTopicsFromIndex(topicData.topics || []);
        const topics = buildJourneyTopicsFromIndex(config.sourceId, tree, config);
        const stats = TopicUtils.countTopicStats(tree);
        if (topics.length) {
          pathBlocks.push({ config, topics, stats });
        }
      } catch (err) {
        console.warn(`Journey path unavailable for ${config.sourceId}:`, err);
      }
    }

    let archiveStats = null;
    try {
      archiveStats = await TopicUtils.fetchArchiveStats();
    } catch (_) {
      /* optional */
    }

    if (pathBlocks.length) {
      renderJourneyStrip(pathBlocks, archiveStats);
      return archiveStats;
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

async function fetchArchiveStatsFromIndex(sourceId = 'alice') {
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

  const rumbleGrid = document.getElementById('home-rumble-grid');
  if (rumbleGrid && typeof TopicUtils !== 'undefined' && TopicUtils.setupClickToPlayVideos) {
    TopicUtils.setupClickToPlayVideos(rumbleGrid);
  }
});
