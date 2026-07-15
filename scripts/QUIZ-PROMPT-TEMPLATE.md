# Quiz prompt template (Alice / Breakdown)

Copy everything under **Prompt** into a new chat. Replace only the bracketed fields.

---

## Prompt

```
Create and publish a Living Truth quiz for the [ TOPIC TITLE ] topic under the [ Alice | Breakdown ] transmission.

## Topic
- Transmission: [ alice | breakdown ]
- Topic title: [ Exact title as shown on the site ]
- Topic id: [ kebab-case-id ]   (e.g. control-mechanisms, cosmology)
  If unsure, resolve from data/[alice|breakdown]-topics-index.json

## Source quiz (pick one)
A) Use this source file if it exists:
   "[ G:\My Drive\CH21\Website Files\New Downloads\YOUR-quiz.json ]"
B) No source file — author all 25 questions from the topic report only.

## Hard requirements
1. **Title** — Quiz title must match the topic title exactly (e.g. "Control Mechanisms", not "Control Quiz").
2. **25 questions** — Site standard is 25. If the source has fewer, expand to 25 using ONLY this topic’s report. If it has more, keep 25 best report-supported items.
3. **Report-only audit** — Every correct answer and every rationale must be paraphrased from:
   data/[alice|breakdown]-topics/[topicId].json
   Rewrite or drop any item the report does not support. Do not pull facts from other topics.
4. **Plain English only** — No LaTeX, MathJax, Markdown math, or $...$ wrappers.
   Write ordinals and terms as normal text: 3rd, 9th, 12th, 97%, UHF, EMF, G.A.A.
5. **Absolute truth voice** — Never hedge with meta phrases such as:
   - "according to the report / this topic / the text / the source"
   - "the report states / says / claims / describes"
   - "the text states / confirms"
   - "source material"
   - "Key Terminology defines…" / "Overview states…"
   - "Every correct answer maps back to this topic's report alone"
   Write questions, options, rationales, hints, and reflection as Living Truth stated as fact.
6. **Structure** — Match existing quizzes under data/quizzes/[alice|breakdown]/
   - id, topicId, sourceId, topicTitle, title, subtitle, totalQuestions: 25
   - reflection { title, body }, relatedTopic { href, label }
   - questions[] with number, question, options[{label,text,isCorrect,rationale}], hint, correctAnswer
   - Exactly one correct option per question; every option needs a real rationale.
7. **Option quality (anti-pattern ban)** — Do NOT author quizzes where every correct answer is A or the correct option is obviously the longest.
   - **Mix correct letters** — Across 25 questions, correctAnswer must be spread across A, B, C, and D (roughly balanced; never 25× A).
   - **Even option length** — Write all four options at similar depth and length. Wrong answers are full, plausible-sounding claims (still clearly wrong per the report), not one-line dismissals.
   - **No length tell** — A player must not be able to pick the correct option by choosing the longest or most detailed sentence.
   - **No position tell** — Do not draft correct-first then leave it as A. Author all four options, then place the correct one on a rotating letter (or shuffle).
   - **Install scripts** — In scripts/install-[topicId]-quiz.js, call `finalizeOptions` from `scripts/quiz-option-utils.js` when building each question so options are shuffled/relabeled and short distractors are expanded. Do not skip this step.
   - After writing JSON, quickly count correctAnswer letters (A/B/C/D). If one letter dominates (e.g. A ≥ 15/25), rebalance before publishing.
8. **Wire into the site**
   - Write data/quizzes/[source]/[topicId].json
   - Write quiz/[source]/[topicId].html (clone nature-of-reality or a peer quiz page; fix title, description, OG, topic image, data-quiz-src, deep-dive links)
   - Set topic.quiz on data/[source]-topics/[topicId].json and data/[source]-topics.json
   - Add sitemap entry in scripts/generate-sitemap.js
   - Run: node scripts/split-topics-data.js && node scripts/generate-sitemap.js
   - Prefer an install script: scripts/install-[topicId]-quiz.js with support-phrase audit against the report (like install-cosmology-quiz.js / install-control-mechanisms-quiz.js) **and** finalizeOptions from quiz-option-utils.js
9. **Images** — Use this topic’s topic_image from the index (e.g. images/alice/…).
10. **Verify before done**
   - 25/25 questions
   - No $ or LaTeX left in the quiz JSON
   - No report/topic/text/source hedges in questions, options, rationales, hints, or reflection
   - Correct answers mixed across A/B/C/D (not always A)
   - Wrong options are not systematically much shorter than correct options
   - topic.quiz CTA present
   - quiz HTML loads the correct JSON path
   - sitemap includes /quiz/[source]/[topicId].html

## Optional one-liners to paste after the blanks are filled
- Source file: [ path or "none — author from report" ]
- Special notes: [ e.g. expand 15→25, rename from "X Quiz", focus on section Y ]
```

---

## Minimal one-liner (if you already know the topic)

```
Write and publish a 25-question Alice/Breakdown quiz for topic "[ Topic Title ]" (id: [topic-id], transmission: [alice|breakdown]). Optional source: "[path or none]". Report-only audit against data/[alice|breakdown]-topics/[topic-id].json. Plain English (no LaTeX/$). Absolute truth voice (no "according to the report"). Mix correct answers across A/B/C/D (never all A). Write all four options at similar length/depth — no long-correct / short-wrong tell. Use install script with finalizeOptions from scripts/quiz-option-utils.js. Match existing quiz install pattern; wire JSON, HTML, topic.quiz, sitemap; run split-topics-data + generate-sitemap.
```

---

## Filled example

```
Create and publish a Living Truth quiz for the Cosmology topic under the Alice transmission.

## Topic
- Transmission: alice
- Topic title: Cosmology
- Topic id: cosmology

## Source quiz
B) No source file — author all 25 questions from the topic report only.

## Hard requirements
[keep the full Hard requirements block from above unchanged]
```

---

## Checklist (for you or Grok after the run)

- [ ] `data/quizzes/[source]/[topicId].json` exists, title matches topic, 25 items
- [ ] `quiz/[source]/[topicId].html` exists and points at that JSON
- [ ] `topic.quiz` on the topic file
- [ ] Sitemap entry
- [ ] No `$` / LaTeX
- [ ] No “according to the report / text / topic” hedges
- [ ] Correct answers spread across A/B/C/D (not ~25× A)
- [ ] Wrong options similar length/depth to correct (no longest-answer tell)
- [ ] Install script uses `finalizeOptions` from `scripts/quiz-option-utils.js`
- [ ] Deep-dive shows “Take the [Topic Title] Quiz”
