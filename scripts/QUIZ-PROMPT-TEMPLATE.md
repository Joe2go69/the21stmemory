# Quiz prompt template (Alice / Breakdown)

Copy one of the blocks below into a new Grok chat. Replace only the bracketed fields.
Attach the NotebookLM export JSON when you have one.

---

## NotebookLM paste (use this)

```
Add this quiz (the JSON exported from NotebookLM via the third-party extension) to the [Topic Title] topic for the [alice | breakdown] transmission.

Goals
- Prefer the NotebookLM content. Rewrite only for fidelity, balance, voice, or site compatibility.
- Keep presentation quality identical to existing quizzes.

Hard rules
1. Title must match the topic title exactly (check data/[alice|breakdown]-topics/[topicId].json).
2. Report-only: every correct answer and rationale must be supported by that topic’s report. Fix or drop anything the report does not support. Do not invent claims.
3. Absolute truth voice. Never “according to the report / text / source.”
4. Plain English only — no LaTeX, MathJax, $...$, or markdown math. Ordinals (3rd/9th) and terms like UHF/EMF/97% stay normal text.
5. Question types (do not mix these up):
   - Multiple choice: exactly 4 options, similar length and depth. Full plausible wrong claims, not one-line distractors. No longest-answer tell.
   - True/False or yes/no: exactly 2 options, labeled True and False only. Never pad T/F into 4 answers. Never write “True — long gloss” / “False — long gloss” as extra choices. Put the explanation in the rationale.
6. Mix correct letters on multiple-choice items (A/B/C/D). T/F stays A=True, B=False.
7. Install like the other quizzes: scripts/install-[topicId]-quiz.js with finalizeOptions from scripts/quiz-option-utils.js (pass the question stem so T/F is detected). Wire JSON, HTML, topic.quiz, quizzes hub, sitemap.
8. After writing JSON:
   node scripts/rebalance-quiz-length.js data/quizzes/[alice|breakdown]/[topicId].json
   That script must skip True/False items. Then:
   node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
9. Verify the quiz loads, T/F items show only True/False, and the dive CTA says Take the [Topic Title] Quiz.
```

---

## Author-from-report (no NotebookLM file)

```
Create and publish a 25-question Living Truth quiz for [Topic Title] (id: [topic-id], transmission: [alice|breakdown]) from data/[alice|breakdown]-topics/[topic-id].json only.

Same hard rules as the NotebookLM paste: title match, report-only, absolute voice, plain English, 4-option multiple choice with even length, True/False stays 2 options (True/False only), install script + finalizeOptions, rebalance-quiz-length (skip T/F), split + hub + dives + sitemap, then verify.
```

---

## Checklist

- [ ] Title matches the topic
- [ ] 25 questions
- [ ] No `$` / LaTeX
- [ ] No “according to the report / text / source”
- [ ] Multiple choice = 4 even options; T/F / yes-no = True + False only
- [ ] Ran `rebalance-quiz-length.js` (T/F still 2 options afterward)
- [ ] `topic.quiz` CTA present
- [ ] Quiz HTML loads the correct JSON
- [ ] Sitemap includes `/quiz/[source]/[topicId].html`
