// Quizzes hub — search + transmission filters over grouped sections

function initQuizzesHub() {
  const root = document.getElementById('quizzes-grid');
  const empty = document.getElementById('quizzes-empty');
  const countEl = document.getElementById('quizzes-visible-count');
  const searchInput = document.getElementById('quizzes-search');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
  const sections = Array.from(root.querySelectorAll('[data-source-section]'));
  const filterControls = Array.from(
    document.querySelectorAll('[data-quiz-filter]')
  );

  let activeSource = 'all';
  let query = '';

  function readProgressMap() {
    try {
      const raw = localStorage.getItem('21st-memory-quiz-progress-v1');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function paintScores() {
    const map = readProgressMap();
    cards.forEach((card) => {
      const key = card.getAttribute('data-quiz-key') || '';
      const scoreEl = card.querySelector('[data-quiz-score]');
      if (!scoreEl || !key) return;
      const entry = map[key];
      if (entry && typeof entry.bestPct === 'number') {
        scoreEl.hidden = false;
        scoreEl.textContent = `${entry.bestPct}% best`;
        scoreEl.classList.add('is-set');
        card.classList.add('has-score');
      } else {
        scoreEl.hidden = true;
        scoreEl.textContent = '';
        scoreEl.classList.remove('is-set');
        card.classList.remove('has-score');
      }
    });
  }

  function setActiveFilter(source) {
    activeSource = source || 'all';
    filterControls.forEach((el) => {
      const on = (el.getAttribute('data-quiz-filter') || 'all') === activeSource;
      el.classList.toggle('is-active', on);
      el.classList.toggle('active', on);
      if (el.hasAttribute('aria-pressed')) {
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  function applyFilters() {
    const q = query.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const source = card.getAttribute('data-source') || '';
      const blob = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      const sourceOk = activeSource === 'all' || source === activeSource;
      const queryOk = !q || blob.includes(q);
      const show = sourceOk && queryOk;
      card.hidden = !show;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    sections.forEach((section) => {
      const sourceId = section.getAttribute('data-source-section') || '';
      const sectionCards = Array.from(
        section.querySelectorAll('.quiz-hub-row, .quiz-hub-card')
      );
      const sectionVisible = sectionCards.filter((c) => !c.hidden).length;
      const sourceOk = activeSource === 'all' || sourceId === activeSource;
      const showSection = sourceOk && sectionVisible > 0;
      section.hidden = !showSection;
      section.style.display = showSection ? '' : 'none';
      const countNode = section.querySelector('[data-section-count]');
      if (countNode) {
        countNode.textContent = String(sectionVisible);
      }
    });

    if (countEl) {
      countEl.textContent =
        visible === cards.length
          ? `${visible} quizzes`
          : `${visible} of ${cards.length} quizzes`;
    }
    if (empty) empty.hidden = visible > 0;
  }

  // Filter via stats chips OR toolbar buttons
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-quiz-filter]');
    if (!btn || !document.contains(btn)) return;
    // Only handle filters that belong to this hub
    if (!filterControls.includes(btn) && !btn.closest('#quizzes-toolbar') && !btn.closest('.quiz-hub-stats')) {
      return;
    }
    event.preventDefault();
    setActiveFilter(btn.getAttribute('data-quiz-filter') || 'all');
    applyFilters();
  });

  if (searchInput) {
    let timer = null;
    const onSearch = () => {
      query = searchInput.value || '';
      applyFilters();
    };
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(onSearch, 120);
    });
    searchInput.addEventListener('search', onSearch);
  }

  setActiveFilter('all');
  paintScores();
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizzesHub);
} else {
  initQuizzesHub();
}
