// Deep-Dive page — topic viewer with breadcrumbs, media, and report

let currentZoom = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startY = 0;

async function loadLessonViewer() {
  const urlParams = new URLSearchParams(window.location.search);
  const sourceId = urlParams.get('source') || 'alice';
  const topicId = urlParams.get('topic');

  const headerContainer = document.getElementById('lesson-header');
  const infographicContainer = document.getElementById('infographic-container');
  const pdfContainer = document.getElementById('pdf-container');
  const videosContainer = document.getElementById('videos-container');
  const reportContainer = document.getElementById('report-container');
  const pdfPreviewContainer = document.getElementById('pdf-preview-container');

  if (!topicId) {
    headerContainer.innerHTML = '<div class="text-center py-12"><p class="text-red-400">No topic specified. Please return to the Codex.</p></div>';
    return;
  }

  try {
    const response = await fetch(`data/${sourceId}-topics.json`);
    if (!response.ok) throw new Error('Topics data not found');

    const fullData = await response.json();
    const topic = TopicUtils.findTopicById(fullData.topics, topicId);
    const topicPath = TopicUtils.findTopicPath(fullData.topics, topicId);

    if (!topic) {
      headerContainer.innerHTML = `<div class="text-center py-12"><p class="text-red-400">Topic not found: ${topicId}</p></div>`;
      return;
    }

    document.title = `21st Memory Deep-Dive | ${topic.title}`;

    const breadcrumbs = TopicUtils.renderBreadcrumbs({
      sourceId,
      sourceTitle: fullData.title,
      topicPath,
      currentTitle: topic.title
    });

    headerContainer.innerHTML = `
      ${breadcrumbs}
      <div class="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10">
        <div class="flex-shrink-0 w-48 h-48 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(109,40,217,0.35)] flex items-center justify-center bg-mem-inset border border-mem-subtle">
          ${topic.topic_image
            ? `<img src="${(topic.topic_image || '').replace(/\\/g, '/')}" alt="${topic.title} visual" class="w-full h-full object-cover" width="288" height="288" loading="eager" onerror="this.outerHTML='<div class=\\'flex items-center justify-center h-full text-mem-accent text-sm font-mono tracking-[3px] opacity-60\\'>TOPIC IMAGE</div>'">`
            : '<div class="flex items-center justify-center h-full text-mem-accent text-sm font-mono tracking-[3px] opacity-60">TOPIC IMAGE</div>'
          }
        </div>
        <div class="flex-1 min-w-0 pt-1">
          <div class="inline-flex items-center px-4 py-1 rounded-full bg-mem-surface text-mem-muted text-xs font-semibold tracking-[2px] mb-4 border border-mem-subtle">
            ${fullData.title.toUpperCase()} • TOPIC
          </div>
          <h1 class="text-5xl md:text-6xl font-semibold tracking-tighter leading-none mb-4">${topic.title}</h1>
          <div class="text-[17px] text-mem-secondary max-w-[42ch] leading-relaxed">
            ${(topic.description || '').split('\n\n').map(p => `<p class="mb-3 last:mb-0">${p}</p>`).join('')}
          </div>
          <div class="mt-7">
            <div class="text-xs tracking-[1.5px] text-mem-muted mb-2.5 font-semibold">JUMP TO</div>
            <div class="flex flex-wrap gap-2.5 mb-4">
              <button onclick="scrollToSection('infographics-section')" class="btn-topic-nav inline-flex items-center gap-2 justify-center text-sm" aria-label="Scroll to infographics and slide decks section">${typeof renderSiteIcon === 'function' ? renderSiteIcon('chart', 'card-icon-sm') : ''} INFOGRAPHICS &amp; SLIDES</button>
              <button onclick="scrollToSection('videos-section')" class="btn-topic-nav inline-flex items-center gap-2 justify-center text-sm" aria-label="Scroll to video transmissions section">${typeof renderSiteIcon === 'function' ? renderSiteIcon('video', 'card-icon-sm') : ''} VIDEOS</button>
              <button onclick="scrollToSection('report-section')" class="btn-topic-nav inline-flex items-center gap-2 justify-center text-sm" aria-label="Scroll to deep dive report section">${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} FULL REPORT</button>
            </div>
            <div class="flex flex-wrap gap-3 pt-1 border-t border-mem-subtle">
              <a href="codex.html#codex-pill" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← BACK TO CODEX</a>
              <a href="topics.html?source=${sourceId}#explore-topics" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← BACK TO TOPICS</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const hasAnyContent = !!(topic.infographic_image ||
      topic.slide_deck_pdf_url ||
      (topic.rumble_videos && topic.rumble_videos.length > 0) ||
      topic.report);

    if (!hasAnyContent) {
      headerContainer.insertAdjacentHTML('afterend', `
        <div class="max-w-2xl mx-auto text-center py-20">
          ${typeof renderSiteIcon === 'function' ? `<div class="mb-8 flex justify-center">${renderSiteIcon('star', 'card-icon-lg')}</div>` : ''}
          <h2 class="text-4xl font-semibold tracking-tighter mb-6">This Topic Continues to Unfold</h2>
          <p class="text-mem-soft text-lg max-w-lg mx-auto leading-relaxed mb-10">
            The complete Codex experience for this topic is being prepared with care,
            encompassing infographics, slide decks, video transmissions, and a deep-dive report.
            The Great Remembering reveals its wisdom in perfect timing.
          </p>
          <a href="topics.html?source=${sourceId}#explore-topics" class="btn-primary inline-flex items-center justify-center px-10 py-4 text-base font-semibold">← BACK TO TOPICS</a>
          <div class="mt-8 text-xs text-mem-dim tracking-widest">THE ARCHIVE CONTINUES TO EXPAND</div>
        </div>
      `);
    }

    if (topic.infographic_image) {
      infographicContainer.innerHTML = `
        <div onclick="openInfographicModal('${topic.infographic_image}')" class="block w-full h-full cursor-pointer">
          <img src="${topic.infographic_image}" alt="${topic.title} Infographic"
               class="w-full h-auto max-h-[520px] object-contain rounded-2xl shadow-xl hover:scale-[1.015] transition-transform"
               width="800" height="600" loading="lazy"
               onerror="this.outerHTML='<div class=\\'flex flex-col items-center justify-center h-full text-center p-8\\'><div class=\\'text-6xl mb-4\\'>🖼️</div><div class=\\'text-mem-muted\\'>Infographic coming soon</div></div>'">
        </div>
      `;
    } else {
      infographicContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center p-8">
          <div class="text-6xl mb-4">🖼️</div>
          <div class="text-mem-muted">Infographic coming soon</div>
        </div>
      `;
    }

    if (pdfPreviewContainer) {
      if (topic.pdf_preview_image) {
        const pdfUrl = topic.slide_deck_pdf_url || '#';
        pdfPreviewContainer.innerHTML = `
          <div class="relative w-full h-full group" onclick="window.open('${pdfUrl}', '_blank')">
            <img src="${topic.pdf_preview_image}" alt="Slide deck preview - ${topic.title}"
                 class="w-full h-full object-contain rounded-2xl cursor-pointer transition-all duration-300 group-hover:brightness-105 group-hover:scale-[1.01]"
                 width="600" height="400" loading="lazy"
                 onerror="this.outerHTML='<div class=\\'flex flex-col items-center justify-center h-full p-8 text-center\\'><div class=\\'text-6xl mb-4 opacity-40\\'>📄</div><div class=\\'text-mem-muted text-sm leading-tight\\'>Preview image unavailable</div></div>'">
            <div onclick="event.stopImmediatePropagation(); window.open('${pdfUrl}', '_blank');"
                 class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-b from-black/30 to-black/60 rounded-2xl cursor-pointer">
              <div class="bg-white text-[#0A051F] px-8 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-2xl transform group-hover:scale-105 transition-transform">
                ${typeof renderSiteIcon === 'function' ? renderSiteIcon('book', 'card-icon-sm') : ''}
                <span class="font-bold tracking-wide">OPEN FULL SLIDE DECK</span>
              </div>
            </div>
            <div class="absolute top-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full font-mono tracking-widest">SLIDE DECK PREVIEW</div>
          </div>
        `;
      } else if (topic.slide_deck_pdf_url) {
        const fileIdMatch = topic.slide_deck_pdf_url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
        if (fileIdMatch?.[1]) {
          const thumbUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=1400`;
          pdfPreviewContainer.innerHTML = `
            <div class="relative w-full h-full group" onclick="window.open('${topic.slide_deck_pdf_url}', '_blank')">
              <img src="${thumbUrl}" alt="First page preview - ${topic.title}"
                   class="w-full h-full object-contain rounded-2xl cursor-pointer transition-all duration-300 group-hover:brightness-105 group-hover:scale-[1.01]"
                   width="600" height="400" loading="lazy"
                   onerror="this.outerHTML='<div class=\\'flex flex-col items-center justify-center h-full p-8 text-center\\'><div class=\\'text-6xl mb-4 opacity-40\\'>📄</div><div class=\\'text-mem-muted text-sm\\'>Preview temporarily unavailable</div></div>'">
              <div onclick="event.stopImmediatePropagation(); window.open('${topic.slide_deck_pdf_url}', '_blank');"
                   class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-b from-black/30 to-black/60 rounded-2xl cursor-pointer">
                <div class="bg-white text-[#0A051F] px-8 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-2xl transform group-hover:scale-105 transition-transform">
                  ${typeof renderSiteIcon === 'function' ? renderSiteIcon('book', 'card-icon-sm') : ''}
                  <span class="font-bold tracking-wide">OPEN FULL SLIDE DECK</span>
                </div>
              </div>
              <div class="absolute top-4 right-4 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full font-mono tracking-widest">PAGE 1 / AUTO PREVIEW</div>
            </div>
          `;
        } else {
          pdfPreviewContainer.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-center p-8"><div class="text-6xl mb-4 opacity-40">📄</div><div class="text-mem-muted text-sm">Could not extract PDF ID from link</div></div>';
        }
      } else {
        pdfPreviewContainer.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-center p-8"><div class="text-6xl mb-4 opacity-40">📄</div><div class="text-mem-muted text-sm">Slide deck preview coming soon</div></div>';
      }
    }

    if (pdfContainer && topic.slide_deck_pdf_url) {
      pdfContainer.innerHTML = `
        <a href="${topic.slide_deck_pdf_url}" target="_blank"
           class="btn-primary w-full inline-flex items-center justify-center gap-x-3 px-8 py-4 text-base font-semibold rounded-2xl hover:scale-[1.02] active:scale-[0.985] transition-transform">
          ${typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : ''} View / download slide deck PDF
        </a>
      `;
    } else if (pdfContainer) {
      pdfContainer.innerHTML = '<div class="text-center py-4 text-mem-muted text-sm">Slide deck coming soon</div>';
    }

    if (topic.rumble_videos?.length > 0) {
      const numVideos = topic.rumble_videos.length;
      let videoGridClass = 'grid gap-6';
      if (numVideos === 1) videoGridClass += ' grid-cols-1 max-w-2xl mx-auto';
      else if (numVideos === 2) videoGridClass += ' md:grid-cols-2 max-w-5xl mx-auto justify-center';
      else videoGridClass += ' md:grid-cols-2 lg:grid-cols-3';

      videosContainer.className = videoGridClass;
      videosContainer.innerHTML = topic.rumble_videos.map(video => `
        <div class="channel-card video-card rounded-3xl overflow-hidden flex flex-col border border-mem-subtle">
          <div class="aspect-video bg-black">
            <iframe src="${video.embed_url}" width="100%" height="100%" frameborder="0" allowfullscreen
                    class="w-full h-full" title="${video.title} - 21st Memory video transmission"></iframe>
          </div>
          <div class="px-4 py-3 flex-shrink-0 border-t border-mem-subtle/50">
            <div class="font-semibold text-[15px] tracking-tight leading-tight text-mem-body line-clamp-2">${video.title}</div>
          </div>
        </div>
      `).join('');
    } else {
      videosContainer.className = 'grid grid-cols-1';
      videosContainer.innerHTML = '<div class="col-span-full text-center py-12 text-mem-muted">Video transmissions coming soon for this topic.</div>';
    }

    if (topic.report) {
      reportContainer.innerHTML = marked.parse(topic.report);
      reportContainer.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('tracking-tight', 'font-semibold');
        if (el.tagName === 'H1') el.classList.add('font-bold');
      });
    } else {
      reportContainer.innerHTML = '<div class="text-center py-12 text-mem-muted">Detailed report coming soon.</div>';
    }
  } catch (error) {
    console.error('Error loading lesson:', error);
    headerContainer.innerHTML = `
      <div class="text-center py-20">
        <div class="text-red-400 text-2xl mb-4">⚠️ Unable to load lesson</div>
        <p class="text-mem-soft max-w-md mx-auto">${error.message}</p>
        <a href="codex.html" class="inline-block mt-8 text-sm underline">Return to Codex</a>
      </div>
    `;
  }
}

function updateTransform(img) {
  img.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
}

function setupImageZoom(img) {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  img.style.transform = 'scale(1) translate(0px, 0px)';
  img.style.transformOrigin = 'center center';
  img.style.cursor = 'default';

  img.addEventListener('wheel', function(e) {
    e.preventDefault();
    const rect = img.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    const zoomFactor = e.deltaY < 0 ? 1.18 : 0.82;
    currentZoom = Math.max(0.4, Math.min(6, currentZoom * zoomFactor));
    img.style.transformOrigin = `${mouseX}% ${mouseY}%`;
    updateTransform(img);
    img.style.cursor = currentZoom > 1 ? 'grab' : 'default';
  });

  img.addEventListener('mousedown', function(e) {
    if (currentZoom <= 1) return;
    isDragging = true;
    startY = e.clientY - translateY;
    img.style.cursor = 'grabbing';
    e.preventDefault();
  });

  img.addEventListener('mousemove', function(e) {
    if (!isDragging || currentZoom <= 1) return;
    translateY = e.clientY - startY;
    updateTransform(img);
    e.preventDefault();
  });

  const stopDragging = () => {
    if (isDragging) {
      isDragging = false;
      img.style.cursor = currentZoom > 1 ? 'grab' : 'default';
    }
  };

  img.addEventListener('mouseup', stopDragging);
  img.addEventListener('mouseleave', stopDragging);

  img.addEventListener('dblclick', function() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    img.style.transform = 'scale(1) translate(0px, 0px)';
    img.style.transformOrigin = 'center center';
    img.style.cursor = 'default';
  });
}

function openInfographicModal(src) {
  const modal = document.getElementById('infographic-modal');
  const img = document.getElementById('modal-image');
  if (!modal || !img) return;

  img.src = src;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setupImageZoom(img);
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const closeBtn = modal.querySelector('button[aria-label="Close infographic modal"]');
    if (closeBtn) closeBtn.focus();
  }, 50);
}

function closeInfographicModal() {
  const modal = document.getElementById('infographic-modal');
  if (!modal) return;

  const img = document.getElementById('modal-image');
  if (img) {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    img.style.transform = 'scale(1) translate(0px, 0px)';
    img.style.transformOrigin = 'center center';
    img.style.cursor = 'default';
  }

  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

window.openInfographicModal = openInfographicModal;
window.closeInfographicModal = closeInfographicModal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('infographic-modal');
    if (modal && !modal.classList.contains('hidden')) closeInfographicModal();
  }
});

window.addEventListener('load', loadLessonViewer);