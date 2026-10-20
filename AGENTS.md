# 21st Memory — agent rules

When adding or updating a **topic**: follow `.grok/skills/add-topic/SKILL.md`. After writing the payload, run `node scripts/install.js topic {source} {id}` (or `all` if the quiz payload is ready too).

When adding a **quiz**: follow `.grok/skills/add-quiz/SKILL.md`. Use only that topic’s own report JSON as the source of truth. After writing the payload, run `node scripts/install.js quiz {source} {id}` and run `npm run lint:quizzes`.
Quiz answer rules (full list in the skill): Grok writes balanced wrong answers itself. Options within ~25% length; correct never more than 1.5x the longest wrong; correct is longest only ~1 in 4 and sometimes shortest; same grammatical shape; wrong answers built from real report terms misattributed and checked false; no absolutes (only, always, never, entirely, solely, forever, completely, nothing but, no other) in wrong answers; no filler tails, joke options, or All/None of the above; don't echo the question; nothing cut off. Exactly 25 questions: ~20 multiple choice, 3–5 True/False, 1–2 "Which is NOT". Hints don't give the answer away; rationales are real. Sources: alice, breakdown, revelations, ascension.
The installer keeps answer text exactly, does a stable A–D shuffle, and lints the quiz before writing; if lint fails it exits non-zero and installs nothing. After install run `npm run lint:quizzes` and `node scripts/quiz-quality.js --warnings 200` and fix every flag for that quiz. Do NOT run `scripts/rebalance-quiz-length.js` on new quizzes (legacy maintenance tool for old Alice data). Never run `quiz-quality.js --baseline` or `--fix`.

Allowed reads for those tasks: the matching skill, `data/{source}-topics/{id}.json`, the user paste or NotebookLM file, and this topic’s images. Do not read installer/pipeline files unless Verify fails.

Forbidden: exploring “how other topics work,” reading sibling reports/HTML, or cloning old install scripts. Do not run a full-site dive rebuild for a single topic. If the topic id is not already in `data/{source}-topics.json`, stop and say so — do not scan the tree to find a parent. Do not use Playwright, a browser, or a local server for topic/quiz installs — `Verify passed` from `scripts/install.js` is the check.

When asked to review, commit, and push a topic/quiz install: do not launch `/review` or a reviewer subagent. Verify passed is the review. Stage only that install’s payload, data, images, dive/quiz HTML, hub, and sitemap files. Neighbor dive rebuilds are expected. Leave unrelated files unstaged. Commit `Add {Title} topic and Living Truth quiz.` (or topic-only / quiz-only). Push only if asked. Do not write long memory notes after the install.

Sources include `alice`, `breakdown`, `ascension`, and `revelations`.
