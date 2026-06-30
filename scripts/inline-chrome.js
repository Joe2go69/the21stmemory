const fs = require('fs');
const path = require('path');
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const NAV_MARKER = '<!-- SITE-NAV -->';
const FOOTER_MARKER = '<!-- SITE-FOOTER -->';
const NAV_REGEX = /<nav class="navbar">[\s\S]*?<\/nav>/;
const FOOTER_REGEX = /<footer class="(?:site-footer|border-t border-(?:mem-subtle|\[#4C3D6B\]))[\s\S]*?<\/footer>/;

const navbarData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8')
);
const footerData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8')
);

const navbarHTML = renderNavbar(navbarData);
const footerHTML = renderFooter(footerData);

function inlineChrome(html) {
  if (html.includes(NAV_MARKER)) {
    html = html.replace(NAV_MARKER, navbarHTML);
  } else if (NAV_REGEX.test(html)) {
    html = html.replace(NAV_REGEX, navbarHTML);
  } else {
    return null;
  }

  if (html.includes(FOOTER_MARKER)) {
    html = html.replace(FOOTER_MARKER, footerHTML);
  } else if (FOOTER_REGEX.test(html)) {
    html = html.replace(FOOTER_REGEX, footerHTML);
  } else {
    return null;
  }

  return html;
}

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const filePath = path.join(ROOT, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const updated = inlineChrome(html);

  if (!updated) {
    console.warn(`Skipping ${file}: no nav/footer placeholder found`);
    continue;
  }

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Inlined chrome → ${file}`);
}