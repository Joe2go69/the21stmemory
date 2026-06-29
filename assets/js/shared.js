// Shared Navbar + Footer Renderer (one file for the entire site)

// Subtle global loading state for JSON fetches (thin animated top bar)
let globalLoader;

function initGlobalLoader() {
  if (document.getElementById('global-loader')) return;
  globalLoader = document.createElement('div');
  globalLoader.id = 'global-loader';
  globalLoader.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(to right,#8B3DFF,#C026D3,#8B3DFF);z-index:9999;transition:all 0.3s ease;width:0%;opacity:1;';
  document.body.appendChild(globalLoader);
}

function showGlobalLoader() {
  if (!globalLoader) initGlobalLoader();
  globalLoader.style.width = '35%';
  globalLoader.style.opacity = '1';
}

function hideGlobalLoader() {
  if (!globalLoader) return;
  globalLoader.style.width = '100%';
  setTimeout(() => {
    if (globalLoader) {
      globalLoader.style.opacity = '0';
      setTimeout(() => {
        if (globalLoader) globalLoader.style.width = '0%';
      }, 250);
    }
  }, 150);
}

async function loadSharedComponents() {
  showGlobalLoader();
  try {
  // Load Navbar JSON
  const navRes = await fetch('assets/data/navbar.json');
  const navbarData = await navRes.json();

  // Load Footer JSON
  const footerRes = await fetch('assets/data/footer.json');
  const footerData = await footerRes.json();

  // ====================== RENDER NAVBAR ======================
  const renderNavItem = (link, className) => {
    const isExternal = link.external || link.newTab || link.target === '_blank';
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${link.href}" class="${className}"${attrs}>${link.text}</a>`;
  };

  const desktopLinksHTML = navbarData.links.map(link => renderNavItem(link, 'nav-link')).join('');
  const ctaHTML = navbarData.cta ? renderNavItem(navbarData.cta, 'nav-cta') : '';
  const allNavItems = navbarData.cta
    ? [...navbarData.links, navbarData.cta]
    : navbarData.links;
  const mobileLinksHTML = allNavItems.map(link => {
    const isCta = navbarData.cta && link.href === navbarData.cta.href;
    return renderNavItem(link, isCta ? 'nav-link nav-cta-mobile' : 'nav-link');
  }).join('');

  const navbarHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <!-- Logo -->
          <a href="${navbarData.logo.href}" class="nav-logo">
            <div class="nav-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <circle cx="13.5" cy="10.5" r="0.7" fill="#EDE4FF" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <div class="nav-logo-text">${navbarData.logo.text}</div>
              <div class="nav-logo-subtitle">${navbarData.logo.subtitle}</div>
            </div>
          </a>
          
          <!-- Desktop Nav Links -->
          <div class="nav-links">
            ${desktopLinksHTML}
            ${ctaHTML}
          </div>
          
          <!-- Mobile Menu Button -->
          <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div id="mobile-menu" class="mobile-menu">
        ${mobileLinksHTML}
      </div>
    </nav>
  `;

  // Robust navbar injection: ALWAYS force override any old/existing nav elements (inline or otherwise)
  const existingNavs = document.querySelectorAll('nav');
  existingNavs.forEach(nav => nav.remove());

  // Insert fresh navbar at the very top of <body>
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', navbarHTML);

  // Highlight active navigation link based on current page / hash (for all internal links including section anchors)
  setActiveNavLink();

  // ====================== RENDER FOOTER ======================
  const quickLinksHTML = footerData.quickLinks ? footerData.quickLinks.map(link => 
    `<a href="${link.href}" class="block text-[#C4B5FD] hover:text-[#C026D3] transition py-1 text-sm">${link.text}</a>`
  ).join('') : '';

  const socialsHTML = footerData.socials ? footerData.socials.map(social => {
    const iconHTML = typeof renderSiteIcon === 'function'
      ? renderSiteIcon(social.icon, 'card-icon-sm')
      : '';
    return `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-[#CBD5E1] hover:text-[#6D28D9] transition text-sm px-3 py-1.5 rounded-full hover:bg-[#2A1F40]">
      ${iconHTML}<span>${social.name}</span>
    </a>`;
  }).join('') : '';

  const footerHTML = `
    <footer class="border-t border-[#4C3D6B] py-12 text-center bg-[#0F0A1F]">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-12 gap-10 text-left mb-10">
          
          <!-- Brand -->
          <div class="md:col-span-5">
            <div class="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#6D28D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <circle cx="13.5" cy="10.5" r="0.7" fill="#E0D4FF" opacity="0.9"/>
              </svg>
              <div class="text-2xl font-semibold tracking-[0.5px] text-white">${footerData.brand.name}</div>
            </div>
            <p class="text-[#CBD5E1] text-[15px] max-w-md leading-relaxed mb-4">
              ${footerData.brand.description}
            </p>
            <p class="text-xs text-[#A78BFA] tracking-[1px] font-medium">${footerData.principle}</p>
          </div>

          <!-- Quick Links -->
          <div class="md:col-span-4">
            <div class="text-sm font-semibold text-[#6D28D9] tracking-[1.5px] mb-4">QUICK LINKS</div>
            <div class="space-y-1">
              ${quickLinksHTML}
            </div>
          </div>

          <!-- Socials -->
          <div class="md:col-span-3">
            <div class="text-sm font-semibold text-[#6D28D9] tracking-[1.5px] mb-4">CONNECT WITH US</div>
            <div class="flex flex-wrap gap-2">
              ${socialsHTML}
            </div>
          </div>

        </div>

        <div class="pt-8 border-t border-[#4C3D6B] text-center">
          <p class="text-sm text-[#6B5B95]">${footerData.tagline}</p>
          <p class="text-xs text-[#A78BFA] mt-1">${footerData.subtitle}</p>
        </div>
      </div>
    </footer>
  `;

  // Replace any existing footer or append at the end
  const existingFooter = document.querySelector('footer');
  if (existingFooter) {
    existingFooter.outerHTML = footerHTML;
  } else {
    body.insertAdjacentHTML('beforeend', footerHTML);
  }

  // Initialize mobile menu (same as before)
  initMobileMenu();

  // Initialize improved Back-to-Top (centralized, only shows on long pages)
  initBackToTop();

  // Initialize subtle scroll-triggered animations on section cards (fade-in + soft purple glow pulse)
  // Uses Intersection Observer as specified. Targets all relevant content cards without altering HTML.
  setTimeout(initScrollAnimations, 250);
  } finally {
    hideGlobalLoader();
  }
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.setAttribute('role', 'button');
  document.body.appendChild(btn);

  // More reliable: show on any page after 400px scroll (especially important for long pages like lesson-viewer.html)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function closeMobileMenu(mobileBtn, mobileMenu) {
  mobileMenu.classList.remove('open');
  mobileBtn.setAttribute('aria-expanded', 'false');
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
    const svg = mobileBtn.querySelector('svg');
    if (isOpen) {
      svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6h12v12" />`;
      mobileBtn.classList.add('active-glow');
    } else {
      svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />`;
      mobileBtn.classList.remove('active-glow');
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('.nav-link, .nav-cta-mobile').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(mobileBtn, mobileMenu));
  });
}

// Auto-run when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSharedComponents);
} else {
  loadSharedComponents();
}

// Scroll-triggered animation initializer (Intersection Observer)
function initScrollAnimations() {
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

// Set active nav link highlighting (called after navbar injection)
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (href.startsWith('http') || href.includes('://')) return; // skip external links

    const [linkPathRaw, linkHashPart] = href.split('#');
    const linkPath = linkPathRaw || 'index.html';
    const linkHash = linkHashPart ? '#' + linkHashPart : '';

    let isActive = false;
    if (currentPath === linkPath) {
      if (linkHash) {
        if (currentHash === linkHash) {
          isActive = true;
        }
      } else if (!currentHash) {
        // Base page link (e.g. Home on index.html without hash, or sources.html)
        isActive = true;
      }
    }
    if (isActive) {
      link.classList.add('active');
    }
  });

  // Setup listeners once for dynamic active state on hash changes (e.g. clicking About/Rumble sections) and clicks
  if (!window._activeNavListenersAdded) {
    window._activeNavListenersAdded = true;
    window.addEventListener('hashchange', setActiveNavLink);
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        setTimeout(setActiveNavLink, 100);
      }
    });
  }
}
