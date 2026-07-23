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
  'index.html#explore'
]);

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

function initSharedComponents() {
  setActiveNavLink();
  initSectionScrollSpy();
  initSkipToContent();
  initMobileMenu();
  initNavbarScrollState();
  initBackToTop();
  initFooterSupportCopy();
  initSupportAnchorScroll();
  initDeferredAnalytics();
  setTimeout(initScrollAnimations, 250);
}

/**
 * Scroll #support so its top sits cleanly just under the fixed navbar.
 * CSS scroll-margin alone fights html scroll-padding; measure nav height instead.
 */
function getFixedNavOffset() {
  const nav = document.querySelector('.navbar');
  const h = nav ? nav.getBoundingClientRect().height : 80;
  return h + 16; // small gap under nav
}

function scrollToSupport({ smooth = true } = {}) {
  const target = document.getElementById('support');
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

function initSupportAnchorScroll() {
  // Same-page Support clicks (nav uses href="#support")
  document.querySelectorAll('a[href="#support"], a[href$="#support"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const target = document.getElementById('support');
      if (!target) return;

      // Cross-document links (e.g. ../../index.html#support) — only intercept if same page
      if (href !== '#support') {
        try {
          const url = new URL(href, window.location.href);
          const here = window.location.pathname.replace(/\/$/, '') || '/';
          const there = url.pathname.replace(/\/$/, '') || '/';
          if (url.origin !== window.location.origin || there !== here) return;
        } catch (_) {
          return;
        }
      }

      e.preventDefault();
      scrollToSupport({ smooth: true });
      if (history.pushState) {
        history.pushState(null, '', '#support');
      } else {
        window.location.hash = 'support';
      }
      setActiveNavLink();
    });
  });

  // Landing with #support (or browser back/forward)
  const alignIfSupportHash = () => {
    if (window.location.hash !== '#support') return;
    // Let layout settle, then correct under fixed nav
    requestAnimationFrame(() => {
      scrollToSupport({ smooth: false });
      setTimeout(() => scrollToSupport({ smooth: false }), 50);
    });
  };

  if (document.readyState === 'complete') {
    alignIfSupportHash();
  } else {
    window.addEventListener('load', alignIfSupportHash, { once: true });
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#support') alignIfSupportHash();
  });
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
  const originalLabel = copyBtn.textContent;

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
      copyBtn.textContent = 'Copied';
      copyBtn.classList.add('copied');
      copyBtn.setAttribute('aria-live', 'polite');
      setTimeout(() => {
        copyBtn.textContent = originalLabel;
        copyBtn.classList.remove('copied');
      }, 2000);
    } else {
      copyBtn.textContent = 'Copy failed';
      copyBtn.setAttribute('aria-live', 'assertive');
      setTimeout(() => {
        copyBtn.textContent = originalLabel;
      }, 2500);
    }
  });
}

function initBackToTop() {
  if (document.getElementById('back-to-top')) return;

  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.setAttribute('role', 'button');
  document.body.appendChild(btn);

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      scrollTicking = false;
    });
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
    { id: 'explore', href: 'index.html#explore' }
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