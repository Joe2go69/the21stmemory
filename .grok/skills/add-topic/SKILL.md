---
name: add-topic
description: >
  Add or fill a Mega Breakdown (breakdown), Alice (alice), or Revelations
  (revelations) topic from a paste.
  Use when the user says "Add this topic", "follow add-topic", pastes a Grok Build
  topic template, or runs /add-topic. Do not explore other topics.
---

# Add topic

Do not grep the repo. Do not open other topics. Do not copy `scripts/update-*.js`.
Do not use Playwright, browser tools, or a local HTTP server.
`Verify passed` from the installer is the only check — this workflow is not browser-verified.

Allowed reads: this skill, `data/{source}-topics/{id}.json`, the user paste, images under `images/{source}/`.
Do not read `install.js` or pipeline files unless Verify fails.

If `{id}` is missing from `data/{source}-topics.json`, stop. Do not invent a parent.

## Steps

1. Source is `breakdown`, `alice`, or `revelations`. `id` is kebab-case of the title (`Mind Weapons` → `mind-weapons`).
2. Write **data only** to `scripts/payloads/{id}.topic.js` (see schema). Keep the pasted report wording; only normalize required `##` headings and Key Terminology bullets.
3. `node scripts/install.js topic {source} {id}`
   - If a matching `{id}.quiz.js` payload is also ready in this turn, run `node scripts/install.js all {source} {id}` instead (one rebuild).
4. If verify fails, fix the payload and rerun install. Do not rebuild the whole site.
5. Stop after `Verify passed`. Do not start a server, open the page, walk the UI, or launch `/review`.

When asked to review, commit, and push after this install: do not launch the review skill. Confirm Verify passed, stage only this topic’s payload, data, images, dive, and sitemap files (neighbor dive rebuilds are expected), commit, and push if asked. Do not write long memory notes.

## Payload schema

`scripts/payloads/{id}.topic.js`:

```js
module.exports = {
  source: 'breakdown', // or 'alice' or 'revelations'
  id: 'topic-id',
  title: 'Exact Title',
  description: 'One-sentence card deck.',
  images: {
    topic: { source: 'Exact File.webp', target: 'topic-id.webp' },
    pdfPreview: { source: 'Pdf_Preview.webp', target: 'pdf-preview.webp' },
    infographic: { source: 'The_Infographic.webp', target: 'the-infographic.webp' }
  },
  slide_deck_pdf_url: 'https://drive.google.com/file/d/.../view?usp=sharing',
  rumble_videos: [
    { title: 'Video title', embed_url: 'https://rumble.com/embed/...', description: 'Title — one-line summary.' }
  ],
  report: `# Exact Title

## Overview
...

## Key Terminology
- **Term** — definition.

## Core Revelations
...

## Detailed Mechanics and Key Elements
### Subsection
...

## Broader Context and Interconnections
...

## Strategic Implications
...
`
};
```

Image `source` is the filename as dropped in `images/{source}/`. `target` is kebab-case `.webp`. On collision the runner appends `-2`. Never change another topic’s image fields (the runner refuses).

## Quality the runner still enforces

- Card compress q=80, max edge 1400; PDF q=82 full-res; infographic q=85 full-res
- Required report headings listed above; no `TODO`; `is_placeholder: false`
- Existing subtopics and `quiz` preserved
- At least one Rumble video; every video must have a Rumble poster (missing posters fail install — rerun once Rumble's thumbnail is ready)
- PDF URL required
