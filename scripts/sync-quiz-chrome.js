/**
 * Sync navbar + footer on all quiz pages with path prefix ../../
 * Also ensures vault critical-paint CSS is present (prevents white FOUC).
 * Run after build:chrome, or as part of full build.
 */
const fs = require('fs');
const path = require('path');
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const BASE = '../../';

const navbarData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8')
);
const footerData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8')
);

const navbarHTML = renderNavbar(navbarData, { basePath: BASE });
const footerHTML = renderFooter(footerData, { basePath: BASE });

const NAV_REGEX = /<nav class="navbar">[\s\S]*?<\/nav>/;
const FOOTER_REGEX = /<footer class="site-footer">[\s\S]*?<\/footer>/;
const CRITICAL_PAINT = `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F;color-scheme:dark}body{padding-top:calc(5rem + env(safe-area-inset-top,0px))}</style>
`;

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    // quiz/_template.html is the seed for every new quiz install, so it gets
    // the same chrome as the live quiz pages. Other _files stay untouched.
    if (name.startsWith('_') && name !== '_template.html') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function stripFooterUtilities(html) {
  return html.replace(
    /<div class="footer-inner[^"]*">/g,
    '<div class="footer-inner">'
  );
}

/** Keep first paint vault-colored even before main.min.css arrives. */
function ensureCriticalPaint(html) {
  // The old guard looked for 'html,body{background-color:#0F0A1F}' but the
  // block actually reads '…#0F0A1F;color-scheme:dark}', so every build added
  // another copy. Match the real block and collapse any duplicates.
  const block = CRITICAL_PAINT;
  if (html.includes(block)) {
    const first = html.indexOf(block) + block.length;
    return html.slice(0, first) + html.slice(first).split(block).join('');
  }
  if (html.includes('<!-- Critical paint:')) return html;

  const markers = [
    '    <link rel="preload" href="../../assets/css/main.min.css?v=18" as="style">',
    '    <link rel="stylesheet" href="../../assets/css/main.min.css?v=18">',
    '    <link rel="stylesheet" href="../../assets/css/quiz.css">',
  ];
  for (const marker of markers) {
    if (html.includes(marker)) {
      return html.replace(marker, CRITICAL_PAINT + marker);
    }
  }
  return html;
}

function ensureThemeColor(html) {
  if (/name=["']theme-color["']/.test(html)) return html;
  return html.replace(
    /(<meta name=["']viewport["'][^>]*>)/i,
    '$1\n    <meta name="theme-color" content="#0F0A1F">'
  );
}

const APPLE_TOUCH_ICON =
  '<link rel="apple-touch-icon" href="https://21stmemory.com/images/apple-touch-icon.png?v=20260811b">';

/** iOS "Add to Home Screen" from a quiz should get the site icon, like every other page. */
function ensureAppleTouchIcon(html) {
  if (/rel=["']apple-touch-icon["']/.test(html)) return html;
  return html.replace(
    /(\n([ \t]*)<link rel="icon" href="https:\/\/21stmemory\.com\/images\/favicon-48\.png[^>]*>)/,
    (m, line, indent) => `${line}\n${indent}${APPLE_TOUCH_ICON}`
  );
}

const SEO_BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/seo.json'), 'utf8')).brand || {};
const TWITTER_SITE = SEO_BRAND.twitterSite || '@The21stMemory';

function cardVersion(abs) {
  return require('crypto').createHash('sha1').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
}

/**
 * Point og:image / twitter:image at the topic's 1200x630 share card
 * (scripts/generate-share-cards.py) when one exists, and add size/alt/site tags.
 * Quizzes with no card keep their current image.
 */
function ensureShareCard(html, file) {
  const rel = path.relative(path.join(ROOT, 'quiz'), file).replace(/\\/g, '/');
  const m = rel.match(/^([^/]+)\/([^/]+)\.html$/);
  const titleMatch = html.match(/<meta property="og:title" content="([^"]*)">/);
  const alt = titleMatch ? titleMatch[1] : '21st Memory';
  if (m) {
    const cardRel = `images/og/${m[1]}/${m[2]}.jpg`;
    const abs = path.join(ROOT, cardRel);
    if (fs.existsSync(abs)) {
      const url = `https://21stmemory.com/${cardRel}?v=${cardVersion(abs)}`;
      html = html
        .replace(/(<meta property="og:image" content=")[^"]*(">)/, `$1${url}$2`)
        .replace(/(<meta name="twitter:image" content=")[^"]*(">)/, `$1${url}$2`);
      if (!/property="og:image:width"/.test(html)) {
        html = html.replace(
          /(\n([ \t]*)<meta property="og:image" content="[^"]*">)/,
          (all, line, indent) =>
            `${line}\n${indent}<meta property="og:image:type" content="image/jpeg">` +
            `\n${indent}<meta property="og:image:width" content="1200">` +
            `\n${indent}<meta property="og:image:height" content="630">`
        );
      }
    }
  }
  if (!/property="og:image:alt"/.test(html)) {
    html = html.replace(
      /(\n([ \t]*)<meta name="twitter:card" content="[^"]*">)/,
      (all, line, indent) => `\n${indent}<meta property="og:image:alt" content="${alt}">${line}`
    );
  }
  if (!/name="twitter:site"/.test(html)) {
    html = html.replace(
      /(\n([ \t]*)<meta name="twitter:card" content="[^"]*">)/,
      (all, line, indent) => `${line}\n${indent}<meta name="twitter:site" content="${TWITTER_SITE}">`
    );
  }
  // Publisher logo: the current 21 mark used everywhere else (not the old neon 21).
  html = html.replace(
    /"logo": "https:\/\/21stmemory\.com\/images\/21\.webp"/,
    '"logo": "https://21stmemory.com/images/21st-mark.webp"'
  );
  return html;
}

function ensurePageInterior(html) {
  if (/<body[^>]*\bpage-interior\b/.test(html)) return html;
  return html.replace(
    /<body class="cosmic-bg"/,
    '<body class="cosmic-bg page-interior"'
  );
}

const quizFiles = walk(path.join(ROOT, 'quiz'));
let updated = 0;
let skipped = 0;

for (const file of quizFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let changed = false;

  if (NAV_REGEX.test(html)) {
    html = html.replace(NAV_REGEX, navbarHTML);
    changed = true;
  }
  if (FOOTER_REGEX.test(html)) {
    html = html.replace(FOOTER_REGEX, footerHTML);
    changed = true;
  }

  html = stripFooterUtilities(html);
  html = ensureCriticalPaint(html);
  html = ensureThemeColor(html);
  html = ensurePageInterior(html);
  html = ensureAppleTouchIcon(html);
  html = ensureShareCard(html, file);
  if (html !== before) changed = true;

  if (!changed) {
    skipped++;
    console.warn('Skip (no chrome):', path.relative(ROOT, file));
    continue;
  }

  fs.writeFileSync(file, html, 'utf8');
  updated++;
}

console.log(`sync-quiz-chrome complete — ${updated} updated, ${skipped} skipped`);
