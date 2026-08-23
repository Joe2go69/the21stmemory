# 21st Memory — agent rules

When adding or updating a **topic** (Mega Breakdown or Alice): follow `.grok/skills/add-topic/SKILL.md`. Do not grep the repo. Do not open other topics. Do not copy `scripts/update-*.js`. After writing the payload, run `node scripts/install.js topic {source} {id}` (or `all` if the quiz payload is ready too).

When adding a **quiz**: follow `.grok/skills/add-quiz/SKILL.md`. Do not open other quizzes. Use only that topic’s own report JSON as the source of truth. After writing the payload, run `node scripts/install.js quiz {source} {id}`.

Allowed reads for those tasks: the matching skill, `scripts/install.js`, `scripts/lib/*-pipeline.js`, `scripts/apply-topic.js` / `scripts/apply-quiz.js`, `data/{source}-topics/{id}.json`, the user paste or NotebookLM file, and this topic’s images.

Forbidden: exploring “how other topics work,” reading sibling reports/HTML, or cloning old install scripts. Do not run a full-site dive rebuild for a single topic. If the topic id is not already in `data/{source}-topics.json`, stop and say so — do not scan the tree to find a parent.

Commit message style for these: `Add {Title} topic and Living Truth quiz.` (or topic-only / quiz-only as appropriate).
