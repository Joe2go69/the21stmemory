// Shared Navbar + Footer — interactivity (chrome is inlined at build time)

const CODEX_PAGES = new Set(['codex.html', 'topics.html', 'deep-dive.html']);
const NETWORK_PAGES = new Set(['community.html']);
const HOME_PAGES = new Set(['index.html']);
const INDEX_SECTION_LINKS = new Set([
  'index.html#about',
  'index.html#codex',
  'index.html#explore'
]);

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
  initMobileMenu();
  initBackToTop();
  initFooterSupportCopy();
  initDeferredAnalytics();
  setTimeout(initScrollAnimations, 250);
}

function initFooterSupportCopy() {
  const copyBtn = document.querySelector('.footer-support-copy');
  if (!copyBtn) return;

  const targetId = copyBtn.getAttribute('data-copy-target');
  const target = targetId ? document.getElementById(targetId) : null;
  if (!target) return;

  const originalLabel = copyBtn.textContent;

  copyBtn.addEventListener('click', async () => {
    const text = target.textContent.trim();
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_) { /* fall through to legacy copy */ }
    }

    if (!copied) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copied = document.execCommand('copy');
      selection.removeAllRanges();
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

function closeMobileMenu(mobileBtn, mobileMenu) {
  mobileMenu.classList.remove('open');
  mobileBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  const svg = mobileBtn.querySelector('svg');
  if (svg) {
    svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
  }
  mobileBtn.classList.remove('active-glow');
}

function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileBtn || !mobileMenu) return;

  const syncMobileMenuState = () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu(mobileBtn, mobileMenu);
    }
  };

  window.addEventListener('resize', syncMobileMenuState);

  mobileBtn.addEventListener('click', () => {
    if (window.innerWidth >= 768) return;
    const isOpen = mobileMenu.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    const svg = mobileBtn.querySelector('svg');
    if (svg) {
      if (isOpen) {
        svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
        mobileBtn.classList.add('active-glow');
      } else {
        svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
        mobileBtn.classList.remove('active-glow');
      }
    }
  });

  mobileMenu.querySelectorAll('.nav-link, .nav-cta-mobile').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(mobileBtn, mobileMenu));
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
  const linkPath = linkPathRaw || 'index.html';
  const linkHash = linkHashPart ? '#' + linkHashPart : '';

  if (linkPath === 'codex.html' && CODEX_PAGES.has(currentPath)) {
    return true;
  }

  if (linkPath === 'community.html' && NETWORK_PAGES.has(currentPath)) {
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