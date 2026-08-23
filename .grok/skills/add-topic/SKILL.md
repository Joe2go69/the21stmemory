---
name: add-topic
description: >
  Add or fill a Mega Breakdown (breakdown) or Alice (alice) topic from a paste.
  Use when the user says "Add this topic", "follow add-topic", pastes a Grok Build
  topic template, or runs /add-topic. Do not explore other topics.
---

# Add topic

Do not grep the repo. Do not open other topics. Do not copy `scripts/update-*.js`.

Allowed reads: this skill, `scripts/install.js`, `scripts/apply-topic.js`, `scripts/lib/topic-pipeline.js`, `data/{source}-topics/{id}.json`, the user paste, images under `images/{source}/`.

If `{id}` is missing from `data/{source}-topics.json`, stop. Do not invent a parent.

## Steps

1. Source is `breakdown` or `alice`. `id` is kebab-case of the title (`Mind Weapons` → `mind-weapons`).
2. Write **data only** to `scripts/payloads/{id}.topic.js` (see schema). Do not duplicate pipeline helpers.
3. `node scripts/install.js topic {source} {id}`
   - If a matching `{id}.quiz.js` payload is also ready in this turn, run `node scripts/install.js all {source} {id}` instead (one rebuild).
4. If verify fails, fix the payload and rerun install. Do not rebuild the whole site. Do not repo-wide grep.

The installer applies the payload, refreshes this topic's index/stats, rebuilds this dive page plus prev/next, patches only this sitemap URL, and prints a checklist. It does not restamp dates on other pages.

## Payload schema

`scripts/payloads/{id}.topic.js`:

```js
module.exports = {
  source: 'breakdown', // or 'alice'
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
- At least one Rumble video; PDF URL required
