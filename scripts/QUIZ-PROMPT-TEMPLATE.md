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
7. **Wire into the site**
   - Write data/quizzes/[source]/[topicId].json
   - Write quiz/[source]/[topicId].html (clone nature-of-reality or a peer quiz page; fix title, description, OG, topic image, data-quiz-src, deep-dive links)
   - Set topic.quiz on data/[source]-topics/[topicId].json and data/[source]-topics.json
   - Add sitemap entry in scripts/generate-sitemap.js
   - Run: node scripts/split-topics-data.js && node scripts/generate-sitemap.js
   - Prefer an install script: scripts/install-[topicId]-quiz.js with support-phrase audit against the report (like install-cosmology-quiz.js / install-control-mechanisms-quiz.js)
8. **Images** — Use this topic’s topic_image from the index (e.g. images/alice/…).
9. **Verify before done**
   - 25/25 questions
   - No $ or LaTeX left in the quiz JSON
   - No report/topic/text/source hedges in questions, options, rationales, hints, or reflection
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
Write and publish a 25-question Alice/Breakdown quiz for topic "[ Topic Title ]" (id: [topic-id], transmission: [alice|breakdown]). Optional source: "[path or none]". Report-only audit against data/[alice|breakdown]-topics/[topic-id].json. Plain English (no LaTeX/$). Absolute truth voice (no "according to the report"). Match existing quiz install pattern; wire JSON, HTML, topic.quiz, sitemap; run split-topics-data + generate-sitemap.
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
- [ ] Deep-dive shows “Take the [Topic Title] Quiz”
