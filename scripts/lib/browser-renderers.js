/**
 * Load the site's own browser renderers (assets/js/topics-utils.js and
 * render-utils.js) in Node, so build steps can pre-render exactly the markup
 * the page scripts paint later. One source of truth for card HTML.
 *
 *   const { TopicUtils, RenderUtils } = require('./lib/browser-renderers');
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');

function loadRenderers() {
  const noop = () => {};
  const storage = { getItem: () => null, setItem: noop, removeItem: noop };
  const el = { getAttribute: () => null, setAttribute: noop, classList: { add: noop, remove: noop, contains: () => false } };
  const ctx = {
    console,
    URL,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    location: { search: '', hash: '', pathname: '/', origin: 'https://21stmemory.com', href: 'https://21stmemory.com/' },
    navigator: { userAgent: 'node' },
    localStorage: storage,
    sessionStorage: storage,
    history: { replaceState: noop, pushState: noop },
    addEventListener: noop,
    removeEventListener: noop,
    matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
    document: {
      readyState: 'complete',
      addEventListener: noop,
      removeEventListener: noop,
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      createElement: () => ({ ...el, style: {}, appendChild: noop }),
      documentElement: el,
      head: { appendChild: noop },
      body: { ...el, appendChild: noop }
    }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of ['icons.js', 'topics-utils.js', 'render-utils.js']) {
    const code = fs.readFileSync(path.join(ROOT, 'assets', 'js', file), 'utf8');
    vm.runInContext(
      `${code}\n;this.TopicUtils = typeof TopicUtils !== 'undefined' ? TopicUtils : this.TopicUtils;` +
        `this.RenderUtils = typeof RenderUtils !== 'undefined' ? RenderUtils : this.RenderUtils;`,
      ctx,
      { filename: file }
    );
  }
  if (!ctx.TopicUtils || !ctx.RenderUtils) throw new Error('browser-renderers: TopicUtils/RenderUtils not found');
  return { TopicUtils: ctx.TopicUtils, RenderUtils: ctx.RenderUtils };
}

module.exports = loadRenderers();
