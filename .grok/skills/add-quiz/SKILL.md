---
name: add-quiz
description: >
  Install a Living Truth quiz for an existing Alice, Mega Breakdown, Revelations,
  Ascension, or Special Requests topic. Use when the user says "Add this quiz", "follow add-quiz", pastes a
  NotebookLM quiz JSON, or runs /add-quiz. Do not explore other quizzes.
---

# Add quiz

Do not grep the repo. Do not open other quizzes or other topic reports. Do not copy `scripts/install-*-quiz.js`.
Do not use Playwright, browser tools, or a local HTTP server.

Allowed reads: this skill, `data/{source}-topics/{id}.json` (this topic only), the NotebookLM file.
Do not read `install.js`, pipeline, or option-utils files. If install lint fails, fix the questions it lists and rerun install.

Title must match the topic title in that JSON exactly.

The installer does a stable A–D shuffle (seeded by quiz id + question number; True/False stays True then False), and the quiz page shuffles again on Begin, so do not worry about letter order.
IMPORTANT: The installer does NOT pad, trim, or balance answers. It keeps your text exactly. Write wrong answers that are as specific and believable as the correct one, and about as long. Do not count characters and do not run a length script.
The installer lints the quiz before writing anything. If lint fails, it exits non-zero, lists every problem, and installs nothing. Fix the questions it lists and rerun. Do not re-read the payload.

## Steps

1. Source is `breakdown`, `alice`, `revelations`, `ascension`, or `special-requests`. `id` is the topic id.
2. Read this topic's `report` fully. It is the only source of truth.
3. Fidelity: every correct answer and rationale must be supported by the report. Fix or drop unsupported claims. Never invent claims or add extra details the report doesn't state.
4. Treat NotebookLM questions as a draft. Keep the stem and the correct answer when the report supports them. Rewrite a wrong answer when it is much shorter than the correct one, uses a banned absolute, is not actually false, or is a different grammatical shape. If the draft has fewer than 25 questions, or fewer than 3 True/False items, add or convert report-grounded items until the mix below is met. Do not rebuild every option to hit a character grid.
5. Write data only to `scripts/payloads/{id}.quiz.js` (schema below). Do not run a length checker or a rewrite pass before install. Do not re-read the payload after writing it.
6. Run `node scripts/install.js quiz {source} {id}`.
   - If a matching `{id}.topic.js` was also written in this turn, run `node scripts/install.js all {source} {id}` instead.
7. Run `npm run lint:quizzes`. A pass is one line. Then run `node scripts/quiz-quality.js --warnings 200 | Select-String -Pattern "{id}"`.
   - If that prints nothing, this quiz is clean.
   - If a line names this quiz, fix that question and reinstall. Do not open installer or pipeline files to re-derive the rules. Do not read warnings for other quizzes.
8. Stop after Verify passed and lint passed. Do not start a server, open the page, walk the UI, or launch /review. Do not re-read the payload.
9. Never run `quiz-quality.js --baseline` or `--fix`, and never edit `scripts/lib/quiz-quality*`. Those are maintenance tools, not install steps.
   - Do NOT run `scripts/rebalance-quiz-length.js` (or `rebalance-quiz-options.js`, `polish-severe-*.js`) on new quizzes. It is a legacy maintenance tool for old Alice data and rewrites answer text.
10. Quiz install must not restamp `added`. The homepage "Recently added" date stays the topic publish time already in the data.

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

- **Length:** Do not count characters. Write each wrong answer about as long as the correct one. The correct answer must not run much longer than the longest wrong one: the checker warns above 1.6× that wrong answer and fails above 2×. On most multiple-choice questions, do not make the correct answer the longest. Make it the longest on about a quarter of them, and the shortest on a few. A quiz warns if the correct answer is never the longest, or is the shortest on more than half. True/False options stay exactly `True` and `False` and are not part of that. If install or lint names a length problem, fix that question only.
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
- **Correct rationale:** 1–2 sentences explaining why it's right. Include one exact report phrase of 3 to 6 words, each word longer than 2 letters, with only spaces between them. Words such as of, a, to, and is break the run. Punctuation breaks it. Hyphens split words. The installer rejects a correct answer that does not contain that phrase in the option plus the rationale.
- **Wrong rationale:** 1 sentence saying what the report actually says instead, e.g. "The report ties this to the Orion Greys, not the Reptilians." Never leave a placeholder.

## While you write

Do this as you draft. Do not re-read the payload afterward.

1. The correct answer is supported by the report, and the rationale contains an exact report phrase.
2. Every wrong answer is false according to the report.
3. A skim could not pick the correct option because it is much longer, much more detailed, the only one without an absolute, or the one that echoes the question.
4. Options in a question share a shape, and none is cut off, duplicated, or padded.
5. The hint does not give away the answer.
6. There are 25 questions, including 3–5 True/False.
