// Shared Navbar + Footer — interactivity (chrome is inlined at build time)

const CODEX_PAGES = new Set([
  'codex.html',
  'topics.html',
  'deep-dive.html'
]);
const QUIZ_PAGES = new Set(['quizzes.html']);
const NETWORK_PAGES = new Set(['network.html', 'community.html']);
const HOME_PAGES = new Set(['index.html']);
const INDEX_SECTION_LINKS = new Set([
  'index.html#about',
  'index.html#codex',
  'index.html#oracle',
  'index.html#media',
  'index.html#support'
]);

/** Home (and footer) hash targets that need measured scroll under the fixed nav */
const MEASURED_SCROLL_HASHES = new Set(['oracle', 'media', 'support', 'about', 'codex']);

function isCodexFamilyPage(pageBasename) {
  if (CODEX_PAGES.has(pageBasename)) return true;
  // Static dive pages live under /dive/{source}/{topic}.html
  const path = (window.location.pathname || '').replace(/\\/g, '/');
  return path.includes('/dive/');
}

function isQuizFamilyPage(pageBasename) {
  if (QUIZ_PAGES.has(pageBasename)) return true;
  // Nested quizzes live under /quiz/ (e.g. quiz/alice/...)
  const path = (window.location.pathname || '').replace(/\\/g, '/');
  return path.includes('/quiz/');
}

function initDeferredAnalytics() {
  if (window.__gtagLoaded) return;
  const load = () => {
    if (window.__gtagLoaded) return;
    window.__gtagLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-45Z17E0XTZ';
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-45Z17E0XTZ');
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load, { timeout: 4000 });
  } else {
    window.addEventListener('load', load, { once: true });
  }
}

/** Fade + peek for horizontal chip rows that overflow. */
const overflowFadeEntries = new Set();

function bindOverflowFade(scroller, wrap) {
  if (!scroller) return;
  const host = wrap || scroller;
  const entry = { scroller, host };
  const update = () => {
    if (!scroller.isConnected) {
      overflowFadeEntries.delete(entry);
      return;
    }
    const canScroll = scroller.scrollWidth > scroller.clientWidth + 8;
    const scrolled = scroller.scrollLeft > 8;
    const nearEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;
    host.classList.toggle('is-scrollable', canScroll);
    host.classList.toggle('has-scrolled', scrolled);
    host.classList.toggle('is-at-end', nearEnd || !canScroll);
  };
  overflowFadeEntries.add(entry);
  if (!scroller.dataset.overflowFadeBound) {
    scroller.dataset.overflowFadeBound = 'true';
    scroller.addEventListener('scroll', update, { passive: true });
  }
  if (!window.__overflowFadeResizeBound) {
    window.__overflowFadeResizeBound = true;
    window.addEventListener('resize', () => {
      overflowFadeEntries.forEach((item) => {
        if (!item.scroller.isConnected) {
          overflowFadeEntries.delete(item);
          return;
        }
        const canScroll = item.scroller.scrollWidth > item.scroller.clientWidth + 8;
        const scrolled = item.scroller.scrollLeft > 8;
        const nearEnd = item.scroller.scrollLeft + item.scroller.clientWidth >= item.scroller.scrollWidth - 8;
        item.host.classList.toggle('is-scrollable', canScroll);
        item.host.classList.toggle('has-scrolled', scrolled);
        item.host.classList.toggle('is-at-end', nearEnd || !canScroll);
      });
    }, { passive: true });
  }
  update();
  requestAnimationFrame(() => requestAnimationFrame(update));
}

if (typeof window !== 'undefined') {
  window.bindOverflowFade = bindOverflowFade;
}

const VAULT_SELECT_SELECTOR = 'select.codex-sort-select, select.quiz-hub-sort-select, select.video-lang-select';
const VAULT_CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

function escapeVaultText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function closeVaultSelects(except) {
  document.querySelectorAll('.vault-select.is-open').forEach((wrap) => {
    if (except && wrap === except) return;
    wrap.classList.remove('is-open');
    const trigger = wrap.querySelector('.vault-select__trigger');
    const menu = wrap.querySelector('.vault-select__menu');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (menu) menu.hidden = true;
  });
}

function paintVaultSelect(wrap) {
  const select = wrap.querySelector('select');
  const trigger = wrap.querySelector('.vault-select__trigger');
  const menu = wrap.querySelector('.vault-select__menu');
  if (!select || !trigger || !menu) return;

  const current = select.options[select.selectedIndex];
  const label = current ? current.textContent.trim() : '';
  trigger.innerHTML = `<span class="vault-select__value">${escapeVaultText(label)}</span><span class="vault-select__chevron">${VAULT_CHEVRON}</span>`;

  menu.innerHTML = Array.from(select.options).map((opt) => {
    const selected = opt.value === select.value;
    return `<li role="option" class="vault-select__option${selected ? ' is-selected' : ''}" data-value="${escapeVaultText(opt.value)}" aria-selected="${selected ? 'true' : 'false'}" tabindex="-1">${escapeVaultText(opt.textContent.trim())}</li>`;
  }).join('');
}

function setVaultSelectValue(wrap, value) {
  const select = wrap.querySelector('select');
  if (!select || select.value === value) {
    closeVaultSelects();
    wrap.querySelector('.vault-select__trigger')?.focus();
    return;
  }
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  paintVaultSelect(wrap);
  closeVaultSelects();
  wrap.querySelector('.vault-select__trigger')?.focus();
}

function openVaultSelect(wrap) {
  closeVaultSelects(wrap);
  paintVaultSelect(wrap);
  wrap.classList.add('is-open');
  const trigger = wrap.querySelector('.vault-select__trigger');
  const menu = wrap.querySelector('.vault-select__menu');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (menu) menu.hidden = false;
  const selected = menu?.querySelector('.is-selected') || menu?.querySelector('[role="option"]');
  selected?.focus();
}

function enhanceVaultSelect(select) {
  if (!select || select.closest('.vault-select')) return;

  const wrap = document.createElement('div');
  wrap.className = 'vault-select';
  if (select.classList.contains('video-lang-select')) wrap.classList.add('vault-select--lang');

  const parent = select.parentNode;
  if (parent && parent.tagName === 'LABEL') {
    parent.parentNode.insertBefore(wrap, parent.nextSibling);
  } else {
    parent.insertBefore(wrap, select);
  }
  wrap.appendChild(select);
  if (select.id) {
    document.querySelectorAll(`label[for="${select.id}"]`).forEach((label) => {
      label.removeAttribute('for');
    });
  }
  select.classList.add('vault-select__native');
  select.setAttribute('tabindex', '-1');
  select.setAttribute('aria-hidden', 'true');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'vault-select__trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', select.getAttribute('aria-label') || 'Choose an option');

  const menu = document.createElement('ul');
  menu.className = 'vault-select__menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;

  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  paintVaultSelect(wrap);

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if (wrap.classList.contains('is-open')) closeVaultSelects();
    else openVaultSelect(wrap);
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openVaultSelect(wrap);
    }
  });

  menu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-value]');
    if (!option) return;
    event.preventDefault();
    setVaultSelectValue(wrap, option.getAttribute('data-value'));
  });

  menu.addEventListener('keydown', (event) => {
    const options = Array.from(menu.querySelectorAll('[role="option"]'));
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeVaultSelects();
      trigger.focus();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      options[Math.min(options.length - 1, index + 1)]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      options[Math.max(0, index - 1)]?.focus();
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      options[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      options[options.length - 1]?.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const active = document.activeElement?.closest('[data-value]');
      if (active) setVaultSelectValue(wrap, active.getAttribute('data-value'));
    }
  });

  select.addEventListener('change', () => paintVaultSelect(wrap));
}

function initVaultSelects(root = document) {
  root.querySelectorAll(VAULT_SELECT_SELECTOR).forEach(enhanceVaultSelect);
}

if (typeof window !== 'undefined') {
  window.initVaultSelects = initVaultSelects;
}

function initSharedComponents() {
  setActiveNavLink();
  initSectionScrollSpy();
  initSkipToContent();
  initMobileMenu();
  initNavbarScrollState();
  initBackToTop();
  initFooterSupportCopy();
  initFooterSupportTabs();
  initMeasuredSectionScroll();
  initDeferredAnalytics();
  initVaultSelects();
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.vault-select')) closeVaultSelects();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeVaultSelects();
  });
  setTimeout(initScrollAnimations, 250);
}

/**
 * Scroll a section so its top sits cleanly just under the fixed navbar.
 * CSS scroll-margin + html scroll-padding stack and misalign (Oracle showed
 * Codex CTAs under the nav). Measure nav height instead.
 */
function getFixedNavOffset() {
  const nav = document.querySelector('.navbar');
  const h = nav ? nav.getBoundingClientRect().height : 80;
  return h + 12; // tight gap under nav — section eyebrow lands cleanly
}

function scrollToSectionId(id, { smooth = true } = {}) {
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.scrollY - getFixedNavOffset();
  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'smooth'
      : 'auto'
  });
  return true;
}

/** @deprecated use scrollToSectionId('support') */
function scrollToSupport(opts) {
  return scrollToSectionId('support', opts);
}

function hashIdFromHref(href) {
  if (!href) return '';
  const i = href.lastIndexOf('#');
  if (i < 0) return '';
  return href.slice(i + 1).split('?')[0].trim().toLowerCase();
}

function isSameDocumentHref(href) {
  if (!href || href.startsWith('#')) return true;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const here = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();
    const there = (url.pathname.replace(/\/$/, '') || '/').toLowerCase();
    // Treat / and /index.html as the same page
    const normalize = (p) => {
      if (p.endsWith('/index.html')) return p.slice(0, -10) || '/';
      if (p.endsWith('index.html')) return p.slice(0, -10) || '/';
      return p;
    };
    return normalize(there) === normalize(here);
  } catch (_) {
    return false;
  }
}

function initMeasuredSectionScroll() {
  const selector = Array.from(MEASURED_SCROLL_HASHES)
    .map((id) => `a[href="#${id}"], a[href$="#${id}"]`)
    .join(', ');

  document.querySelectorAll(selector).forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const id = hashIdFromHref(href);
      if (!MEASURED_SCROLL_HASHES.has(id)) return;
      if (!document.getElementById(id)) return;
      if (!isSameDocumentHref(href)) return;

      e.preventDefault();
      scrollToSectionId(id, { smooth: true });
      if (history.pushState) {
        history.pushState(null, '', `#${id}`);
      } else {
        window.location.hash = id;
      }
      setActiveNavLink(`index.html#${id}`);
    });
  });

  const alignIfMeasuredHash = () => {
    const id = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    if (!MEASURED_SCROLL_HASHES.has(id)) return;
    if (!document.getElementById(id)) return;
    requestAnimationFrame(() => {
      scrollToSectionId(id, { smooth: false });
      setTimeout(() => scrollToSectionId(id, { smooth: false }), 50);
    });
  };

  if (document.readyState === 'complete') {
    alignIfMeasuredHash();
  } else {
    window.addEventListener('load', alignIfMeasuredHash, { once: true });
  }
  window.addEventListener('hashchange', alignIfMeasuredHash);
  window.addEventListener('popstate', alignIfMeasuredHash);
}

/**
 * Skip link: real value is keyboard tab-order (bypass nav), not scroll distance.
 * Ensures #main can receive focus so the next Tab lands in content.
 */
function initSkipToContent() {
  const skip = document.querySelector('.skip-link');
  const main = document.getElementById('main');
  if (!skip || !main) return;

  if (!main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }

  skip.addEventListener('click', (e) => {
    // Focus main so keyboard users leave the chrome behind
    e.preventDefault();
    main.focus({ preventScroll: false });
    // Nudge slightly so fixed navbar never covers the focus target
    const top = main.getBoundingClientRect().top + window.scrollY - 8;
    if (Math.abs(window.scrollY - top) > 2) {
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    // Keep hash in URL for consistency
    if (history.replaceState) {
      history.replaceState(null, '', '#main');
    } else {
      window.location.hash = 'main';
    }
  });
}

/** Adds .is-scrolled to navbar after leaving the top — denser glass, stronger edge glow. */
function initNavbarScrollState() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const threshold = 12;
  let ticking = false;

  const update = () => {
    const scrolled = window.scrollY > threshold;
    navbar.classList.toggle('is-scrolled', scrolled);
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

function initFooterSupportCopy() {
  const copyBtn = document.querySelector('.footer-support-copy');
  if (!copyBtn) return;

  const targetId = copyBtn.getAttribute('data-copy-target');
  const target = targetId ? document.getElementById(targetId) : null;
  // Prefer inner label span so button sheen/stacking stays intact
  const labelEl = copyBtn.querySelector('span') || copyBtn;
  const originalLabel = (labelEl.textContent || '').trim() || 'Copy address';

  const setLabel = (value) => {
    labelEl.textContent = value;
  };

  copyBtn.addEventListener('click', async () => {
    // Prefer full address from data-copy-text (display may be truncated)
    const text = (
      copyBtn.getAttribute('data-copy-text') ||
      (target && (target.getAttribute('title') || target.textContent)) ||
      ''
    ).trim();
    if (!text) return;

    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_) { /* fall through to legacy copy */ }
    }

    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        copied = document.execCommand('copy');
      } catch (_) {
        copied = false;
      }
      document.body.removeChild(ta);
    }

    if (copied) {
      setLabel('Copied');
      copyBtn.classList.add('copied');
      copyBtn.setAttribute('aria-live', 'polite');
      setTimeout(() => {
        setLabel(originalLabel);
        copyBtn.classList.remove('copied');
      }, 2000);
    } else {
      setLabel('Copy failed');
      copyBtn.setAttribute('aria-live', 'assertive');
      setTimeout(() => {
        setLabel(originalLabel);
      }, 2500);
    }
  });
}

function initFooterSupportTabs() {
  const root = document.querySelector('[data-footer-tabs]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('[role="tab"][data-footer-tab]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  if (!tabs.length || !panels.length) return;

  const activate = (id, { focus = false } = {}) => {
    tabs.forEach((tab) => {
      const selected = tab.getAttribute('data-footer-tab') === id;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => {
      const match = panel.id === `footer-panel-${id}`;
      panel.classList.toggle('is-active', match);
      if (match) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activate(tab.getAttribute('data-footer-tab'));
    });
    tab.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(tab);
      if (i < 0) return;
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      activate(tabs[next].getAttribute('data-footer-tab'), { focus: true });
    });
  });
}

function initBackToTop() {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML =
      '<svg class="back-to-top__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
    document.body.appendChild(btn);
  }

  // Inline positioning so overflow / late CSS cannot pin the control off-screen.
  btn.style.setProperty('position', 'fixed', 'important');
  btn.style.setProperty('right', 'calc(1.1rem + env(safe-area-inset-right, 0px))', 'important');
  btn.style.setProperty('bottom', 'calc(1.1rem + env(safe-area-inset-bottom, 0px))', 'important');
  btn.style.setProperty('left', 'auto', 'important');
  btn.style.setProperty('top', 'auto', 'important');
  btn.style.setProperty('z-index', '2147483646', 'important');

  const SHOW_AFTER = 220;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollTicking = false;

  const scrollY = () =>
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  const sync = () => {
    const show = scrollY() > SHOW_AFTER;
    btn.classList.toggle('is-visible', show);
    btn.classList.toggle('visible', show);
    btn.setAttribute('aria-hidden', show ? 'false' : 'true');
    btn.style.setProperty('opacity', show ? '1' : '0', 'important');
    btn.style.setProperty('visibility', show ? 'visible' : 'hidden', 'important');
    btn.style.setProperty('pointer-events', show ? 'auto' : 'none', 'important');
    scrollTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(sync);
  }, { passive: true });
  document.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(sync);
  }, { passive: true, capture: true });

  btn.addEventListener('click', () => {
    const behavior = reduceMotion ? 'auto' : 'smooth';
    try {
      window.scrollTo({ top: 0, behavior });
    } catch (_e) {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  sync();
}

function getMobileMenuFocusables(mobileMenu) {
  return Array.from(
    mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function ensureMobileMenuOverlay() {
  let overlay = document.getElementById('mobile-menu-overlay');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'mobile-menu-overlay';
  overlay.className = 'mobile-menu-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
  return overlay;
}

function closeMobileMenu(mobileBtn, mobileMenu, overlay) {
  if (!mobileMenu.classList.contains('open') && !document.body.classList.contains('menu-open')) {
    return;
  }
  mobileMenu.classList.remove('open');
  mobileBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
  const svg = mobileBtn.querySelector('svg');
  if (svg) {
    svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
  }
  mobileBtn.classList.remove('active-glow');
}

function openMobileMenu(mobileBtn, mobileMenu, overlay) {
  mobileMenu.classList.add('open');
  mobileBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  if (overlay) {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }
  const svg = mobileBtn.querySelector('svg');
  if (svg) {
    svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
  }
  mobileBtn.classList.add('active-glow');

  // Move focus into the drawer for keyboard users
  const first = getMobileMenuFocusables(mobileMenu)[0];
  if (first) {
    requestAnimationFrame(() => first.focus());
  }
}

function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileBtn || !mobileMenu) return;

  const overlay = ensureMobileMenuOverlay();

  const syncMobileMenuState = () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu(mobileBtn, mobileMenu, overlay);
    }
  };

  window.addEventListener('resize', syncMobileMenuState);

  mobileBtn.addEventListener('click', () => {
    if (window.innerWidth >= 768) return;
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu(mobileBtn, mobileMenu, overlay);
    } else {
      openMobileMenu(mobileBtn, mobileMenu, overlay);
    }
  });

  overlay.addEventListener('click', () => {
    closeMobileMenu(mobileBtn, mobileMenu, overlay);
    mobileBtn.focus();
  });

  mobileMenu.querySelectorAll('.nav-link, .nav-cta-mobile').forEach((link) => {
    link.addEventListener('click', () => closeMobileMenu(mobileBtn, mobileMenu, overlay));
  });

  document.addEventListener('keydown', (e) => {
    if (!mobileMenu.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeMobileMenu(mobileBtn, mobileMenu, overlay);
      mobileBtn.focus();
      return;
    }

    // Focus trap inside the open menu
    if (e.key !== 'Tab') return;
    const focusables = getMobileMenuFocusables(mobileMenu);
    if (!focusables.length) return;

    // Include the hamburger so Shift+Tab from first link can reach it… but keep loop in menu for simplicity
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || active === mobileBtn) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
  initSharedComponents();
}

function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.content-card, .channel-card, .source-card, .lesson-content-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('section-card', 'visible');
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  cards.forEach(card => {
    if (!card.classList.contains('static-card')) {
      observer.observe(card);
    }
  });
}

function normalizePage(pathname) {
  const page = pathname.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

function isNavLinkActive(href, currentPath, currentHash) {
  if (!href || href.startsWith('http') || href.includes('://')) return false;

  const [linkPathRaw, linkHashPart] = href.split('#');
  // Normalize nested paths (e.g. ../../index.html from quiz/alice/)
  const linkPath = normalizePage(linkPathRaw || 'index.html');
  const linkHash = linkHashPart ? '#' + linkHashPart : '';

  if (linkPath === 'codex.html' && isCodexFamilyPage(currentPath)) {
    return true;
  }

  if (linkPath === 'quizzes.html' && isQuizFamilyPage(currentPath)) {
    return true;
  }

  if ((linkPath === 'network.html' || linkPath === 'community.html') && NETWORK_PAGES.has(currentPath)) {
    return true;
  }

  if (linkPath === 'index.html' && HOME_PAGES.has(currentPath)) {
    if (linkHash) return currentHash === linkHash;
    return !currentHash;
  }

  if (!linkHash && linkPath === currentPath) {
    return true;
  }

  return false;
}

function setActiveNavLink(activeHref) {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const currentPath = normalizePage(window.location.pathname);
  const currentHash = window.location.hash;

  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    const href = link.getAttribute('href') || '';

    if (activeHref) {
      if (href === activeHref) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
      return;
    }

    if (isNavLinkActive(href, currentPath, currentHash)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (!window._activeNavListenersAdded) {
    window._activeNavListenersAdded = true;
    window.addEventListener('hashchange', () => setActiveNavLink());
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        setTimeout(() => setActiveNavLink(), 100);
      }
    });
  }
}

function initSectionScrollSpy() {
  if (normalizePage(window.location.pathname) !== 'index.html') return;

  const sections = [
    { id: 'about', href: 'index.html#about' },
    { id: 'codex', href: 'index.html#codex' },
    { id: 'oracle', href: 'index.html#oracle' },
    { id: 'media', href: 'index.html#media' }
  ];

  const observed = sections
    .map(({ id, href }) => {
      const el = document.getElementById(id);
      return el ? { el, href } : null;
    })
    .filter(Boolean);

  if (!observed.length) return;

  let activeHref = window.location.hash
    ? `index.html${window.location.hash}`
    : null;

  const pickActiveSection = (entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;
    const match = observed.find(item => item.el === visible[0].target);
    if (match) activeHref = match.href;
    setActiveNavLink(activeHref);
  };

  const observer = new IntersectionObserver(pickActiveSection, {
    threshold: [0.15, 0.35, 0.55],
    rootMargin: '-20% 0px -55% 0px'
  });

  observed.forEach(item => observer.observe(item.el));

  window.addEventListener('hashchange', () => {
    const hashHref = window.location.hash ? `index.html${window.location.hash}` : null;
    if (hashHref && INDEX_SECTION_LINKS.has(hashHref)) {
      activeHref = hashHref;
      setActiveNavLink(activeHref);
    }
  });
}