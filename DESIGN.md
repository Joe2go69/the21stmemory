# 21st Memory — Design & maintenance notes

Short guide for keeping the living-archive look consistent after the elevation pass (Phases 1–4).

## Priority

1. **Visual quality** (calm vault atmosphere, consistent CTAs, mobile composure)  
2. **Performance** (min CSS, local fonts, lazy quiz catalog, compressed images)  
3. **Maintainability** (one button language, chrome from JSON, rebuild scripts)

## Design tokens (CSS)

Source of truth: `assets/css/main.css` (`:root`).

| Role | Token / usage |
|------|----------------|
| Vault background | `--deep-bg` / `#0F0A1F` |
| Card surface | `--card-bg` / `#1A1433` |
| Primary text | `--text-primary` |
| Muted / soft | `--text-muted`, `--text-soft`, `--text-dim` |
| Elevation | `--surface-tier-*` (base, elevated, floating, btn) |
| CTA primary | `.btn-primary` — violet 3D gradient, pill |
| CTA secondary | `.btn-secondary` — recessed dark, same geometry |
| Tertiary | `.text-link` |

**Do not** invent a third button outline style for marketing CTAs. Use primary / secondary / text-link only.

### Size modifiers
- Default: in-card actions  
- `.btn-primary--lg` / hero (also `.home-hero-actions__*`)  
- `.btn-primary--sm` / compact tools  

## Editing workflow

### Styles
1. Edit **`assets/css/main.css` only** (source).  
2. Run **`npm run minify:css`** so `assets/css/main.min.css` stays in sync.  
3. Pages load **`main.min.css`** — not the full source.

### Shared nav / footer
1. Edit `assets/data/navbar.json` and/or `assets/data/footer.json`.  
2. Run `npm run build:chrome` (and `npm run sync:quiz-chrome` / dive sync if needed).  
3. Or run full `npm run build`.

Do **not** hand-edit `<nav class="navbar">` / `<footer class="site-footer">` across dozens of HTML files.

### Quizzes hub
1. Quiz JSON lives under `data/quizzes/{source}/`.  
2. Run `npm run build:quizzes` → updates `data/quizzes-index.json` + overview inject in `quizzes.html`.  
3. Full catalog is **lazy-loaded** in the browser from the index JSON (keeps the hub HTML light).  
4. Featured list is curated in `scripts/build-quizzes-hub.js` (`FEATURED_KEYS`).

### Fonts
- Self-hosted in `assets/fonts/` + `assets/css/fonts.css`.  
- Refresh with `npm run build:fonts` then `npm run apply:perf` if HTML heads regress.

### Images
- Prefer WebP; keep display sizes honest.  
- Home banners use `srcset` (`*-640.webp`, `*-960.webp`).  
- Bulk recompress: `npm run optimize:images`.

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
