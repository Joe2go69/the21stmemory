# 21st Memory — Design & maintenance notes

Short guide for keeping the living-archive look consistent after the elevation pass (Phases 1–4).

## Priority

1. **Visual quality** (calm vault atmosphere, consistent CTAs, mobile composure)  
2. **Performance** (min CSS, local fonts, lazy quiz catalog, compressed images)  
3. **Maintainability** (one button language, chrome from JSON, rebuild scripts)

## Navigation (IA)

Primary bar (from `assets/data/navbar.json`): **Codex · Quizzes · Source · Network · Support · [Telegram]**  
- Logo = Home (no separate Home link)  
- Oracle / Media / About live on the homepage and in footer Explore — not top nav  
- Source is `source.html` (original CH21 / Rumble transmissions). Top nav + footer Explore. Homepage Media and the Network callout stay as contextual doors. Do not add extra Source buttons on Codex/Quizzes hubs.  
- Mega Breakdown series is `mega-breakdown.html` — a Source child (not top nav). Linked from Source, the Mega Breakdown path hero, and breakdown dive continue rows.  
- Support is `support.html` (dedicated hub). Old `#support` hashes redirect there.  
- After editing JSON: `npm run build:chrome` (+ quiz/dive chrome sync, or full `npm run build`)

## Design tokens (CSS)

Source of truth: `assets/css/main.css` (`:root`).

| Role | Token / usage |
|------|----------------|
| Vault background | `--deep-bg` / `#0F0A1F` |
| Card surface | `--card-bg` / `#1A1433` |
| Primary text | `--text-primary` |
| Bright / scrim | `--text-bright`, `--surface-scrim` |
| Muted / soft | `--text-muted`, `--text-soft`, `--text-dim` |
| Elevation | `--surface-tier-*` (base, elevated, floating, btn) |
| Card radius | `--radius-card` / `1rem` — all panels, banners, browse tiles |
| Button radius | `--radius-button` / pill — primary + secondary only |
| Chip radius | `--radius-chip` / `0.65rem` — filters, tabs, jump pills |
| Icon radius | `--radius-icon` / `14px` — social, back-to-top |
| CTA primary | `.btn-primary` — violet 3D gradient, pill |
| CTA secondary | `.btn-secondary` — recessed dark, same geometry |
| Tertiary | `.text-link` |

**Do not** invent a third button outline style for marketing CTAs. Use primary / secondary / text-link only.

**Do not** pile Tailwind size/radius on `.btn-primary` / `.btn-secondary` (`px-8 py-3`, `rounded-xl`). Size only with `.btn-primary--lg` / `--sm`.

**Do not** add a new radius, a third outline CTA, or another “FINAL unification” appendix at the bottom of `main.css`. Edit the existing source of truth:

- `:root` tokens
- Canonical buttons/cards (early `.btn-primary` / `.memory-card` blocks)
- Phase 1 radius lock
- Phase 3 interior/mobile composure
- Dive page visuals: `DIVE PAGE — SOURCE OF TRUTH` at the end of `main.css` (hero, plates, videos, report type). Do not re-declare those selectors later.

`.btn-topic-nav` is a leftover alias of `.btn-secondary`. Prefer `btn-secondary btn-secondary--sm` in new markup.

### Size modifiers
- Default: in-card actions  
- `.btn-primary--lg` / hero (also `.home-hero-actions__*`)  
- `.btn-primary--sm` / compact tools  

## Editing workflow

### Styles
1. Edit **`assets/css/main.css` only** (source).  
2. Run **`npm run minify:css`** so `assets/css/main.min.css` stays in sync.  
3. Pages load **`main.min.css`** — not the full source.  
4. Keep `main.css` UTF-8. Do **not** run `npm run prune:css` — it is marked unsafe.

### Shared nav / footer
1. Edit `assets/data/navbar.json` and/or `assets/data/footer.json`.  
2. Run `npm run build:chrome` (and `npm run sync:quiz-chrome` / dive sync if needed).  
3. Or run full `npm run build`.

Do **not** hand-edit `<nav class="navbar">` / `<footer class="site-footer">` across dozens of HTML files.

### Quizzes hub
1. Quiz JSON lives under `data/quizzes/{source}/`.  
2. Run `npm run build:quizzes` → updates `data/quizzes-index.json` + path-card inject in `quizzes.html`.  
3. Full catalog is **lazy-loaded** in the browser from the index JSON (keeps the hub HTML light).  
4. Overview is path-first (Alice / Breakdown cards); no curated “Start here” featured grid.

### Fonts
- Self-hosted in `assets/fonts/` + `assets/css/fonts.css` — **latin only** (English site).  
- Refresh with `npm run build:fonts` (script strips non-latin subsets) then `npm run apply:perf` if HTML heads regress.

### Images
- Prefer WebP; keep display sizes honest.  
- Home banners use `srcset` (`*-640.webp`, `*-960.webp`).  
- Bulk recompress: `npm run optimize:images`.  
- Do not commit intermediate brand files (`*.prev.webp`, `*.tmp`, `*-source.webp`, ref JPGs).

## Full production build

```bash
npm run build
```

This rebuilds data, quizzes hub, static dives, Tailwind, **minifies CSS**, inlines chrome, syncs quiz chrome, SEO, sitemap, and re-applies perf asset links (fonts + `main.min.css`).

## Verification

```bash
npm run verify:elevation   # elevation plan Phases 1–4
npm run verify             # legacy phase6 suite (updated for lazy quizzes)
```

## Accessibility baselines

- Skip link on content pages  
- Focus-visible rings on CTAs, path cards, filters, footer tabs  
- `prefers-reduced-motion`: no lift transforms on key controls  
- Quiz catalog sets `aria-busy` while loading; failures use `role="alert"`  
- Mobile network filters scroll horizontally (no clipped labels)

## Out of scope (unless requested)

SPA framework, backend, new brand palette, rewriting transmission content.
