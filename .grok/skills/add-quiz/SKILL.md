---
name: add-quiz
description: >
  Install a Living Truth quiz for an existing Alice, Mega Breakdown, Revelations, or
  Ascension topic. Use when the user says "Add this quiz", "follow add-quiz", pastes a
  NotebookLM quiz JSON, or runs /add-quiz. Do not explore other quizzes.
---

# Add quiz

Do not grep the repo. Do not open other quizzes or other topic reports. Do not copy `scripts/install-*-quiz.js`.
Do not use Playwright, browser tools, or a local HTTP server.

Allowed reads: this skill, `data/{source}-topics/{id}.json` (this topic only), the NotebookLM file.
Do not read `install.js`, pipeline, or option-utils files unless Verify or lint fails.

Title must match the topic title in that JSON exactly.

The quiz page shuffles question order and A–D labels on Begin, so do not worry about letter order.
IMPORTANT: The installer does NOT pad or balance wrong answers. YOU must write wrong answers that are as long, specific, and believable as the correct one. The site build rejects quizzes with giveaway answers.

## Steps

1. Source is `breakdown`, `alice`, `revelations`, or `ascension`. `id` is the topic id.
2. Read this topic's `report` fully. It is the only source of truth.
3. Fidelity: every correct answer and rationale must be supported by the report. Fix or drop unsupported claims. Never invent claims or add extra details the report doesn't state.
4. Treat NotebookLM questions as a draft. Keep good questions, but rewrite any wrong answers that break the Answer rules below.
5. Write data only to `scripts/payloads/{id}.quiz.js` (schema below).
6. Run `node scripts/install.js quiz {source} {id}`.
   - If a matching `{id}.topic.js` was also written in this turn, run `node scripts/install.js all {source} {id}` instead.
7. Run `npm run lint:quizzes` and `node scripts/quiz-quality.js --warnings 200`.
   - Lint must pass.
   - Fix any warning that mentions this quiz's id by editing the payload and reinstalling.
8. Run the self-check at the bottom of this skill. Fix anything that fails, then reinstall.
9. Stop after Verify passed and lint passed. Do not start a server, open the page, walk the UI, or launch /review.
10. Never run `quiz-quality.js --baseline` or `--fix`, and never edit `scripts/lib/quiz-quality*`. Those are maintenance tools, not install steps.
11. Quiz install must not restamp `added`. The homepage "Recently added" date stays the topic publish time already in the data.

When asked to review, commit, and push after this install: do not launch the review skill. Confirm Verify and lint passed, then stage only this quiz's payload, data, dive/quiz HTML, hub, and sitemap files (neighbor dive rebuilds are expected). Commit `Add {Title} Living Truth quiz.` and push only if asked. Do not write long memory notes.

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
        { text: 'Correct claim.', isCorrect: true, rationale: 'Why this is right, from the report.' },
        { text: 'Believable wrong claim.', isCorrect: false, rationale: 'Why this is wrong, from the report.' },
        { text: 'Believable wrong claim.', isCorrect: false, rationale: 'Why this is wrong, from the report.' },
        { text: 'Believable wrong claim.', isCorrect: false, rationale: 'Why this is wrong, from the report.' }
      ]
    }
  ]
};
```

Exactly 25 questions, numbered 1–25.

## Question mix (per quiz)

- About 20 multiple choice (4 options, exactly 1 correct).
- 3 to 5 True/False. Exactly 2 options with text `True` and `False` only. The stem starts with `True or False:`. Mix true and false statements; don't make them all True. A false statement must be clearly false per the report, not just reworded.
- 1 or 2 "Which of these is NOT…" questions are welcome. The one odd option is the correct answer, and the other three must all be true per the report.
- Cover the whole report (beginning, middle, end, key terms), not just the opening section.
- No duplicate or near-duplicate questions.

## Answer rules (most important)

- **Length:** all 4 options should be about the same length, each within roughly 25% of the others. The correct answer must never be more than 1.5x the longest wrong answer. Across the quiz, the correct answer should be the longest option only about 1 time in 4, and sometimes it should be the shortest.
- **Same shape:** all options use the same grammar and structure. If the correct answer is "A [thing] that [does X]", every wrong answer is also "A [thing] that [does Y]".
- **Believable wrong answers:** build them from real names, terms, places, and numbers in the same report, attached to the wrong thing (for example, the job of a different group, the wrong phase, or the wrong location). A reader who skimmed should find them tempting.
- **Wrong answers must really be wrong.** Check each one against the report. If the report supports it, even partly, replace it.
- **No absolute words in wrong answers:** don't use "only", "always", "never", "entirely", "solely", "forever", "completely", "nothing but", or "no other". They are giveaways. If the correct answer needs one because the report says so, keep it.
- **No filler endings.** Never pad an answer with stock clauses like "…and nothing more", "…with no deeper layer", "…without a larger system underneath", "…and that is the entire mechanism", or "…stopping the explanation there". Every word must say something.
- **No silly or joke options.** No obvious throwaways, and no "All of the above" or "None of the above".
- **The correct answer must not repeat the question's wording**, and must not be the only option that uses the question's key term.
- **Don't reuse the correct answer's exact numbers or phrases in a wrong answer** if it would make two options hard to tell apart unfairly.
- **Each option is one complete sentence or phrase** that ends properly and isn't cut off. Keep the correct answer to a single clause with no semicolon.
- **Never talk about the quiz, the report, or "this answer"** inside an option. Never write "according to the report/text/source". State everything as plain fact.
- Plain English. No LaTeX, MathJax, or `$...$`.

## Hints and rationales

- **Hint:** points to where in the topic to look (for example, "Think about what happens during Phase 2"). It must never give away or strongly suggest the correct option.
- **Correct rationale:** 1–2 sentences explaining why it's right, using the report's own facts.
- **Wrong rationale:** 1 sentence saying what the report actually says instead, e.g. "The report ties this to the Orion Greys, not the Reptilians." Never leave a placeholder.

## Self-check before you finish (go through every question)

1. Is the correct answer clearly supported by the report?
2. Is every wrong answer clearly false according to the report?
3. Could someone guess the answer without reading, by picking the longest, the most detailed, the only one without "only/never", or the one that echoes the question? If yes, rewrite the options.
4. Are all options similar in length and shape?
5. Is anything cut off, duplicated, or padded?
6. Does the hint avoid giving away the answer?
7. Does the quiz have 25 questions, including 3–5 True/False?
