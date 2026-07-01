/**
 * Inlines shared navbar + footer from JSON into every root .html file.
 *
 * WORKFLOW (do not hand-edit <nav> or <footer> in HTML files):
 *   1. Edit assets/data/navbar.json and/or assets/data/footer.json
 *   2. Run: npm run build:chrome   (or full npm run build before deploy)
 *   3. Commit the updated HTML files
 *
 * Placeholders (preferred): <!-- SITE-NAV --> and <!-- SITE-FOOTER -->
 * Fallback: replaces existing <nav class="navbar"> and <footer class="site-footer"> blocks.
 */
const fs = require('fs');
const path = require('path');
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const NAV_MARKER = '<!-- SITE-NAV -->';
const FOOTER_MARKER = '<!-- SITE-FOOTER -->';
const NAV_REGEX = /<nav class="navbar">[\s\S]*?<\/nav>/;
const FOOTER_REGEX = /<footer class="site-footer">[\s\S]*?<\/footer>/;

const navbarData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8')
);
const footerData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8')
);

const navbarHTML = renderNavbar(navbarData);
const footerHTML = renderFooter(footerData);

function inlineChrome(html) {
  let navUpdated = false;
  let footerUpdated = false;

  if (html.includes(NAV_MARKER)) {
    html = html.replace(NAV_MARKER, navbarHTML);
    navUpdated = true;
  } else if (NAV_REGEX.test(html)) {
    html = html.replace(NAV_REGEX, navbarHTML);
    navUpdated = true;
  }

  if (html.includes(FOOTER_MARKER)) {
    html = html.replace(FOOTER_MARKER, footerHTML);
    footerUpdated = true;
  } else if (FOOTER_REGEX.test(html)) {
    html = html.replace(FOOTER_REGEX, footerHTML);
    footerUpdated = true;
  }

  if (!navUpdated || !footerUpdated) {
    return null;
  }

  return html;
}

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

for (const file of htmlFiles) {
  const filePath = path.join(ROOT, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const result = inlineChrome(html);

  if (!result) {
    console.warn(`Skip ${file}: nav/footer block not found`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`Chrome inlined → ${file}`);
  updated++;
}

console.log(`build:chrome complete — ${updated} updated, ${skipped} skipped`);
if (skipped > 0) {
  process.exitCode = 1;
}