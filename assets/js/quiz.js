// Interactive quiz engine for 21st Memory (GitHub Pages–friendly)

(function () {
  'use strict';

  const state = {
    data: null,
    /** Unshuffled copy from JSON; reshuffles always start from this. */
    originalQuestions: null,
    mode: 'instant', // 'instant' | 'submit'
    index: 0,
    answers: {}, // number -> selected label
    revealed: {}, // number -> true when feedback shown (instant mode)
    phase: 'start', // start | playing | results
    hintOpen: false,
    reviewAll: false,
    length: 'full', // 'full' | 'sprint'
    runKind: 'full', // 'full' | 'sprint' | 'missed'
    nextQuiz: undefined
  };

  const el = {
    root: null
  };

  function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ordinal(n) {
    const num = Math.max(0, Number(n) || 0);
    const mod100 = num % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
    switch (num % 10) {
      case 1:
        return `${num}st`;
      case 2:
        return `${num}nd`;
      case 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  }

  function getQuestions() {
    return state.data?.questions || [];
  }

  function totalCount() {
    return getQuestions().length;
  }

  function currentQuestion() {
    return getQuestions()[state.index] || null;
  }

  function scoreBand(pct) {
    const topic = state.data?.topicTitle || 'this transmission';
    if (pct >= 90) {
      return {
        name: 'Resonating',
        message: `Exceptional recall. The core truths of ${topic} are becoming clear.`
      };
    }
    if (pct >= 70) {
      return {
        name: 'Recalling',
        message: 'Strong grasp. A few overlays still remain — revisit the explanations below.'
      };
    }
    if (pct >= 50) {
      return {
        name: 'Overlayed',
        message: 'Solid beginning. Use the review section to uninstall remaining control strings.'
      };
    }
    return {
      name: 'Amnesiac',
      message: 'Every miss is a map. Study the rationales, then return to the deep-dive and try again.'
    };
  }

  function topicImageSrc() {
    const og = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    try {
      const url = new URL(og, window.location.origin);
      if (url.pathname.startsWith('/images/')) return url.pathname;
    } catch (_) {
      /* ignore */
    }
    const key = resolveQuizKey(state.data, el.root);
    const parts = String(key).split('/');
    if (parts[1]) return `/images/${encodeURIComponent(parts[0])}/${encodeURIComponent(parts[1])}.webp`;
    return '';
  }

  function quizPageUrl() {
    return String(window.location.href || '').split('#')[0];
  }

  function shareScoreText(score) {
    const title = state.data?.title || state.data?.topicTitle || 'this quiz';
    const band = scoreBand(score.pct).name;
    return `I scored ${score.correct}/${score.total} (${band}) on ${title} — ${quizPageUrl()}`;
  }

  async function shareScore(button) {
    const score = computeScore();
    const text = shareScoreText(score);
    const label = button?.querySelector('span');
    try {
      if (navigator.share) {
        await navigator.share({
          title: state.data?.title || 'Living Truth Quiz',
          text,
          url: quizPageUrl()
        });
        if (label) label.textContent = 'Shared';
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (label) label.textContent = 'Copied score';
    } catch (_) {
      if (label) label.textContent = 'Copy failed';
    }
  }

  function computeScore() {
    const questions = getQuestions();
    let correct = 0;
    let answered = 0;
    questions.forEach((q) => {
      const selected = state.answers[q.number];
      if (selected) {
        answered += 1;
        if (selected === q.correctAnswer) correct += 1;
      }
    });
    const total = questions.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return { correct, answered, total, pct };
  }

  /** Browser-only progress (no accounts). Survives reloads on this device. */
  const PROGRESS_KEY = '21st-memory-quiz-progress-v1';
  const RESUME_KEY = '21st-memory-quiz-resume-v1';
  const RESUME_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

  function resolveQuizKey(data, rootEl) {
    let sourceId = data?.sourceId || data?.source || '';
    const topicId = data?.topicId || data?.id || '';
    if (!sourceId && rootEl?.getAttribute) {
      const quizSrc = rootEl.getAttribute('data-quiz-src') || '';
      const match = quizSrc.match(/\/quizzes\/([^/]+)\/([^/]+)\.json/i);
      if (match) {
        sourceId = match[1];
        return `${match[1]}/${match[2].replace(/\.json$/i, '')}`;
      }
    }
    if (sourceId && topicId) return `${sourceId}/${topicId}`;
    return topicId || data?.title || 'unknown';
  }

  function readProgressMap() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function getSavedProgress(data, rootEl) {
    const key = resolveQuizKey(data, rootEl);
    const map = readProgressMap();
    return map[key] || null;
  }

  function readResumeMap() {
    try {
      const raw = localStorage.getItem(RESUME_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function getResumeBlob() {
    if (!state.data || !el.root) return null;
    const key = resolveQuizKey(state.data, el.root);
    if (!key) return null;
    const blob = readResumeMap()[key];
    if (!blob || blob.v !== 1) return null;
    if (!Array.isArray(blob.numbers) || !blob.numbers.length) return null;
    if (blob.savedAt && Date.now() - Number(blob.savedAt) > RESUME_MAX_AGE_MS) return null;
    const idx = Number(blob.index);
    if (!Number.isFinite(idx) || idx < 0 || idx >= blob.numbers.length) return null;
    return blob;
  }

  function clearResume() {
    if (!state.data || !el.root) return;
    const key = resolveQuizKey(state.data, el.root);
    if (!key) return;
    try {
      const map = readResumeMap();
      if (!map[key]) return;
      delete map[key];
      localStorage.setItem(RESUME_KEY, JSON.stringify(map));
    } catch (err) {
      console.warn('Could not clear quiz resume', err);
    }
  }

  function persistResume() {
    if (state.phase !== 'playing' || !state.data || !el.root) return;
    const questions = getQuestions();
    if (!questions.length) return;
    const answered = Object.keys(state.answers || {}).length;
    if (state.index <= 0 && !answered) return;
    const key = resolveQuizKey(state.data, el.root);
    if (!key) return;
    const optionOrder = {};
    questions.forEach((q) => {
      optionOrder[String(q.number)] = (q.options || []).map((opt) => opt.text);
    });
    try {
      const map = readResumeMap();
      map[key] = {
        v: 1,
        savedAt: Date.now(),
        index: state.index,
        answers: state.answers || {},
        revealed: state.revealed || {},
        mode: state.mode,
        length: state.length,
        runKind: state.runKind,
        numbers: questions.map((q) => q.number),
        optionOrder
      };
      localStorage.setItem(RESUME_KEY, JSON.stringify(map));
    } catch (err) {
      console.warn('Could not save quiz resume', err);
    }
  }

  function reletterOptions(question) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    (question.options || []).forEach((opt, i) => {
      opt.label = letters[i] || String(i + 1);
    });
    const correct = (question.options || []).find((opt) => opt.isCorrect);
    if (correct) question.correctAnswer = correct.label;
    return question;
  }

  function applyResume(blob) {
    if (!blob) return false;
    const bank = state.originalQuestions || [];
    const byNumber = new Map(bank.map((q) => [q.number, q]));
    const pool = [];
    for (const num of blob.numbers) {
      const src = byNumber.get(num);
      if (!src) return false;
      const clone = cloneQuestion(src);
      const texts = blob.optionOrder && blob.optionOrder[String(num)];
      if (Array.isArray(texts) && texts.length) {
        const ordered = [];
        for (const text of texts) {
          const opt = (clone.options || []).find((o) => o.text === text);
          if (!opt) return false;
          ordered.push(opt);
        }
        if (ordered.length !== (clone.options || []).length) return false;
        clone.options = ordered;
      }
      pool.push(reletterOptions(clone));
    }
    if (!pool.length) return false;
    state.data.questions = pool;
    state.index = Math.min(Math.max(0, Number(blob.index) || 0), pool.length - 1);
    state.answers = blob.answers && typeof blob.answers === 'object' ? { ...blob.answers } : {};
    state.revealed = blob.revealed && typeof blob.revealed === 'object' ? { ...blob.revealed } : {};
    state.mode = blob.mode === 'submit' ? 'submit' : 'instant';
    state.length = blob.length === 'sprint' ? 'sprint' : 'full';
    state.runKind = blob.runKind === 'sprint' || blob.runKind === 'missed' ? blob.runKind : 'full';
    state.phase = 'playing';
    state.hintOpen = false;
    state.reviewAll = false;
    return true;
  }

  function resumeQuiz() {
    const blob = getResumeBlob();
    if (!applyResume(blob)) {
      clearResume();
      render();
      focusQuizCard();
      return;
    }
    render();
    focusQuizCard();
    ensureNextQuiz();
  }

  function saveProgress(score) {
    if (!state.data || !el.root) return;
    const key = resolveQuizKey(state.data, el.root);
    if (!key) return;
    try {
      const map = readProgressMap();
      const prev = map[key] || {};
      const bestPct = Math.max(prev.bestPct || 0, score.pct || 0);
      const bestCorrect =
        score.pct >= (prev.bestPct || 0) ? score.correct : (prev.bestCorrect || score.correct);
      map[key] = {
        bestPct,
        bestCorrect: bestCorrect ?? score.correct,
        total: score.total,
        attempts: (prev.attempts || 0) + 1,
        lastPlayed: new Date().toISOString(),
        title: state.data.title || state.data.topicTitle || key
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    } catch (err) {
      console.warn('Could not save quiz progress', err);
    }
  }

  function optionByLabel(question, label) {
    return (question.options || []).find((o) => o.label === label) || null;
  }

  function correctOption(question) {
    return (question.options || []).find((o) => o.isCorrect) || optionByLabel(question, question.correctAnswer);
  }

  function setMode(mode) {
    state.mode = mode === 'submit' ? 'submit' : 'instant';
    render();
  }

  function setLength(length) {
    state.length = length === 'sprint' ? 'sprint' : 'full';
    render();
  }

  const SPRINT_SIZE = 10;

  function bankCount() {
    return (state.originalQuestions || getQuestions()).length;
  }

  function sprintSize() {
    return Math.min(SPRINT_SIZE, bankCount());
  }

  function canSprint() {
    return bankCount() > SPRINT_SIZE;
  }

  function missedQuestions() {
    return getQuestions().filter((q) => questionOutcome(q) !== 'ok');
  }

  /** Fisher–Yates shuffle (copy). */
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function cloneQuestion(question) {
    return {
      ...question,
      options: (question.options || []).map((opt) => ({ ...opt }))
    };
  }

  /** Shuffle A–D and reletter so the first shown choice is always A. */
  function shuffleQuestionOptions(question) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const options = shuffleArray(question.options || []);
    options.forEach((opt, i) => {
      opt.label = letters[i] || String(i + 1);
    });
    const correct = options.find((opt) => opt.isCorrect);
    if (correct) question.correctAnswer = correct.label;
    question.options = options;
    return question;
  }

  function beginRun(kind) {
    if (!state.data) return;
    const source =
      state.originalQuestions && state.originalQuestions.length
        ? state.originalQuestions
        : state.data.questions || [];
    if (!source.length) return;
    if (!state.originalQuestions) {
      state.originalQuestions = source.slice();
    }

    let pool;
    if (kind === 'missed') {
      const missed = missedQuestions();
      if (!missed.length) return;
      pool = missed.map((question) => shuffleQuestionOptions(cloneQuestion(question)));
      pool = shuffleArray(pool);
    } else {
      pool = shuffleArray(state.originalQuestions).map((question) =>
        shuffleQuestionOptions(cloneQuestion(question))
      );
      if (kind === 'sprint') pool = pool.slice(0, sprintSize());
    }

    state.data.questions = pool;
    state.runKind = kind;
    state.phase = 'playing';
    state.index = 0;
    state.answers = {};
    state.revealed = {};
    state.hintOpen = false;
    state.reviewAll = false;
    clearResume();
    render();
    focusQuizCard();
    persistResume();
    ensureNextQuiz();
  }

  function startQuiz() {
    const kind = state.length === 'sprint' && canSprint() ? 'sprint' : 'full';
    beginRun(kind);
  }

  function restartQuiz() {
    state.phase = 'start';
    state.index = 0;
    state.answers = {};
    state.revealed = {};
    state.hintOpen = false;
    state.reviewAll = false;
    // Restore original order on the start screen; next Begin shuffles again.
    if (state.data && state.originalQuestions) {
      state.data.questions = state.originalQuestions.slice();
    }
    render();
    focusQuizCard();
  }

  function focusQuizCard() {
    const card = el.root?.querySelector('.quiz-card');
    if (!card) return;
    card.setAttribute('tabindex', '-1');
    card.focus({ preventScroll: true });
    // Playing: nearest so going next doesn't jump. Start/results: pin the
    // top of the card under the navbar so a tall results page doesn't leave
    // you stranded in the review section.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pinTop = state.phase === 'start' || state.phase === 'results';
    card.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: pinTop ? 'start' : 'nearest',
      inline: 'nearest'
    });
  }

  function selectOption(label) {
    const q = currentQuestion();
    if (!q) return;
    if (state.mode === 'instant' && state.revealed[q.number]) return;

    state.answers[q.number] = label;
    state.hintOpen = false;

    if (state.mode === 'instant') {
      state.revealed[q.number] = true;
    }
    render();
    persistResume();
  }

  function toggleHint() {
    state.hintOpen = !state.hintOpen;
    render();
  }

  function goNext() {
    const q = currentQuestion();
    if (!q) return;

    if (state.mode === 'instant' && !state.revealed[q.number]) return;
    if (state.mode === 'submit' && !state.answers[q.number]) return;

    if (state.index >= totalCount() - 1) {
      state.phase = 'results';
      state.hintOpen = false;
      clearResume();
      if (state.runKind === 'full') saveProgress(computeScore());
      const pendingNext = ensureNextQuiz();
      render();
      focusQuizCard();
      pendingNext.then(() => patchNextQuizSlot());
      return;
    }

    state.index += 1;
    state.hintOpen = false;
    render();
    focusQuizCard();
    persistResume();
  }

  function goPrev() {
    if (state.index <= 0) return;
    state.index -= 1;
    state.hintOpen = false;
    render();
    focusQuizCard();
    persistResume();
  }

  const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
  const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  const ICON_INFO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

  function renderStart() {
    const d = state.data;
    const fullCount = bankCount();
    const playCount = state.length === 'sprint' && canSprint() ? sprintSize() : fullCount;
    const saved = getSavedProgress(d, el.root);
    const attempts = saved ? saved.attempts || 1 : 0;
    const progressChip = saved
      ? `<span class="quiz-meta-chip quiz-meta-chip--score">Best ${saved.bestPct}% · ${saved.bestCorrect}/${saved.total}</span>
         <span class="quiz-meta-chip">${ordinal(attempts)} run on this device</span>`
      : `<span class="quiz-meta-chip">Not attempted yet</span>`;
    const resume = getResumeBlob();
    const imageSrc = topicImageSrc();
    const hero = imageSrc
      ? `<div class="quiz-hero">
           <img src="${escapeHtml(imageSrc)}" alt="" width="1280" height="720" decoding="async" onerror="this.closest('.quiz-hero') && this.closest('.quiz-hero').remove()">
         </div>`
      : '';
    return `
      <div class="quiz-card quiz-card--start" role="region" aria-label="Quiz introduction">
        ${hero}
        <div class="quiz-kicker">Living Truth Quiz</div>
        <h1 class="quiz-title">${escapeHtml(d.title)}</h1>
        <p class="quiz-intro">${escapeHtml(d.subtitle || 'Test your understanding of this transmission.')}</p>
        <div class="quiz-meta-row">
          <span class="quiz-meta-chip">${playCount} questions</span>
          <span class="quiz-meta-chip">${escapeHtml(d.topicTitle || 'Topic quiz')}</span>
          ${progressChip}
        </div>
        ${
          canSprint()
            ? `<p class="quiz-mode-label">Length</p>
        <div class="quiz-mode-toggle" role="group" aria-label="Quiz length">
          <button type="button" class="quiz-mode-btn ${state.length === 'full' ? 'is-active' : ''}" data-action="length" data-length="full" aria-pressed="${state.length === 'full'}">
            <span class="quiz-mode-btn__label">Full set</span>
            <span class="quiz-mode-btn__desc">All ${fullCount} questions — the complete Living Truth check.</span>
          </button>
          <button type="button" class="quiz-mode-btn ${state.length === 'sprint' ? 'is-active' : ''}" data-action="length" data-length="sprint" aria-pressed="${state.length === 'sprint'}">
            <span class="quiz-mode-btn__label">Quick recall</span>
            <span class="quiz-mode-btn__desc">${sprintSize()} random questions — finish in one sitting.</span>
          </button>
        </div>`
            : ''
        }
        <p class="quiz-mode-label">Practice mode</p>
        <div class="quiz-mode-toggle" role="group" aria-label="Feedback mode">
          <button type="button" class="quiz-mode-btn ${state.mode === 'instant' ? 'is-active' : ''}" data-action="mode" data-mode="instant" aria-pressed="${state.mode === 'instant'}">
            <span class="quiz-mode-btn__label">Instant feedback</span>
            <span class="quiz-mode-btn__desc">See the correct answer and rationale after each question.</span>
          </button>
          <button type="button" class="quiz-mode-btn ${state.mode === 'submit' ? 'is-active' : ''}" data-action="mode" data-mode="submit" aria-pressed="${state.mode === 'submit'}">
            <span class="quiz-mode-btn__label">Submit at the end</span>
            <span class="quiz-mode-btn__desc">Answer all questions first, then review your full score and explanations.</span>
          </button>
        </div>
        ${
          resume
            ? `<p class="quiz-resume-note">Unfinished run — question ${resume.index + 1} of ${resume.numbers.length}.</p>`
            : ''
        }
        <div class="quiz-actions" role="group" aria-label="Quiz start actions">
          ${
            resume
              ? `<button type="button" class="btn-primary" data-action="resume"><span>Resume</span></button>
          <button type="button" class="btn-secondary" data-action="start"><span>Start over</span></button>`
              : `<button type="button" class="btn-primary" data-action="start"><span>Begin quiz</span></button>`
          }
          ${d.relatedTopic?.href ? `<a href="${escapeHtml(d.relatedTopic.href)}" class="btn-secondary"><span>Study the topic first</span></a>` : ''}
        </div>
      </div>
    `;
  }

  function questionOutcome(question) {
    const selected = state.answers[question.number];
    if (!selected) return 'skip';
    if (selected === question.correctAnswer) return 'ok';
    return 'miss';
  }

  function renderProgress() {
    const total = totalCount();
    const current = state.index + 1;
    const pct = Math.round((current / total) * 100);
    const score = state.mode === 'instant' ? computeScore() : null;
    const running =
      score && score.answered
        ? `<span class="quiz-progress-score">${score.correct}/${score.answered} so far</span>`
        : '';
    return `
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-header">
          <span>Question <strong>${current}</strong> of <strong>${total}</strong></span>
          <span class="quiz-progress-right">
            ${running}
            <span class="quiz-progress-pct">${pct}%</span>
          </span>
        </div>
        <div class="quiz-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Quiz progress">
          <div class="quiz-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function renderOptions(question) {
    const selected = state.answers[question.number];
    const revealed = state.mode === 'instant' && state.revealed[question.number];

    return `
      <div class="quiz-options" role="listbox" aria-label="Answer choices">
        ${(question.options || []).map((opt) => {
          let classes = 'quiz-option';
          let statusIcon = '';
          if (selected === opt.label) classes += ' is-selected';

          if (revealed) {
            if (opt.isCorrect || opt.label === question.correctAnswer) {
              classes += ' is-correct';
              statusIcon = `<span class="quiz-option__status">${ICON_CHECK}</span>`;
            } else if (selected === opt.label) {
              classes += ' is-incorrect';
              statusIcon = `<span class="quiz-option__status">${ICON_X}</span>`;
            } else {
              classes += ' is-dimmed';
            }
          }

          return `
            <button type="button"
              class="${classes}"
              role="option"
              aria-selected="${selected === opt.label}"
              data-action="select"
              data-label="${escapeHtml(opt.label)}"
              ${revealed ? 'disabled' : ''}>
              <span class="quiz-option__label">${escapeHtml(opt.label)}</span>
              <span class="quiz-option__text">${escapeHtml(opt.text)}</span>
              ${statusIcon}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderFeedback(question) {
    if (state.mode !== 'instant' || !state.revealed[question.number]) return '';
    const selected = state.answers[question.number];
    const isCorrect = selected === question.correctAnswer;
    const chosen = optionByLabel(question, selected);
    const right = correctOption(question);
    const rationale = isCorrect
      ? (chosen?.rationale || right?.rationale || '')
      : (right?.rationale || chosen?.rationale || '');
    const variant = isCorrect ? 'correct' : 'incorrect';
    const title = isCorrect ? 'Correct' : 'Not quite';
    const icon = isCorrect ? ICON_CHECK : ICON_INFO;

    const answerBlock = !isCorrect && right
      ? `
        <div class="quiz-feedback__answer">
          <span class="quiz-feedback__answer-label">Correct answer</span>
          <p class="quiz-feedback__answer-value"><strong>${escapeHtml(question.correctAnswer)}.</strong> ${escapeHtml(right.text || '')}</p>
        </div>
      `
      : '';

    const whyBlock = rationale
      ? `
        ${isCorrect ? '' : '<p class="quiz-feedback__why-label">Why</p>'}
        <p class="quiz-feedback__body">${escapeHtml(rationale)}</p>
      `
      : '';

    return `
      <div class="quiz-feedback quiz-feedback--${variant}" role="status">
        <div class="quiz-feedback__header">
          <span class="quiz-feedback__icon">${icon}</span>
          <p class="quiz-feedback__title">${title}</p>
        </div>
        ${answerBlock}
        ${whyBlock}
      </div>
    `;
  }

  function renderPlaying() {
    const q = currentQuestion();
    if (!q) return `<div class="quiz-error">No questions available.</div>`;

    const selected = state.answers[q.number];
    const revealed = state.mode === 'instant' && state.revealed[q.number];
    const canAdvance = state.mode === 'instant' ? revealed : !!selected;
    const isLast = state.index >= totalCount() - 1;
    const nextLabel = isLast
      ? (state.mode === 'submit' ? 'Submit & see results' : 'See results')
      : 'Next question';

    const playNum = state.index + 1;
    return `
      <div class="quiz-card quiz-card--play" role="region" aria-label="Quiz question ${playNum}">
        ${renderProgress()}
        <div class="quiz-question-num">Question ${playNum}</div>
        <h2 class="quiz-question-text">${escapeHtml(q.question)}</h2>
        ${renderOptions(q)}
        ${renderFeedback(q)}
        ${state.hintOpen && q.hint ? `
          <div class="quiz-hint" role="note">
            <strong>Hint —</strong> ${escapeHtml(q.hint)}
          </div>
        ` : ''}
        <div class="quiz-actions quiz-actions--end quiz-actions--play">
          <div class="quiz-nav-left">
            <button type="button" class="btn-secondary" data-action="prev" ${state.index === 0 ? 'disabled' : ''}><span>Previous</span></button>
            ${q.hint && !revealed ? `
              <button type="button" class="text-link" data-action="hint" aria-expanded="${state.hintOpen}">
                ${state.hintOpen ? 'Hide hint' : 'Show hint'}
              </button>
            ` : ''}
          </div>
          <button type="button" class="btn-primary" data-action="next" ${canAdvance ? '' : 'disabled'}>
            <span>${nextLabel}</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderReviewItem(q, i) {
    const selected = state.answers[q.number];
    const right = correctOption(q);
    const chosen = optionByLabel(q, selected);
    const outcome = questionOutcome(q);
    const badgeClass =
      outcome === 'ok' ? 'quiz-badge--ok' : outcome === 'miss' ? 'quiz-badge--miss' : 'quiz-badge--skip';
    const badgeText = outcome === 'ok' ? 'Correct' : outcome === 'miss' ? 'Incorrect' : 'Skipped';
    const rationale = right?.rationale || chosen?.rationale || '';
    return `
      <article class="quiz-review-item">
        <p class="quiz-review-item__q">${i + 1}. ${escapeHtml(q.question)}</p>
        <div class="quiz-review-item__meta">
          <span class="quiz-badge ${badgeClass}">${badgeText}</span>
        </div>
        <p class="quiz-review-item__answer">
          Your answer: <span>${selected ? `${escapeHtml(selected)} — ${escapeHtml(chosen?.text || '')}` : '—'}</span>
        </p>
        <p class="quiz-review-item__answer">
          Correct answer: <span>${escapeHtml(q.correctAnswer)}${right?.text ? ` — ${escapeHtml(right.text)}` : ''}</span>
        </p>
        ${rationale ? `<p class="quiz-review-item__rationale">${escapeHtml(rationale)}</p>` : ''}
      </article>
    `;
  }

  function renderReview() {
    const questions = getQuestions();
    const missed = questions.filter((q) => questionOutcome(q) !== 'ok');
    const showAll = state.reviewAll;
    const list = showAll ? questions : missed;
    const title = showAll
      ? 'Full answer review'
      : missed.length
        ? `Missed & skipped (${missed.length})`
        : 'Answer review';
    const toggleLabel = showAll ? 'Show missed only' : 'Show all answers';
    const empty =
      !showAll && !missed.length
        ? `<p class="quiz-review__empty">You didn't miss any. Open the full review if you want every rationale.</p>`
        : '';

    return `
      <div class="quiz-review">
        <div class="quiz-review__head">
          <h3 class="quiz-review__title">${title}</h3>
          <button type="button" class="text-link" data-action="review-all">${toggleLabel}</button>
        </div>
        ${empty}
        ${list.map((q) => renderReviewItem(q, questions.indexOf(q))).join('')}
      </div>
    `;
  }

  function renderResults() {
    const d = state.data;
    const { correct, total, pct } = computeScore();
    const band = scoreBand(pct);
    const reflection = d.reflection || {};
    const saved = getSavedProgress(d, el.root);
    const bestNote = saved && saved.bestPct > pct
      ? `<p class="quiz-score-best">Personal best on this device: <strong>${saved.bestPct}%</strong> (${saved.bestCorrect}/${saved.total})</p>`
      : saved && saved.bestPct === pct
        ? `<p class="quiz-score-best">New personal best on this device.</p>`
        : '';
    const ringClass = pct >= 90 ? 'quiz-score-ring quiz-score-ring--high' : 'quiz-score-ring';
    const missed = missedQuestions();
    const runNote =
      state.runKind === 'sprint'
        ? 'Quick recall'
        : state.runKind === 'missed'
          ? 'Missed-question retry'
          : 'Quiz complete';

    return `
      <div class="quiz-card" role="region" aria-label="Quiz results">
        <div class="quiz-kicker">${runNote}</div>
        <h2 class="quiz-title quiz-band-name">Your results</h2>
        <div class="quiz-results-score">
          <div class="${ringClass}" style="--score-pct:${pct}" aria-hidden="true">
            <div class="quiz-score-ring__inner">
              <span class="quiz-score-ring__value">${pct}%</span>
              <span class="quiz-score-ring__label">${escapeHtml(band.name)}</span>
            </div>
          </div>
          <p class="quiz-band-tag">${escapeHtml(band.name)}</p>
          <p class="quiz-score-summary">
            You scored <strong>${correct}</strong> out of <strong>${total}</strong>
          </p>
          <p class="quiz-score-message">${escapeHtml(band.message)}</p>
          ${bestNote}
        </div>
        ${reflection.title || reflection.body ? `
          <div class="quiz-reflection">
            <h3>${escapeHtml(reflection.title || 'Reflection')}</h3>
            <p>${escapeHtml(reflection.body || '')}</p>
          </div>
        ` : ''}
        <div class="quiz-actions" style="margin-top:1.65rem;">
          <button type="button" class="btn-primary" data-action="restart"><span>Retake quiz</span></button>
          ${
            missed.length
              ? `<button type="button" class="btn-secondary" data-action="retry-missed"><span>Retry ${missed.length} missed</span></button>`
              : ''
          }
          <button type="button" class="btn-secondary" data-action="share"><span>Share score</span></button>
          <a href="${escapeHtml(resolveQuizzesHubHref())}" class="btn-secondary"><span>Back to Quizzes</span></a>
          <a href="${escapeHtml(resolveTopicHref(d, el.root))}" class="btn-secondary"><span>Back to topic</span></a>
        </div>
        ${renderNextQuiz()}
        ${renderReview()}
      </div>
    `;
  }

  function quizzesIndexUrl() {
    const src = el.root?.getAttribute('data-quiz-src') || '';
    if (src.includes('/quizzes/')) {
      return src.replace(/quizzes\/[^/]+\/[^/]+\.json$/i, 'quizzes-index.json');
    }
    return '../../data/quizzes-index.json';
  }

  function nextQuizHref(href) {
    const path = String(href || '').replace(/^\//, '');
    return path ? `/${path}` : '';
  }

  function findNextQuiz(index) {
    const key = resolveQuizKey(state.data, el.root);
    const parts = String(key).split('/');
    const sourceId = parts[1] ? parts[0] : state.data?.sourceId || state.data?.source || '';
    const topicId = parts[1] || state.data?.topicId || state.data?.id || '';
    if (!sourceId || !topicId) return null;
    const list = (index?.quizzes || []).filter((q) => q && q.sourceId === sourceId && q.href);
    const i = list.findIndex((q) => q.id === topicId || q.key === key);
    if (i < 0 || i >= list.length - 1) return null;
    const next = list[i + 1];
    if (!next || next.id === topicId) return null;
    return next;
  }

  function ensureNextQuiz() {
    if (state.nextQuiz !== undefined) return Promise.resolve(state.nextQuiz);
    return fetch(quizzesIndexUrl())
      .then((res) => (res.ok ? res.json() : null))
      .then((index) => {
        state.nextQuiz = findNextQuiz(index) || null;
        return state.nextQuiz;
      })
      .catch(() => {
        state.nextQuiz = null;
        return null;
      });
  }

  function renderNextQuiz() {
    const next = state.nextQuiz;
    if (!next || !next.href || !next.title) {
      return '<div data-next-quiz-slot hidden></div>';
    }
    const href = nextQuizHref(next.href);
    if (!href) return '<div data-next-quiz-slot hidden></div>';
    return `
      <aside class="quiz-next" data-next-quiz-slot>
        <p class="quiz-next__label">Next in this path</p>
        <a class="quiz-next__link" href="${escapeHtml(href)}">
          <span class="quiz-next__title">${escapeHtml(next.title)}</span>
          <span class="quiz-next__cta">Take next quiz →</span>
        </a>
      </aside>
    `;
  }

  function patchNextQuizSlot() {
    if (state.phase !== 'results' || !el.root) return;
    const slot = el.root.querySelector('[data-next-quiz-slot]');
    if (!slot) return;
    slot.outerHTML = renderNextQuiz();
  }

  function setPlayingChrome(on) {
    document.body.classList.toggle('quiz-is-playing', Boolean(on));
  }

  function render() {
    if (!el.root || !state.data) return;
    setPlayingChrome(state.phase === 'playing');

    let body = '';
    if (state.phase === 'start') body = renderStart();
    else if (state.phase === 'playing') body = renderPlaying();
    else body = renderResults();

    // Prefer relatedTopic.href (has correct source). Never hardcode source=alice —
    // breakdown (and future) quizzes live under other sources and would 404 as "Topic not found".
    const topicHref = resolveTopicHref(state.data, el.root);
    const quizzesHref = resolveQuizzesHubHref();

    el.root.innerHTML = `
      <div class="quiz-shell">
        <div class="quiz-back-row">
          <a href="${escapeHtml(quizzesHref)}" class="text-link quiz-back-link">← Quizzes</a>
          <span class="quiz-back-row__more">
            <a href="${escapeHtml(topicHref)}" class="text-link">Topic</a>
            <span class="quiz-back-row__dot" aria-hidden="true">·</span>
            <a href="${escapeHtml(resolveCodexHref())}" class="text-link">Codex</a>
          </span>
        </div>
        ${body}
      </div>
    `;
  }

  /** Root-relative paths work from /quiz/{source}/*.html and root pages. */
  function resolveQuizzesHubHref() {
    const key = resolveQuizKey(state.data, el.root);
    const parts = String(key).split('/');
    const sourceId = parts[1] ? parts[0] : (state.data?.sourceId || state.data?.source || '');
    const topicId = parts[1] || state.data?.topicId || state.data?.id || parts[0] || '';
    const params = new URLSearchParams();
    params.set('browse', '1');
    if (sourceId) params.set('source', sourceId);
    if (topicId) params.set('focus', topicId);
    const hash = topicId ? `#quiz-${sourceId ? `${sourceId}-` : ''}${topicId}` : '';
    return `/quizzes.html?${params.toString()}${hash}`;
  }

  function resolveCodexHref() {
    return '/codex.html';
  }

  /**
   * Build deep-dive URL for the quiz's source + topic.
   * Order: relatedTopic.href → sourceId/source field → path segment of data-quiz-src → alice fallback.
   */
  function resolveTopicHref(data, rootEl) {
    const topicId = data?.topicId || data?.id || 'nature-of-reality';
    let sourceId = data?.sourceId || data?.source || '';

    if (!sourceId && rootEl?.getAttribute) {
      const quizSrc = rootEl.getAttribute('data-quiz-src') || '';
      // e.g. ../../data/quizzes/breakdown/perception-solidity.json
      const match = quizSrc.match(/\/quizzes\/([^/]+)\//i);
      if (match) sourceId = match[1];
    }

    // Prefer relatedTopic only for source/topic extraction; always emit static dive URLs
    if (data?.relatedTopic?.href && typeof TopicUtils !== 'undefined' && TopicUtils.parseDeepDiveLink) {
      const parsed = TopicUtils.parseDeepDiveLink(data.relatedTopic.href);
      if (parsed?.sourceId) sourceId = parsed.sourceId;
      if (parsed?.topicId) {
        return TopicUtils.diveUrl(parsed.sourceId || sourceId || 'alice', parsed.topicId);
      }
    }

    if (!sourceId) sourceId = 'alice';
    if (typeof TopicUtils !== 'undefined' && TopicUtils.diveUrl) {
      return TopicUtils.diveUrl(sourceId, topicId);
    }
    return `/dive/${encodeURIComponent(sourceId)}/${encodeURIComponent(topicId)}.html`;
  }

  function onClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target || !el.root.contains(target)) return;

    const action = target.getAttribute('data-action');
    if (action === 'start') startQuiz();
    else if (action === 'resume') resumeQuiz();
    else if (action === 'restart') restartQuiz();
    else if (action === 'mode') setMode(target.getAttribute('data-mode'));
    else if (action === 'length') setLength(target.getAttribute('data-length'));
    else if (action === 'retry-missed') beginRun('missed');
    else if (action === 'select') selectOption(target.getAttribute('data-label'));
    else if (action === 'next') goNext();
    else if (action === 'prev') goPrev();
    else if (action === 'hint') toggleHint();
    else if (action === 'review-all') {
      state.reviewAll = !state.reviewAll;
      render();
      const review = el.root?.querySelector('.quiz-review');
      if (review) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        review.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    } else if (action === 'share') {
      shareScore(target);
    }
  }

  function readInlineQuiz() {
    const node = document.getElementById('quiz-data');
    if (!node) return null;
    const raw = String(node.textContent || '').trim();
    if (!raw || raw === '{}' || raw.includes('__QUIZ_JSON__')) return null;
    try {
      const data = JSON.parse(raw);
      return data && Array.isArray(data.questions) && data.questions.length ? data : null;
    } catch (_) {
      return null;
    }
  }

  async function loadQuizData(src) {
    const inline = readInlineQuiz();
    if (inline) return inline;
    if (!src) throw new Error('Quiz source not configured');
    el.root.innerHTML = '<div class="quiz-loading">Loading quiz…</div>';
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Failed to load quiz (${res.status})`);
    const data = await res.json();
    if (!data.questions?.length) throw new Error('Quiz has no questions');
    return data;
  }

  async function init() {
    el.root = document.getElementById('quiz-root');
    if (!el.root) return;

    const src = el.root.getAttribute('data-quiz-src');
    el.root.addEventListener('click', onClick);

    try {
      const data = await loadQuizData(src);
      state.data = data;
      // Stable source for reshuffles; question and answer order randomize on Begin.
      state.originalQuestions = data.questions.slice();
      state.phase = 'start';
      render();
    } catch (err) {
      console.error(err);
      setPlayingChrome(false);
      el.root.innerHTML = `<div class="quiz-error">Unable to load this quiz. Please refresh or return to the topic page.</div>`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
