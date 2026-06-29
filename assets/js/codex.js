// Codex page — load source cards from JSON

async function loadSources() {
  try {
    const sourcesResponse = await fetch('data/sources.json');
    const sourcesData = await sourcesResponse.json();

    const container = document.getElementById('sources-grid');
    container.innerHTML = '';

    for (const source of sourcesData.sources) {
      try {
        const topicResponse = await fetch(`data/${source.id}-topics.json`);
        if (!topicResponse.ok) throw new Error(`HTTP ${topicResponse.status}`);
        const topicData = await topicResponse.json();

        const lightTopics = TopicUtils.createLightweightTopics(topicData.topics || []);
        const stats = TopicUtils.countTopicStats(lightTopics);

        const card = document.createElement('a');
        card.href = `topics.html?source=${source.id}`;
        card.className = 'memory-card content-card channel-card group flex flex-col h-full source-card';

        let imageHTML = '';
        if (topicData.image) {
          imageHTML = `
            <div class="mb-6">
              <img src="${topicData.image}" alt="${topicData.title}" class="w-full h-40 max-h-48 object-cover rounded-t-3xl" width="400" height="160" loading="lazy">
            </div>
          `;
        }

        card.innerHTML = `
          ${imageHTML}
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-[#6366F1] text-xs font-semibold tracking-[1.5px] uppercase">${source.id.toUpperCase()}</div>
              <h3 class="text-2xl font-semibold mt-1 text-white">${topicData.title}</h3>
            </div>
            ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
          </div>
          <div class="text-xs text-[#A78BFA] mb-4 font-medium tracking-wide">${stats.live} of ${stats.total} topics live</div>
          <div class="flex-grow"></div>
          <div class="inline-flex items-center text-sm font-semibold text-[#6366F1] group-hover:text-white">
            Explore this source
            <span class="group-hover:translate-x-1 transition ml-2">→</span>
          </div>
        `;

        container.appendChild(card);
      } catch (topicError) {
        console.error(`Failed to load topics for ${source.id}:`, topicError);
        const card = document.createElement('a');
        card.href = `topics.html?source=${source.id}`;
        card.className = 'memory-card content-card channel-card group flex flex-col h-full source-card opacity-75';
        card.innerHTML = `
          <div class="mb-6 h-40 bg-[#120A2E] rounded-t-3xl flex items-center justify-center">
            ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
          </div>
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="text-[#6366F1] text-xs font-semibold tracking-[1.5px] uppercase">${source.id.toUpperCase()}</div>
              <h3 class="text-2xl font-semibold mt-1 text-white">${source.id.charAt(0).toUpperCase() + source.id.slice(1)} Transmission</h3>
            </div>
            ${typeof renderSiteIcon === 'function' ? renderSiteIcon('document', 'card-icon-lg') : ''}
          </div>
          <div class="flex-grow"></div>
          <div class="inline-flex items-center text-sm font-semibold text-[#6366F1] group-hover:text-white">
            Explore this source
            <span class="group-hover:translate-x-1 transition ml-2">→</span>
          </div>
        `;
        container.appendChild(card);
      }
    }
  } catch (error) {
    console.error('Failed to load sources:', error);
    document.getElementById('sources-grid').innerHTML = `
      <div class="col-span-3 text-center py-12">
        ${typeof renderSiteIcon === 'function' ? renderSiteIcon('library', 'card-icon-lg') : ''}
        <div class="text-xl font-semibold mb-2">Sources coming soon</div>
      </div>
    `;
  }
}

function handleCodexPillScroll() {
  if (window.location.hash === '#codex-pill') {
    TopicUtils.scrollToAnchor('codex-pill', 200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSources();
  handleCodexPillScroll();
});