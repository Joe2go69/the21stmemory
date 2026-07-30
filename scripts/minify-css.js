/**
 * Minify assets/css/main.css → assets/css/main.min.css
 * Keeps main.css as the editable source.
 * Run: node scripts/minify-css.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'css', 'main.css');
const OUT = path.join(ROOT, 'assets', 'css', 'main.min.css');

function minifyCss(input) {
  let css = input;
  // Remove comments (not inside strings — good enough for this codebase)
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace
  css = css.replace(/\s+/g, ' ');
  // Tighten around symbols
  css = css.replace(/\s*([{}:;,>~\+])\s*/g, '$1');
  // Keep space after "and" / "or" in media queries already collapsed carefully:
  css = css.replace(/and\(/g, 'and (');
  css = css.replace(/or\(/g, 'or (');
  // Remove last semicolon before }
  css = css.replace(/;}/g, '}');
  // Trim
  return css.trim();
}

const raw = fs.readFileSync(SRC, 'utf8');
const min = minifyCss(raw);
fs.writeFileSync(OUT, min, 'utf8');
const before = raw.length;
const after = min.length;
console.log(
  `main.css ${Math.round(before / 1024)} KB → main.min.css ${Math.round(after / 1024)} KB (−${Math.round(
    ((before - after) / before) * 100
  )}%)`
);
