---
name: add-quiz
description: >
  Install a Living Truth quiz for an existing Alice, Mega Breakdown, or
  Revelations topic.
  Use when the user says "Add this quiz", "follow add-quiz", pastes a NotebookLM
  quiz JSON, or runs /add-quiz. Do not explore other quizzes.
---

# Add quiz

Do not grep the repo. Do not open other quizzes or other topic reports. Do not copy `scripts/install-*-quiz.js`.
Do not use Playwright, browser tools, or a local HTTP server.
`Verify passed` from the installer is the only check — this workflow is not browser-verified.

Allowed reads: this skill, `data/{source}-topics/{id}.json` (this topic only), the NotebookLM file.
Do not read `install.js`, pipeline, or option-utils files unless Verify fails.

Title must match the topic title in that JSON exactly.

The quiz page shuffles question order and A–D labels on Begin. Do not spend time on letter mix or install-time shuffle. The installer balances option length so the longest choice is not a tell; do not hand-pad or rewrite distractors to match length.

## Steps

1. Source is `breakdown`, `alice`, or `revelations`. `id` is the topic id.
2. Fidelity: every **correct** answer and rationale must be supported by this topic’s `report`. Fix or drop unsupported claims. Do not invent new claims. Prefer NotebookLM wording; rewrite only for fidelity, absolute voice, or T/F shape.
3. Write **data only** to `scripts/payloads/{id}.quiz.js` (see schema). `supportPhrases` is optional — the runner auto-grounds correct answers against this report.
4. `node scripts/install.js quiz {source} {id}`
   - If a matching `{id}.topic.js` was also written in this turn, run `node scripts/install.js all {source} {id}` instead.
5. If verify fails, fix the payload and rerun install. Do not rebuild the whole site.
6. Stop after `Verify passed`. Do not start a server, open the page, walk the UI, or launch `/review`.

When asked to review, commit, and push after this install: do not launch the review skill. Confirm Verify passed, stage only this quiz’s payload, data, dive/quiz HTML, hub, and sitemap files (neighbor dive rebuilds are expected), commit, and push if asked. Do not write long memory notes.

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

- Multiple choice: exactly 4 options, full wrong claims (not one-liners).
- True/False or yes/no: exactly 2 options, text `True` and `False` only. Put explanation in rationale. Stem starts with `True or False:`.
- Absolute voice. Never “according to the report/text/source.”
- Plain English. No LaTeX, MathJax, or `$...$`.
- Put the keyed correct answer in a single clause with no semicolon (the installer may keep only the first clause of a long correct option).
