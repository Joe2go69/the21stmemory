# 21st Memory — agent rules

When adding or updating a **topic**: follow `.grok/skills/add-topic/SKILL.md`. After writing the payload, run `node scripts/install.js topic {source} {id}` (or `all` if the quiz payload is ready too).

When adding a **quiz**: follow `.grok/skills/add-quiz/SKILL.md`. Use only that topic’s own report JSON as the source of truth. After writing the payload, run `node scripts/install.js quiz {source} {id}`.

Allowed reads for those tasks: the matching skill, `data/{source}-topics/{id}.json`, the user paste or NotebookLM file, and this topic’s images. Do not read installer/pipeline files unless Verify fails.

Forbidden: exploring “how other topics work,” reading sibling reports/HTML, or cloning old install scripts. Do not run a full-site dive rebuild for a single topic. If the topic id is not already in `data/{source}-topics.json`, stop and say so — do not scan the tree to find a parent. Do not use Playwright, a browser, or a local server for topic/quiz installs — `Verify passed` from `scripts/install.js` is the check.

When asked to review, commit, and push a topic/quiz install: do not launch `/review` or a reviewer subagent. Verify passed is the review. Stage only that install’s payload, data, images, dive/quiz HTML, hub, and sitemap files. Neighbor dive rebuilds are expected. Leave unrelated files unstaged. Commit `Add {Title} topic and Living Truth quiz.` (or topic-only / quiz-only). Push only if asked. Do not write long memory notes after the install.

Sources include `alice`, `breakdown`, `ascension`, and `revelations`.
