// Quizzes hub — path-first overview, progress stats, continue strip, lazy catalog

const QUIZ_INDEX_URL = 'data/quizzes-index.json';
const QUIZ_PROGRESS_KEY = '21st-memory-quiz-progress-v1';
const QUIZ_PASS_PCT = 70;

function initQuizzesHub() {
  const browse = document.getElementById('quiz-browse');
  const root = document.getElementById('quizzes-grid');
  const empty = document.getElementById('quizzes-empty');
  const countEl = document.getElementById('quizzes-visible-count');
  const searchInput = document.getElementById('quizzes-search');
  const backBtn = document.querySelector('[data-quiz-show-overview]');
  const continueRoot = document.getElementById('quiz-continue');
  const continueTrack = document.getElementById('quiz-continue-track');
  const statsRoot = document.getElementById('quiz-hub-stats');
  const statsGrid = document.getElementById('quiz-hub-stats-grid');
  const statsBarFill = document.getElementById('quiz-hub-stats-bar-fill');
  const sortSelect = document.getElementById('quizzes-sort');
  const viewToggle = document.getElementById('quizzes-view-toggle');
  if (!root || !browse) return;

  let cards = Array.from(root.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
  let sections = Array.from(root.querySelectorAll('[data-source-section]'));
  const filterControls = Array.from(document.querySelectorAll('[data-quiz-filter]'));
  const statusControls = Array.from(document.querySelectorAll('[data-quiz-status]'));

  let activeSource = 'all';
  let activeStatus = 'all';
  let query = '';
  let mode = 'overview';
  let sortMode = 'az';
  let viewMode = 'list';
  let catalogLoaded = cards.length > 0;
  let catalogLoading = false;
  let quizIndex = null;

  cards.forEach((card, i) => {
    card.setAttribute('data-orig-order', String(i));
  });

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function readProgressMap() {
    try {
      const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function scoreTier(pct) {
    if (pct >= 90) return 'excellent';
    if (pct >= QUIZ_PASS_PCT) return 'strong';
    if (pct >= 40) return 'fair';
    return 'low';
  }

  function refreshCardLists() {
    cards = Array.from(root.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
    sections = Array.from(root.querySelectorAll('[data-source-section]'));
    cards.forEach((card, i) => {
      if (!card.hasAttribute('data-orig-order')) {
        card.setAttribute('data-orig-order', String(i));
      }
    });
  }

  function computeProgressSummary(map, totalQuizzes) {
    const entries = Object.values(map || {}).filter(
      (v) => v && typeof v.bestPct === 'number'
    );
    const attempted = entries.length;
    const completed = entries.filter((e) => e.bestPct >= QUIZ_PASS_PCT).length;
    const avgBest = attempted
      ? Math.round(entries.reduce((sum, e) => sum + e.bestPct, 0) / attempted)
      : 0;
    const attempts = entries.reduce((sum, e) => sum + (e.attempts || 1), 0);
    const total = totalQuizzes || attempted || 0;
    const pctOfCatalog = total ? Math.round((attempted / total) * 100) : 0;
    return { attempted, completed, avgBest, attempts, total, pctOfCatalog };
  }

  function paintStats() {
    if (!statsRoot || !statsGrid) return;
    const map = readProgressMap();
    const totalFromIndex =
      (quizIndex && (quizIndex.total || (quizIndex.quizzes || []).length)) || 0;
    const summary = computeProgressSummary(map, totalFromIndex);

    if (!summary.attempted && !totalFromIndex) {
      statsRoot.hidden = true;
      return;
    }

    // Always show once we know catalog size or have any progress
    statsRoot.hidden = false;
    const totalLabel = summary.total || '—';
    statsGrid.innerHTML = `
      <div class="quiz-hub-stat">
        <span class="quiz-hub-stat__value">${summary.attempted}<span class="quiz-hub-stat__of">/${totalLabel}</span></span>
        <span class="quiz-hub-stat__label">Attempted</span>
      </div>
      <div class="quiz-hub-stat">
        <span class="quiz-hub-stat__value">${summary.completed}</span>
        <span class="quiz-hub-stat__label">Passed (≥${QUIZ_PASS_PCT}%)</span>
      </div>
      <div class="quiz-hub-stat">
        <span class="quiz-hub-stat__value">${summary.attempted ? `${summary.avgBest}%` : '—'}</span>
        <span class="quiz-hub-stat__label">Avg best score</span>
      </div>
      <div class="quiz-hub-stat">
        <span class="quiz-hub-stat__value">${summary.attempts || 0}</span>
        <span class="quiz-hub-stat__label">Total attempts</span>
      </div>
    `;
    if (statsBarFill) {
      statsBarFill.style.width = `${Math.min(100, summary.pctOfCatalog)}%`;
      statsBarFill.setAttribute(
        'aria-label',
        `${summary.attempted} of ${summary.total || 0} quizzes attempted`
      );
    }
  }

  function paintPathProgress() {
    const map = readProgressMap();
    const quizzes = (quizIndex && quizIndex.quizzes) || [];
    document.querySelectorAll('[data-quiz-path]').forEach((card) => {
      const pathId = card.getAttribute('data-quiz-path');
      if (!pathId || pathId === 'all') return;
      const pathQuizzes = quizzes.filter((q) => q.sourceId === pathId);
      const total = pathQuizzes.length || parseInt(
        (card.querySelector('.quiz-hub-path-card__count')?.textContent || '').replace(/\D/g, ''),
        10
      ) || 0;
      let attempted = 0;
      let sumPct = 0;
      pathQuizzes.forEach((q) => {
        const key = q.key || `${q.sourceId}/${q.id}`;
        const entry = map[key];
        if (entry && typeof entry.bestPct === 'number') {
          attempted += 1;
          sumPct += entry.bestPct;
        }
      });
      const avg = attempted ? Math.round(sumPct / attempted) : null;
      const countEl = card.querySelector('.quiz-hub-path-card__count');
      if (countEl && total) {
        countEl.textContent =
          attempted > 0
            ? `${attempted}/${total} · ${avg}% avg`
            : `${total} quizzes`;
      }
      let progressEl = card.querySelector('[data-path-progress]');
      if (attempted > 0) {
        if (!progressEl) {
          progressEl = document.createElement('span');
          progressEl.className = 'quiz-hub-path-card__progress';
          progressEl.setAttribute('data-path-progress', '');
          const meta = card.querySelector('.quiz-hub-path-card__meta');
          if (meta) meta.insertBefore(progressEl, meta.firstChild);
        }
        const pctDone = total ? Math.round((attempted / total) * 100) : 0;
        progressEl.innerHTML = `<span class="quiz-hub-path-card__progress-fill" style="width:${pctDone}%"></span>`;
        progressEl.title = `${attempted} of ${total} attempted on this device`;
      } else if (progressEl) {
        progressEl.remove();
      }
    });
  }

  function paintScores() {
    const map = readProgressMap();
    cards.forEach((card) => {
      const key = card.getAttribute('data-quiz-key') || '';
      const scoreEl = card.querySelector('[data-quiz-score]');
      const statusEl = card.querySelector('[data-quiz-status-label]');
      const attemptsEl = card.querySelector('[data-quiz-attempts]');
      const ctaEl = card.querySelector('.quiz-hub-row__cta, .quiz-hub-card__cta');
      if (!key) return;

      const entry = map[key];
      if (entry && typeof entry.bestPct === 'number') {
        const tier = scoreTier(entry.bestPct);
        if (scoreEl) {
          scoreEl.hidden = false;
          scoreEl.textContent = `${entry.bestPct}% best`;
          scoreEl.classList.add('is-set');
          scoreEl.dataset.tier = tier;
        }
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent =
            entry.bestPct >= QUIZ_PASS_PCT ? 'Passed' : 'Attempted';
          statusEl.dataset.tier = tier;
          statusEl.classList.add('is-set');
        }
        if (attemptsEl) {
          const n = entry.attempts || 1;
          attemptsEl.hidden = false;
          attemptsEl.textContent = n === 1 ? '1 attempt' : `${n} attempts`;
        }
        if (ctaEl) ctaEl.textContent = 'Retake →';
        card.classList.add('has-score');
        card.classList.toggle('is-passed', entry.bestPct >= QUIZ_PASS_PCT);
        card.setAttribute('data-quiz-done', entry.bestPct >= QUIZ_PASS_PCT ? '1' : '0');
        card.setAttribute('data-has-progress', '1');
        card.setAttribute('data-best-pct', String(entry.bestPct));
        if (entry.lastPlayed) card.setAttribute('data-last-played', entry.lastPlayed);
      } else {
        if (scoreEl) {
          scoreEl.hidden = true;
          scoreEl.textContent = '';
          scoreEl.classList.remove('is-set');
          delete scoreEl.dataset.tier;
        }
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent = 'Not started';
          statusEl.classList.add('is-set');
          statusEl.dataset.tier = 'new';
        }
        if (attemptsEl) {
          attemptsEl.hidden = true;
          attemptsEl.textContent = '';
        }
        if (ctaEl) ctaEl.textContent = 'Start →';
        card.classList.remove('has-score', 'is-passed');
        card.removeAttribute('data-quiz-done');
        card.removeAttribute('data-has-progress');
        card.removeAttribute('data-best-pct');
        card.removeAttribute('data-last-played');
      }
    });
  }

  function paintContinueStrip() {
    if (!continueRoot || !continueTrack) return;
    const map = readProgressMap();
    const entries = Object.entries(map)
      .filter(([, v]) => v && v.lastPlayed)
      .sort((a, b) => {
        const ta = Date.parse(a[1].lastPlayed) || 0;
        const tb = Date.parse(b[1].lastPlayed) || 0;
        return tb - ta;
      })
      .slice(0, 8);

    if (!entries.length) {
      continueRoot.hidden = true;
      continueTrack.innerHTML = '';
      return;
    }

    const hrefByKey = new Map();
    const titleByKey = new Map();
    cards.forEach((card) => {
      const key = card.getAttribute('data-quiz-key') || '';
      if (!key) return;
      hrefByKey.set(key, card.getAttribute('href') || '#');
      const titleEl = card.querySelector('.quiz-hub-row__title, .quiz-hub-card__title');
      titleByKey.set(key, titleEl ? titleEl.textContent.trim() : key);
    });
    if (quizIndex && Array.isArray(quizIndex.quizzes)) {
      quizIndex.quizzes.forEach((q) => {
        const key = q.key || `${q.sourceId}/${q.id}`;
        if (q.href) hrefByKey.set(key, q.href);
        if (q.title) titleByKey.set(key, q.title);
      });
    }

    continueTrack.innerHTML = entries
      .map(([key, entry]) => {
        const href = hrefByKey.get(key) || `quiz/${key}.html`;
        const title = entry.title || titleByKey.get(key) || key;
        const pct = typeof entry.bestPct === 'number' ? entry.bestPct : null;
        const tier = pct != null ? scoreTier(pct) : 'new';
        const attempts = entry.attempts || 1;
        const scoreHtml =
          pct != null
            ? `<span class="quiz-continue-card__score" data-tier="${tier}">${pct}% best</span>`
            : '';
        return `<a href="${escapeAttr(href)}" class="quiz-continue-card">
  <span class="quiz-continue-card__label">Continue</span>
  <span class="quiz-continue-card__title">${escapeHtml(title)}</span>
  <span class="quiz-continue-card__meta">
    ${scoreHtml}
    <span class="quiz-continue-card__attempts">${attempts} attempt${attempts === 1 ? '' : 's'}</span>
  </span>
</a>`;
      })
      .join('');

    continueRoot.hidden = false;
  }

  function paintAllProgress() {
    paintScores();
    paintContinueStrip();
    paintStats();
    paintPathProgress();
  }

  function renderRow(quiz) {
    const key = quiz.key || `${quiz.sourceId}/${quiz.id}`;
    const searchBlob = [quiz.title, quiz.subtitle, quiz.sourceLabel, quiz.sourceTitle]
      .join(' ')
      .toLowerCase();
    return `<a href="${escapeAttr(quiz.href)}" class="quiz-hub-row quiz-hub-card" role="listitem" data-source="${escapeAttr(quiz.sourceId)}" data-quiz-key="${escapeAttr(key)}" data-search="${escapeAttr(searchBlob)}">
  <span class="quiz-hub-row__status" data-quiz-status-label hidden>Not started</span>
  <span class="quiz-hub-row__body">
    <span class="quiz-hub-card__title quiz-hub-row__title">${escapeHtml(quiz.title)}</span>
    <span class="quiz-hub-card__meta quiz-hub-row__meta">
      <span class="quiz-hub-card__count quiz-hub-row__count">${quiz.questionCount || 0} Q</span>
      <span class="quiz-hub-card__score quiz-hub-row__score" data-quiz-score hidden></span>
      <span class="quiz-hub-row__attempts" data-quiz-attempts hidden></span>
    </span>
  </span>
  <span class="quiz-hub-card__cta quiz-hub-row__cta">Start →</span>
</a>`;
  }

  function renderCatalogFromIndex(index) {
    const sources = index.sources || [];
    const bySource = {};
    (index.quizzes || []).forEach((q) => {
      const sid = q.sourceId || 'other';
      if (!bySource[sid]) bySource[sid] = [];
      bySource[sid].push(q);
    });

    const order = sources.map((s) => s.id).filter(Boolean);
    Object.keys(bySource).forEach((id) => {
      if (!order.includes(id)) order.push(id);
    });

    const map = readProgressMap();
    const html = order
      .map((sourceId) => {
        const list = bySource[sourceId] || [];
        if (!list.length) return '';
        const meta = sources.find((s) => s.id === sourceId) || {
          id: sourceId,
          label: sourceId,
          title: sourceId,
          short: '',
        };
        list.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
        let pathAttempted = 0;
        list.forEach((q) => {
          const key = q.key || `${q.sourceId}/${q.id}`;
          if (map[key] && typeof map[key].bestPct === 'number') pathAttempted += 1;
        });
        const progressLine =
          pathAttempted > 0
            ? ` · <span data-section-progress>${pathAttempted} attempted</span>`
            : '';
        const rows = list.map(renderRow).join('\n');
        return `<section class="quiz-hub-section" data-source-section="${escapeAttr(sourceId)}" id="quiz-source-${escapeAttr(sourceId)}">
  <header class="quiz-hub-section__head">
    <div>
      <p class="quiz-hub-section__eyebrow">${escapeHtml(meta.short || meta.label || '')}</p>
      <h2 class="quiz-hub-section__title">${escapeHtml(meta.title || meta.label || sourceId)}</h2>
      <p class="quiz-hub-section__meta"><span class="quiz-hub-section__count" data-section-count>${list.length}</span> quizzes in this transmission${progressLine}</p>
    </div>
    <a href="topics.html?source=${escapeAttr(sourceId)}" class="quiz-hub-section__link">Browse topics →</a>
  </header>
  <div class="quiz-hub-section__grid" role="list">
${rows}
  </div>
</section>`;
      })
      .filter(Boolean)
      .join('\n');

    root.innerHTML = html;
    catalogLoaded = true;
    refreshCardLists();
    paintAllProgress();
  }

  async function ensureCatalog() {
    if (catalogLoaded) return true;
    if (catalogLoading) return false;
    catalogLoading = true;
    root.setAttribute('aria-busy', 'true');
    const shell = root.querySelector('[data-quiz-lazy-shell]');
    if (shell) {
      shell.setAttribute('aria-busy', 'true');
      const note = shell.querySelector('.quiz-hub-lazy-note');
      if (note) note.textContent = 'Loading catalog…';
    }
    try {
      if (!quizIndex) {
        const res = await fetch(QUIZ_INDEX_URL, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        quizIndex = await res.json();
      }
      renderCatalogFromIndex(quizIndex);
      root.removeAttribute('aria-busy');
      return true;
    } catch (err) {
      console.warn('Quiz catalog failed to load', err);
      root.innerHTML =
        '<p class="text-sm text-mem-muted p-4" role="alert">Could not load the quiz catalog. Please refresh and try again.</p>';
      root.removeAttribute('aria-busy');
      return false;
    } finally {
      catalogLoading = false;
    }
  }

  function prefetchIndex() {
    const run = () => {
      if (quizIndex) {
        paintAllProgress();
        return;
      }
      fetch(QUIZ_INDEX_URL, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            quizIndex = data;
            paintAllProgress();
          }
        })
        .catch(() => {
          paintAllProgress();
        });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 400);
    }
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

  function setActiveStatus(status) {
    activeStatus = status || 'all';
    statusControls.forEach((el) => {
      const on = (el.getAttribute('data-quiz-status') || 'all') === activeStatus;
      el.classList.toggle('is-active', on);
      el.classList.toggle('active', on);
      if (el.hasAttribute('aria-pressed')) {
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  function cardMatchesStatus(card) {
    if (activeStatus === 'all') return true;
    const hasProgress = card.getAttribute('data-has-progress') === '1';
    if (activeStatus === 'new') return !hasProgress;
    if (activeStatus === 'done') return hasProgress;
    return true;
  }

  function cardMatchesFilters(card) {
    const q = query.trim().toLowerCase();
    const source = card.getAttribute('data-source') || '';
    const blob = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
    const sourceOk = activeSource === 'all' || source === activeSource;
    const queryOk = !q || blob.includes(q);
    const statusOk = cardMatchesStatus(card);
    return sourceOk && queryOk && statusOk;
  }

  function sortValue(card) {
    if (sortMode === 'score') {
      return -(parseInt(card.getAttribute('data-best-pct') || '-1', 10));
    }
    if (sortMode === 'recent') {
      const t = Date.parse(card.getAttribute('data-last-played') || '') || 0;
      return -t;
    }
    if (sortMode === 'new') {
      const has = card.getAttribute('data-has-progress') === '1' ? 1 : 0;
      const title = (
        card.querySelector('.quiz-hub-row__title, .quiz-hub-card__title')?.textContent || ''
      ).toLowerCase();
      return `${has}|${title}`;
    }
    const title = (
      card.querySelector('.quiz-hub-row__title, .quiz-hub-card__title')?.textContent || ''
    ).toLowerCase();
    return title;
  }

  function reorderWithinSections() {
    sections.forEach((section) => {
      const grid = section.querySelector('.quiz-hub-section__grid');
      if (!grid) return;
      const sectionCards = Array.from(grid.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
      sectionCards.sort((a, b) => {
        const va = sortValue(a);
        const vb = sortValue(b);
        if (va < vb) return -1;
        if (va > vb) return 1;
        return (
          parseInt(a.getAttribute('data-orig-order') || '0', 10) -
          parseInt(b.getAttribute('data-orig-order') || '0', 10)
        );
      });
      sectionCards.forEach((c) => grid.appendChild(c));
    });
  }

  function applyFilters() {
    if (!catalogLoaded) {
      if (countEl) countEl.textContent = '';
      if (empty) empty.hidden = true;
      return;
    }

    reorderWithinSections();

    const orderedCards = Array.from(root.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
    const matching = orderedCards.filter(cardMatchesFilters);
    const totalMatch = matching.length;
    const matchSet = new Set(matching);

    orderedCards.forEach((card) => {
      const show = matchSet.has(card);
      card.hidden = !show;
      card.style.display = show ? '' : 'none';
      card.classList.remove('is-paginated-out');
    });

    sections.forEach((section) => {
      const sourceId = section.getAttribute('data-source-section') || '';
      const sectionCards = Array.from(section.querySelectorAll('.quiz-hub-row, .quiz-hub-card'));
      const sectionMatch = sectionCards.filter(cardMatchesFilters).length;
      const sourceOk = activeSource === 'all' || sourceId === activeSource;
      const anyVisible = sectionCards.some((c) => !c.hidden);
      const showSection = mode === 'catalog' && sourceOk && sectionMatch > 0 && anyVisible;
      section.hidden = !showSection;
      section.style.display = showSection ? '' : 'none';
      const countNode = section.querySelector('[data-section-count]');
      if (countNode) countNode.textContent = String(sectionMatch);
    });

    if (countEl) {
      if (mode !== 'catalog') countEl.textContent = '';
      else {
        const withScores = matching.filter((c) => c.getAttribute('data-has-progress') === '1')
          .length;
        const base =
          totalMatch === orderedCards.length
            ? `${totalMatch} quizzes`
            : `${totalMatch} of ${orderedCards.length} quizzes`;
        countEl.textContent =
          withScores > 0 ? `${base} · ${withScores} with scores on this device` : base;
      }
    }

    if (empty) empty.hidden = mode !== 'catalog' || totalMatch > 0;
  }

  function setViewMode(next) {
    viewMode = next === 'grid' ? 'grid' : 'list';
    root.classList.toggle('quiz-hub-catalog--grid', viewMode === 'grid');
    root.classList.toggle('quiz-hub-catalog--list', viewMode === 'list');
    if (viewToggle) {
      viewToggle.querySelectorAll('[data-quiz-view]').forEach((btn) => {
        const on = btn.getAttribute('data-quiz-view') === viewMode;
        btn.classList.toggle('is-active', on);
        btn.classList.toggle('active', on);
        if (btn.hasAttribute('aria-pressed')) {
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      });
    }
  }

  async function setMode(next, options = {}) {
    mode = next === 'catalog' ? 'catalog' : 'overview';
    browse.classList.toggle('is-overview', mode === 'overview');
    browse.classList.toggle('is-catalog', mode === 'catalog');
    if (backBtn) backBtn.hidden = mode !== 'catalog';

    document.querySelectorAll('.quiz-hub-paths').forEach((el) => {
      el.hidden = mode === 'catalog';
    });

    if (mode === 'catalog') {
      const ok = await ensureCatalog();
      if (!ok) return;
    }

    if (mode === 'catalog' && options.scroll !== false) {
      const top = browse.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    applyFilters();
    paintAllProgress();

    try {
      const url = new URL(window.location.href);
      if (mode === 'catalog') {
        if (activeSource && activeSource !== 'all') url.searchParams.set('source', activeSource);
        else url.searchParams.delete('source');
        url.searchParams.set('browse', '1');
      } else {
        url.searchParams.delete('browse');
        url.searchParams.delete('source');
      }
      window.history.replaceState({}, '', url);
    } catch (_) {
      /* ignore */
    }
  }

  async function openCatalog(source) {
    if (source) setActiveFilter(source);
    await setMode('catalog');
  }

  document.addEventListener('click', (event) => {
    const pathBtn = event.target.closest('[data-quiz-path]');
    if (pathBtn && document.contains(pathBtn)) {
      event.preventDefault();
      openCatalog(pathBtn.getAttribute('data-quiz-path') || 'all');
      return;
    }

    const showCatalog = event.target.closest('[data-quiz-show-catalog]');
    if (showCatalog && document.contains(showCatalog)) {
      event.preventDefault();
      openCatalog(showCatalog.getAttribute('data-quiz-filter') || 'all');
      return;
    }

    const showOverview = event.target.closest('[data-quiz-show-overview]');
    if (showOverview && document.contains(showOverview)) {
      event.preventDefault();
      setActiveFilter('all');
      setActiveStatus('all');
      sortMode = 'az';
      if (sortSelect) sortSelect.value = 'az';
      if (searchInput) {
        searchInput.value = '';
        query = '';
      }
      setMode('overview', { scroll: true });
      return;
    }

    const viewBtn = event.target.closest('[data-quiz-view]');
    if (viewBtn && document.contains(viewBtn)) {
      event.preventDefault();
      setViewMode(viewBtn.getAttribute('data-quiz-view') || 'list');
      return;
    }

    const filterBtn = event.target.closest('[data-quiz-filter]');
    if (filterBtn && document.contains(filterBtn)) {
      if (filterBtn.hasAttribute('data-quiz-show-catalog') || filterBtn.hasAttribute('data-quiz-path')) {
        return;
      }
      if (
        !filterControls.includes(filterBtn) &&
        !filterBtn.closest('#quizzes-toolbar')
      ) {
        return;
      }
      event.preventDefault();
      setActiveFilter(filterBtn.getAttribute('data-quiz-filter') || 'all');
      if (mode !== 'catalog') setMode('catalog', { scroll: false });
      else applyFilters();
      return;
    }

    const statusBtn = event.target.closest('[data-quiz-status]');
    if (statusBtn && document.contains(statusBtn)) {
      event.preventDefault();
      setActiveStatus(statusBtn.getAttribute('data-quiz-status') || 'all');
      if (mode !== 'catalog') setMode('catalog', { scroll: false });
      else applyFilters();
    }
  });

  if (searchInput) {
    let timer = null;
    const onSearch = () => {
      query = searchInput.value || '';
      if (query.trim() && mode !== 'catalog') {
        setMode('catalog', { scroll: false });
      } else {
        applyFilters();
      }
    };
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(onSearch, 120);
    });
    searchInput.addEventListener('search', onSearch);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortMode = sortSelect.value || 'az';
      if (mode !== 'catalog') setMode('catalog', { scroll: false });
      else applyFilters();
    });
  }

  // Refresh scores when returning from a quiz (bfcache / focus)
  window.addEventListener('pageshow', () => paintAllProgress());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') paintAllProgress();
  });

  let initialSource = 'all';
  let startCatalog = false;
  try {
    const params = new URLSearchParams(window.location.search);
    const src = params.get('source');
    if (src === 'alice' || src === 'breakdown') {
      initialSource = src;
      startCatalog = true;
    }
    if (params.get('browse') === '1' || params.get('q')) startCatalog = true;
    const qParam = params.get('q');
    if (qParam && searchInput) {
      searchInput.value = qParam;
      query = qParam;
      startCatalog = true;
    }
    const sortParam = params.get('sort');
    if (sortParam && sortSelect) {
      sortSelect.value = sortParam;
      sortMode = sortParam;
    }
  } catch (_) {
    /* ignore */
  }

  setActiveFilter(initialSource);
  setActiveStatus('all');
  setViewMode('list');
  paintAllProgress();
  prefetchIndex();
  setMode(startCatalog ? 'catalog' : 'overview', { scroll: false });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizzesHub);
} else {
  initQuizzesHub();
}
