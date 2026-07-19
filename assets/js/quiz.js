// Interactive quiz engine for 21st Memory (GitHub Pages–friendly)

(function () {
  'use strict';

  const state = {
    data: null,
    mode: 'instant', // 'instant' | 'submit'
    index: 0,
    answers: {}, // number -> selected label
    revealed: {}, // number -> true when feedback shown (instant mode)
    phase: 'start', // start | playing | results
    hintOpen: false
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

  function getQuestions() {
    return state.data?.questions || [];
  }

  function totalCount() {
    return getQuestions().length;
  }

  function currentQuestion() {
    return getQuestions()[state.index] || null;
  }

  function scoreMessage(pct) {
    const topic = state.data?.topicTitle || 'this transmission';
    if (pct >= 90) {
      return `Exceptional recall. The core truths of ${topic} are becoming clear.`;
    }
    if (pct >= 70) {
      return 'Strong grasp. A few overlays still remain — revisit the explanations below.';
    }
    if (pct >= 50) {
      return 'Solid beginning. Use the review section to uninstall remaining control strings.';
    }
    return 'Every miss is a map. Study the rationales, then return to the deep-dive and try again.';
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

  function startQuiz() {
    state.phase = 'playing';
    state.index = 0;
    state.answers = {};
    state.revealed = {};
    state.hintOpen = false;
    render();
    focusQuizCard();
  }

  function restartQuiz() {
    state.phase = 'start';
    state.index = 0;
    state.answers = {};
    state.revealed = {};
    state.hintOpen = false;
    render();
    focusQuizCard();
  }

  function focusQuizCard() {
    const card = el.root?.querySelector('.quiz-card');
    if (card) {
      card.setAttribute('tabindex', '-1');
      card.focus({ preventScroll: true });
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      saveProgress(computeScore());
      render();
      focusQuizCard();
      return;
    }

    state.index += 1;
    state.hintOpen = false;
    render();
    focusQuizCard();
  }

  function goPrev() {
    if (state.index <= 0) return;
    state.index -= 1;
    state.hintOpen = false;
    render();
    focusQuizCard();
  }

  const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
  const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  const ICON_INFO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

  function renderStart() {
    const d = state.data;
    const count = totalCount();
    const saved = getSavedProgress(d, el.root);
    const progressChip = saved
      ? `<span class="quiz-meta-chip quiz-meta-chip--score">Best ${saved.bestPct}% · ${saved.bestCorrect}/${saved.total}</span>
         <span class="quiz-meta-chip">${saved.attempts || 1} attempt${(saved.attempts || 1) === 1 ? '' : 's'}</span>`
      : `<span class="quiz-meta-chip">Not attempted yet</span>`;
    return `
      <div class="quiz-card" role="region" aria-label="Quiz introduction">
        <div class="quiz-kicker">Living Truth Quiz</div>
        <h1 class="quiz-title">${escapeHtml(d.title)}</h1>
        <p class="quiz-intro">${escapeHtml(d.subtitle || 'Test your understanding of this transmission.')}</p>
        <div class="quiz-meta-row">
          <span class="quiz-meta-chip">${count} questions</span>
          <span class="quiz-meta-chip">${escapeHtml(d.topicTitle || 'Topic quiz')}</span>
          ${progressChip}
        </div>
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
        <div class="quiz-actions" role="group" aria-label="Quiz start actions">
          <button type="button" class="btn-primary" data-action="start"><span>Begin quiz</span></button>
          ${d.relatedTopic?.href ? `<a href="${escapeHtml(d.relatedTopic.href)}" class="btn-secondary"><span>Study the topic first</span></a>` : ''}
        </div>
      </div>
    `;
  }

  function renderProgress() {
    const total = totalCount();
    const current = state.index + 1;
    const pct = Math.round((current / total) * 100);
    return `
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-header">
          <span>Question <strong>${current}</strong> of <strong>${total}</strong></span>
          <span class="quiz-progress-pct">${pct}%</span>
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

    return `
      <div class="quiz-card" role="region" aria-label="Quiz question ${state.index + 1}">
        ${renderProgress()}
        <div class="quiz-question-num">Question ${q.number}</div>
        <h2 class="quiz-question-text">${escapeHtml(q.question)}</h2>
        ${renderOptions(q)}
        ${renderFeedback(q)}
        ${state.hintOpen && q.hint ? `
          <div class="quiz-hint" role="note">
            <strong>Hint —</strong> ${escapeHtml(q.hint)}
          </div>
        ` : ''}
        <div class="quiz-actions quiz-actions--end">
          <div class="quiz-nav-left">
            <button type="button" class="btn-secondary" data-action="prev" ${state.index === 0 ? 'disabled' : ''}><span>Previous</span></button>
            ${q.hint && !revealed ? `
              <button type="button" class="quiz-btn-ghost" data-action="hint" aria-expanded="${state.hintOpen}">
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

  function renderReview() {
    const questions = getQuestions();
    return `
      <div class="quiz-review">
        <h3 class="quiz-review__title">Full answer review</h3>
        ${questions.map((q) => {
          const selected = state.answers[q.number];
          const right = correctOption(q);
          const chosen = optionByLabel(q, selected);
          let badgeClass = 'quiz-badge--skip';
          let badgeText = 'Skipped';
          if (selected) {
            if (selected === q.correctAnswer) {
              badgeClass = 'quiz-badge--ok';
              badgeText = 'Correct';
            } else {
              badgeClass = 'quiz-badge--miss';
              badgeText = 'Incorrect';
            }
          }
          const rationale = right?.rationale || chosen?.rationale || '';
          return `
            <article class="quiz-review-item">
              <p class="quiz-review-item__q">${q.number}. ${escapeHtml(q.question)}</p>
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
        }).join('')}
      </div>
    `;
  }

  function renderResults() {
    const d = state.data;
    const { correct, total, pct } = computeScore();
    const reflection = d.reflection || {};
    const saved = getSavedProgress(d, el.root);
    const bestNote = saved && saved.bestPct > pct
      ? `<p class="quiz-score-best">Personal best on this device: <strong>${saved.bestPct}%</strong> (${saved.bestCorrect}/${saved.total})</p>`
      : saved && saved.bestPct === pct
        ? `<p class="quiz-score-best">New personal best on this device.</p>`
        : '';

    return `
      <div class="quiz-card" role="region" aria-label="Quiz results">
        <div class="quiz-kicker">Quiz complete</div>
        <h2 class="quiz-title" style="font-size:clamp(1.5rem,3.5vw,2.1rem);">Your results</h2>
        <div class="quiz-results-score">
          <div class="quiz-score-ring" style="--score-pct:${pct}" aria-hidden="true">
            <div class="quiz-score-ring__inner">
              <span class="quiz-score-ring__value">${pct}%</span>
              <span class="quiz-score-ring__label">Score</span>
            </div>
          </div>
          <p class="quiz-score-summary">
            You scored <strong>${correct}</strong> out of <strong>${total}</strong>
          </p>
          <p class="quiz-score-message">${escapeHtml(scoreMessage(pct))}</p>
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
          <a href="${escapeHtml(resolveQuizzesHubHref())}" class="btn-secondary"><span>Back to Quizzes</span></a>
          <a href="${escapeHtml(resolveTopicHref(d, el.root))}" class="btn-secondary"><span>Back to topic</span></a>
        </div>
        ${renderReview()}
      </div>
    `;
  }

  function render() {
    if (!el.root || !state.data) return;

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
          <a href="${escapeHtml(quizzesHref)}" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← All quizzes</a>
          <a href="${escapeHtml(topicHref)}" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">Topic</a>
          <a href="${escapeHtml(resolveCodexHref())}" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">Codex</a>
        </div>
        ${body}
      </div>
    `;
  }

  /** Root-relative paths work from /quiz/alice/*.html and root pages. */
  function resolveQuizzesHubHref() {
    return '/quizzes.html';
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
    else if (action === 'restart') restartQuiz();
    else if (action === 'mode') setMode(target.getAttribute('data-mode'));
    else if (action === 'select') selectOption(target.getAttribute('data-label'));
    else if (action === 'next') goNext();
    else if (action === 'prev') goPrev();
    else if (action === 'hint') toggleHint();
  }

  async function init() {
    el.root = document.getElementById('quiz-root');
    if (!el.root) return;

    const src = el.root.getAttribute('data-quiz-src');
    if (!src) {
      el.root.innerHTML = '<div class="quiz-error">Quiz source not configured.</div>';
      return;
    }

    el.root.innerHTML = '<div class="quiz-loading">Loading quiz…</div>';
    el.root.addEventListener('click', onClick);

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to load quiz (${res.status})`);
      const data = await res.json();
      if (!data.questions?.length) throw new Error('Quiz has no questions');
      state.data = data;
      state.phase = 'start';
      render();
    } catch (err) {
      console.error(err);
      el.root.innerHTML = `<div class="quiz-error">Unable to load this quiz. Please refresh or return to the topic page.</div>`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
