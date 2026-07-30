/**
 * Phase 3: point HTML + build templates at local fonts + minified CSS.
 *
 * Replaces:
 *   Google Fonts preconnect + stylesheet
 *   assets/css/main.css → assets/css/main.min.css (preload + stylesheet)
 *
 * Adds:
 *   assets/css/fonts.css
 *
 * Run after download-fonts.js + minify-css.js
 *   node scripts/apply-perf-assets.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const GOOGLE_BLOCK_RE =
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/g;

const GOOGLE_STYLESHEET_RE =
  /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;500;600&family=Space\+Grotesk:wght@500;600&display=swap">\s*/g;

function transformHtml(html, assetPrefix) {
  // assetPrefix: '' | '../../' | '../' etc — path to site root assets
  const fontsHref = `${assetPrefix}assets/css/fonts.css`;
  const mainMin = `${assetPrefix}assets/css/main.min.css`;
  const mainFull = `${assetPrefix}assets/css/main.css`;

  let out = html;
  out = out.replace(GOOGLE_BLOCK_RE, '');
  out = out.replace(GOOGLE_STYLESHEET_RE, '');

  // If fonts.css not already present, inject before main stylesheet
  if (!out.includes('assets/css/fonts.css')) {
    out = out.replace(
      /(<link rel="stylesheet" href="[^"]*assets\/css\/(?:main(?:\.min)?\.css)">)/,
      `<link rel="stylesheet" href="${fontsHref}">\n    $1`
    );
  }

  // Prefer minified main.css
  out = out.replace(
    new RegExp(mainFull.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    mainMin
  );
  // Also bare relative without prefix already handled if prefix empty

  // Fix preload as=style for main
  out = out.replace(
    /href="([^"]*assets\/css\/)main\.css" as="style"/g,
    `href="$1main.min.css" as="style"`
  );

  return out;
}

function walkHtml(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'terminals') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, list);
    else if (entry.name.endsWith('.html')) list.push(full);
  }
  return list;
}

function assetPrefixFor(file) {
  const rel = path.relative(ROOT, path.dirname(file)).replace(/\\/g, '/');
  if (!rel || rel === '.') return '';
  const depth = rel.split('/').filter(Boolean).length;
  return '../'.repeat(depth);
}

function main() {
  if (!fs.existsSync(path.join(ROOT, 'assets/css/fonts.css'))) {
    console.error('Missing assets/css/fonts.css — run node scripts/download-fonts.js first');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(ROOT, 'assets/css/main.min.css'))) {
    console.error('Missing assets/css/main.min.css — run node scripts/minify-css.js first');
    process.exit(1);
  }

  const files = walkHtml(ROOT);
  let updated = 0;
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes('fonts.googleapis') && !before.includes('main.css') && before.includes('main.min.css') && before.includes('fonts.css')) {
      continue;
    }
    const prefix = assetPrefixFor(file);
    let after = transformHtml(before, prefix);
    // Also rewrite any remaining google font stylesheet alone
    after = after.replace(GOOGLE_STYLESHEET_RE, '');
    after = after.replace(/href="(\.\.\/)*assets\/css\/main\.css"/g, (m) =>
      m.replace('main.css', 'main.min.css')
    );
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      updated++;
    }
  }
  console.log(`Updated ${updated} HTML files`);

  // Patch dive builder template
  const diveBuild = path.join(ROOT, 'scripts/build-static-dives.js');
  if (fs.existsSync(diveBuild)) {
    let src = fs.readFileSync(diveBuild, 'utf8');
    const before = src;
    src = src.replace(
      /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*\n\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*\n/,
      ''
    );
    src = src.replace(
      /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;500;600&family=Space\+Grotesk:wght@500;600&display=swap">\s*\n/,
      `<link rel="stylesheet" href="\${ASSET_BASE}assets/css/fonts.css">\n`
    );
    src = src.replace(
      /\$\{ASSET_BASE\}assets\/css\/main\.css/g,
      '${ASSET_BASE}assets/css/main.min.css'
    );
    if (src !== before) {
      fs.writeFileSync(diveBuild, src, 'utf8');
      console.log('Patched scripts/build-static-dives.js');
    }
  }
}

main();
