/**
 * Phase 1 — collapse winning dive-page visuals into one source-of-truth
 * block at the end of main.css, and neutralize later override layers.
 *
 * Visual target: today's computed look (no redesign).
 * Run: node scripts/apply-phase1-dive-sot.js
 */
const fs = require('fs');
const path = require('path');

const CSS_PATH = path.join(__dirname, '..', 'assets', 'css', 'main.css');

const SOT = `
/* =============================================
   DIVE PAGE — SOURCE OF TRUTH (Phase 1)
   Winning look as of 2026-08-17. Edit dive visuals HERE.
   Do not re-declare these selectors later in this file.
   ============================================= */

/* Cover */
.deep-dive-hero {
  border: none !important;
  border-radius: 1.25rem !important;
  min-height: 20rem !important;
  background-color: #0F0A1F;
  box-shadow:
    0 24px 56px -18px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
}

@media (min-width: 768px) {
  .deep-dive-hero {
    min-height: 24rem !important;
  }
}

.deep-dive-hero-bg {
  transform: scale(1.04) !important;
  filter: saturate(1.12) brightness(1.04) contrast(1.05) !important;
  background-color: #0F0A1F;
}

.deep-dive-hero-scrim {
  background: linear-gradient(
    105deg,
    rgba(10, 6, 22, 0.94) 0%,
    rgba(12, 8, 28, 0.84) 40%,
    rgba(12, 8, 28, 0.72) 70%,
    rgba(12, 8, 28, 0.82) 100%
  ) !important;
}

.deep-dive-hero-content {
  max-width: 44rem;
  color: #F8FAFC;
  text-shadow: 0 1px 18px rgba(0, 0, 0, 0.45);
}

.deep-dive-hero h1,
.page-hero-title--dive {
  font-size: clamp(1.85rem, 5.2vw, 3.15rem) !important;
  font-weight: 600 !important;
  letter-spacing: -0.035em !important;
  line-height: 1.12 !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  background: none !important;
  text-wrap: balance;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.55);
}

.deep-dive-hero-content .text-mem-secondary,
.deep-dive-hero-content p {
  color: rgba(224, 212, 255, 0.92) !important;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.4);
}

.deep-dive-hero-meta {
  gap: 0.5rem 0.75rem !important;
}

.deep-dive-reading-time {
  color: rgba(196, 181, 253, 0.85) !important;
  font-weight: 500;
}

/* Jump pills */
.dive-jump-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #A78BFA;
  margin-bottom: 0.45rem;
}

.jump-to-pills.dive-section-seg,
.dive-section-seg {
  display: inline-flex !important;
  flex-wrap: wrap;
  gap: 0.35rem !important;
  padding: 0.3rem !important;
  border-radius: 9999px !important;
  background: rgba(8, 5, 18, 0.55) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
  border: none !important;
}

.btn-jump-pill {
  min-height: 2.35rem !important;
  padding: 0.4rem 0.95rem !important;
  border-radius: var(--radius-chip) !important;
  border: none !important;
  background: transparent !important;
  color: #C4B5FD !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  box-shadow: none !important;
}

.btn-jump-pill:hover,
.btn-jump-pill:focus-visible {
  color: #fff !important;
  background: rgba(91, 33, 182, 0.35) !important;
}

.btn-jump-pill.is-active,
.btn-jump-pill.active,
.btn-jump-pill[aria-current="true"],
.jump-to-pills .btn-jump-pill.is-active,
.jump-to-pills .btn-jump-pill.active,
.section-nav-sticky .btn-jump-pill.is-active,
.section-nav-sticky .btn-jump-pill.active {
  color: #fff !important;
  background: linear-gradient(180deg, #5B21B6 0%, #4C1D95 50%, #2E1065 100%) !important;
  box-shadow: var(--surface-tier-btn) !important;
}

@media (max-width: 767px) {
  .btn-jump-pill {
    min-height: 44px !important;
  }
}

/* Section heads */
.dive-section-head {
  scroll-margin-top: 5.5rem;
}

.dive-section-head__label {
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #C4B5FD;
}

#infographics-section,
#videos-section,
#report-section {
  scroll-margin-top: 5.5rem;
}

/* Plates */
.infographic-artifact,
.slide-deck-artifact {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--surface-fill-elevated) !important;
  box-shadow: var(--surface-tier-elevated) !important;
  border: none !important;
  cursor: zoom-in;
}

.slide-deck-artifact {
  cursor: pointer;
}

.infographic-artifact img,
.slide-deck-artifact img,
#infographic-container img,
.infographic-modal-image {
  display: block;
  opacity: 1 !important;
  filter: none !important;
  image-rendering: auto;
}

.infographic-artifact-caption,
.slide-deck-artifact-caption {
  color: #EDE4FF;
}

.infographic-artifact-zoom,
.slide-deck-artifact-action {
  color: #C4B5FD;
}

.dive-media-card {
  border: none !important;
  background: var(--surface-fill-elevated) !important;
  box-shadow: var(--surface-tier-elevated) !important;
}

/* Recordings */
.dive-video-card {
  background: var(--surface-fill-elevated) !important;
  border: none !important;
  box-shadow: var(--surface-tier-elevated) !important;
}

.dive-video-card:hover {
  box-shadow: var(--surface-tier-elevated-hover) !important;
  transform: none !important;
}

.dive-video-card__frame,
.deep-dive-hero,
.deep-dive-hero-bg {
  background-color: #0F0A1F;
}

/* Folio card */
#report-section .content-card:not(.dive-continue),
#report-section .dive-report-card {
  background: var(--surface-fill-floating) !important;
  border: none !important;
  box-shadow: var(--surface-tier-floating) !important;
}

#report-section .content-card:not(.dive-continue):hover,
#report-section .dive-report-card:hover {
  box-shadow: var(--surface-tier-floating) !important;
  transform: none !important;
}

#report-section .content-card:not(.dive-continue)::after,
#report-section .dive-report-card::after {
  opacity: 0.55;
}

#report-container,
.report-prerendered {
  color: #F1EBFF !important;
  max-width: min(100%, 42rem) !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  font-size: 1.125rem !important;
  line-height: 1.78 !important;
}

#report-container[data-report-size="sm"],
body[data-report-size="sm"] #report-container {
  font-size: 0.98rem !important;
  line-height: 1.7 !important;
}

#report-container[data-report-size="md"],
body[data-report-size="md"] #report-container {
  font-size: 1.125rem !important;
  line-height: 1.78 !important;
}

#report-container[data-report-size="lg"],
body[data-report-size="lg"] #report-container {
  font-size: 1.32rem !important;
  line-height: 1.88 !important;
}

@media (min-width: 768px) {
  #report-container,
  .report-prerendered {
    font-size: 1.175rem !important;
    line-height: 1.82 !important;
  }

  #report-container[data-report-size="sm"],
  body[data-report-size="sm"] #report-container {
    font-size: 1.05rem !important;
    line-height: 1.72 !important;
  }

  #report-container[data-report-size="md"],
  body[data-report-size="md"] #report-container {
    font-size: 1.175rem !important;
    line-height: 1.82 !important;
  }

  #report-container[data-report-size="lg"],
  body[data-report-size="lg"] #report-container {
    font-size: 1.4rem !important;
    line-height: 1.9 !important;
  }
}

#report-container h1,
.report-prerendered h1 {
  font-size: clamp(1.55rem, 2.6vw, 1.85rem) !important;
  font-weight: 600 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.2 !important;
  margin: 0 0 0.9rem !important;
  border-bottom-color: rgba(139, 61, 255, 0.55) !important;
  border-bottom-width: 2px !important;
  overflow-wrap: anywhere;
}

#report-container h2,
.report-prerendered h2 {
  font-size: clamp(1.18rem, 2vw, 1.32rem) !important;
  font-weight: 600 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.28 !important;
  margin: 1.65rem 0 0.55rem !important;
  border-left-width: 4px !important;
  overflow-wrap: anywhere;
}

#report-container h3,
.report-prerendered h3 {
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  letter-spacing: -0.015em !important;
  line-height: 1.35 !important;
  margin: 1.25rem 0 0.4rem !important;
  overflow-wrap: anywhere;
}

#report-container p,
.report-prerendered p {
  line-height: 1.74 !important;
  color: #EDE4FF !important;
}

#report-container strong {
  color: #fff;
  font-weight: 600;
}

#report-container .report-lead,
.report-prerendered > p:first-of-type {
  font-size: 1.08em;
  line-height: 1.75;
  color: var(--text-prose);
  margin-bottom: 1.35rem;
}

.term-card,
#report-container .term-card {
  background: var(--surface-fill-nested) !important;
  box-shadow: var(--surface-tier-base) !important;
  border: none !important;
  border-radius: var(--radius-card) !important;
}

#report-container .term-card__term,
.term-card__term {
  color: var(--text-soft) !important;
  font-weight: 600 !important;
  letter-spacing: -0.015em !important;
}

/* Progress */
.reading-progress {
  height: 3px !important;
  background: rgba(15, 10, 31, 0.4) !important;
}

.reading-progress-fill {
  background: linear-gradient(90deg, #5B21B6, #A78BFA) !important;
  box-shadow: 0 0 12px rgba(139, 61, 255, 0.45);
}

/* Colophon */
.dive-continue {
  border: none !important;
  box-shadow: var(--surface-tier-elevated) !important;
  background:
    linear-gradient(165deg, rgba(255, 255, 255, 0.05) 0%, transparent 45%),
    #1A1433 !important;
}

.deep-dive-quiz-cta__btn,
.deep-dive-quiz-cta .btn-primary,
.dive-continue__btn {
  min-height: 3.05rem !important;
  padding: 0.78rem 1.55rem !important;
  border-radius: 9999px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  background: linear-gradient(165deg, #5B21B6 0%, #4C1D95 40%, #2E1065 100%) !important;
  border: none !important;
  box-shadow:
    0 12px 26px -8px rgba(0, 0, 0, 0.62),
    0 6px 14px -4px rgba(59, 7, 100, 0.45),
    inset 0 2px 0 rgba(255, 255, 255, 0.34),
    inset 0 -4px 0 rgba(30, 17, 53, 0.7) !important;
}

.deep-dive-quiz-cta__btn:hover,
.deep-dive-quiz-cta .btn-primary:hover,
.dive-continue__btn:hover {
  background: linear-gradient(165deg, #6D28D9 0%, #5B21B6 40%, #3B0764 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 16px 32px -10px rgba(0, 0, 0, 0.68),
    0 8px 18px -5px rgba(91, 33, 182, 0.5),
    0 0 28px -8px rgba(139, 61, 255, 0.45),
    inset 0 2.5px 0 rgba(255, 255, 255, 0.4),
    inset 0 -4px 0 rgba(30, 17, 53, 0.65) !important;
}

@media (max-width: 767px) {
  .report-study-toolbar {
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
    background: #1A1433 !important;
  }
}
`;

function replaceBetween(css, startMarker, endMarker, replacement) {
  const start = css.indexOf(startMarker);
  if (start < 0) throw new Error(`Start marker not found:\n${startMarker.slice(0, 80)}`);
  const end = css.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`End marker not found after start:\n${endMarker.slice(0, 80)}`);
  return css.slice(0, start) + replacement + css.slice(end);
}

function replaceExact(css, oldStr, replacement) {
  const start = css.indexOf(oldStr);
  if (start < 0) throw new Error(`Exact block not found:\n${oldStr.slice(0, 80)}`);
  if (css.indexOf(oldStr, start + 1) !== -1) {
    throw new Error(`Exact block is not unique:\n${oldStr.slice(0, 80)}`);
  }
  return css.slice(0, start) + replacement + css.slice(start + oldStr.length);
}

let css = fs.readFileSync(CSS_PATH, 'utf8').replace(/\r\n/g, '\n');
if (css.includes('DIVE PAGE — SOURCE OF TRUTH (Phase 1)')) {
  console.log('SOT block already present — aborting to avoid a second copy.');
  process.exit(1);
}

css = replaceBetween(
  css,
  '/* --- Dive hero: less purple "film", more art + readable type --- */',
  '/* --- Oracle + Media twins: professional equal cards --- */',
  '/* Phase 1: dive hero / plates / report fill — see DIVE PAGE SOURCE OF TRUTH at end of file */\n\n'
);

css = replaceBetween(
  css,
  '/* =============================================\n   DEEP-DIVE CRAFT PASS — museum-grade reading\n   ============================================= */',
  '/* =============================================\n   FIX: full-bleed centered vault hero + oracle media\n   ============================================= */',
  '/* Phase 1: craft-pass dive overrides — see DIVE PAGE SOURCE OF TRUTH at end of file */\n\n'
);

css = replaceBetween(
  css,
  '/* =============================================\n   Long-read report — one paper, one type ladder\n   ============================================= */',
  '/* Practice-mode cards — selected by fill, never a colored halo */',
  '/* Phase 1: long-read report type — see DIVE PAGE SOURCE OF TRUTH at end of file */\n\n'
);

css = replaceBetween(
  css,
  '/* Dive titles — hub scale, solid white on photo heroes (not metallic wordmark) */',
  '/* Copy wraps; never clip */',
  '/* Phase 1: dive title scale — see DIVE PAGE SOURCE OF TRUTH at end of file */\n\n'
);

css = replaceExact(
  css,
  `.deep-dive-hero-scrim {
  background: linear-gradient(
    105deg,
    rgba(10, 6, 22, 0.94) 0%,
    rgba(12, 8, 28, 0.84) 40%,
    rgba(12, 8, 28, 0.72) 70%,
    rgba(12, 8, 28, 0.82) 100%
  ) !important;
}
`,
  '/* Phase 1: dive hero scrim — see DIVE PAGE SOURCE OF TRUTH at end of file */\n'
);

css = css.replace(
  '/* =============================================\n   DEEP DIVE REPORT — MAXIMUM READABILITY & PROFESSIONALISM (REFINED)\n   ============================================= */',
  '/* =============================================\n   DEEP DIVE REPORT — structure / print / fallbacks\n   Visual tokens: DIVE PAGE SOURCE OF TRUTH at end of file.\n   ============================================= */'
);

css = css.replace(
  '/* Deep-dive cinematic hero */',
  '/* Deep-dive cinematic hero (structure). Visual tokens: SOT at end of file. */'
);

if (!css.endsWith('\n')) css += '\n';
css += SOT;

fs.writeFileSync(CSS_PATH, css, 'utf8');
console.log('Phase 1 SOT applied. Lines now:', css.split(/\r?\n/).length);
console.log('SOT marker present:', css.includes('DIVE PAGE — SOURCE OF TRUTH (Phase 1)'));
console.log('Craft pass gone:', !css.includes('DEEP-DIVE CRAFT PASS'));
console.log('Long-read block gone:', !css.includes('Long-read report — one paper'));

