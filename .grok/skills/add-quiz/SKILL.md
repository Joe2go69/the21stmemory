---
name: add-quiz
description: >
  Install a Living Truth quiz for an existing Alice or Mega Breakdown topic.
  Use when the user says "Add this quiz", "follow add-quiz", pastes a NotebookLM
  quiz JSON, or runs /add-quiz. Do not explore other quizzes.
---

# Add quiz

Do not grep the repo. Do not open other quizzes or other topic reports. Do not copy `scripts/install-*-quiz.js`.

Allowed reads: this skill, `scripts/install.js`, `scripts/apply-quiz.js`, `scripts/lib/quiz-pipeline.js`, `scripts/quiz-option-utils.js`, `data/{source}-topics/{id}.json` (this topic only), the NotebookLM file.

Title must match the topic title in that JSON exactly.

## Steps

1. Source is `breakdown` or `alice`. `id` is the topic id.
2. Fidelity: every **correct** answer and rationale must be supported by this topic’s `report`. Fix or drop unsupported claims. Do not invent new claims. Prefer NotebookLM wording; rewrite only for fidelity, option length, absolute voice, or T/F shape.
3. Write **data only** to `scripts/payloads/{id}.quiz.js` (see schema). `supportPhrases` is optional — the runner auto-grounds correct answers against this report.
4. `node scripts/install.js quiz {source} {id}`
   - If a matching `{id}.topic.js` was also written in this turn, run `node scripts/install.js all {source} {id}` instead.
5. If verify fails, fix the payload and rerun install. Do not rebuild the whole site.

The installer applies the quiz, rebalances option length, rebuilds this dive page plus prev/next, updates the quizzes hub, patches only this sitemap URL, and checks MC/T/F shape plus the dive CTA.

## Payload schema

`scripts/payloads/{id}.quiz.js`:

```js
module.exports = {
  source: 'breakdown',
  id: 'topic-id',
  title: 'Exact Title',
  description: 'Test your understanding of Exact Title — …',
  seoDescription: 'Interactive Living Truth Quiz on Exact Title: …',
  reflection: { title: 'Reflection', body: '…' },
  questions: [
    {
      number: 1,
      question: '…',
      hint: '…',
      options: [
        { text: 'Correct claim.', isCorrect: true, rationale: 'Grounded in the report.' },
        { text: 'Full plausible wrong claim.', isCorrect: false, rationale: 'Why this is wrong.' },
        { text: 'Full plausible wrong claim.', isCorrect: false, rationale: 'Why this is wrong.' },
        { text: 'Full plausible wrong claim.', isCorrect: false, rationale: 'Why this is wrong.' }
      ]
    }
  ]
};
```

Exactly 25 questions.

## Question rules

- Multiple choice: exactly 4 options, similar length and depth (full wrong claims, not one-liners).
- True/False or yes/no: exactly 2 options, text `True` and `False` only. Put explanation in rationale. Stem starts with `True or False:`.
- Absolute voice. Never “according to the report/text/source.”
- Plain English. No LaTeX, MathJax, or `$...$`.
- T/F stays A=True, B=False after install. MC letters must mix.
