/**
 * Sync navbar + footer on all static dive pages with path prefix ../../
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

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const files = walk(path.join(ROOT, 'dive'));
let updated = 0;
let skipped = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (NAV_REGEX.test(html)) {
    html = html.replace(NAV_REGEX, navbarHTML);
    changed = true;
  }
  if (FOOTER_REGEX.test(html)) {
    html = html.replace(FOOTER_REGEX, footerHTML);
    changed = true;
  }

  if (!changed) {
    skipped++;
    continue;
  }

  fs.writeFileSync(file, html, 'utf8');
  updated++;
}

console.log(`sync-dive-chrome complete — ${updated} updated, ${skipped} skipped`);
