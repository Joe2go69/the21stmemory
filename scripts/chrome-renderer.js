const SITE_ICON_SVGS = {
  /* Telegram paper-plane (footer "chat" key) */
  chat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267L8.267 4H4z"/><path d="M4 20l6.768-6.768m2.46-2.46L20 4"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m10 9 6 3-6 3z"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 6-3-6-3z"/></svg>',
  tiktok: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4h3a5 5 0 0 0 5 5"/></svg>',
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  kofi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h10a4 4 0 0 1 0 8H9l-3 3V8z"/><path d="M18 5h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1V5z"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
};

function truncateMiddle(str, head = 10, tail = 6) {
  if (!str || str.length <= head + tail + 1) return str || '';
  return `${str.slice(0, head)}…${str.slice(-tail)}`;
}

function renderSiteIcon(name, extraClass = '') {
  const svg = SITE_ICON_SVGS[name];
  if (!svg) return '';
  const classes = ['card-icon', extraClass].filter(Boolean).join(' ');
  return `<span class="${classes}" aria-hidden="true">${svg}</span>`;
}

function navLinkClasses(link, baseClass) {
  const classes = [baseClass];
  if (link.primary) classes.push('nav-link--primary');
  return classes.join(' ');
}

function withBasePath(url, basePath) {
  if (!basePath || !url) return url;
  if (/^(https?:|mailto:|#|\/\/|data:)/i.test(url)) return url;
  return `${basePath}${url}`;
}

function renderNavItem(link, className, basePath = '') {
  const isExternal = link.external || link.newTab || link.target === '_blank';
  const href = withBasePath(link.href, basePath);
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const dataNav = link.href && !isExternal
    ? ` data-nav="${link.href.replace(/\.html.*$/, '').replace(/[^a-z0-9-]/gi, '-')}"`
    : '';
  return `<a href="${href}" class="${navLinkClasses(link, className)}"${dataNav}${attrs}>${link.text}</a>`;
}

function renderNavbar(navbarData, options = {}) {
  const basePath = options.basePath || '';
  const desktopLinksHTML = navbarData.links.map(link => renderNavItem(link, 'nav-link', basePath)).join('');
  const ctaHTML = navbarData.cta ? renderNavItem(navbarData.cta, 'nav-cta', basePath) : '';
  const allNavItems = navbarData.cta
    ? [...navbarData.links, navbarData.cta]
    : navbarData.links;
  const mobileLinksHTML = allNavItems.map(link => {
    const isCta = navbarData.cta && link.href === navbarData.cta.href;
    return renderNavItem(link, isCta ? 'nav-link nav-cta-mobile' : 'nav-link', basePath);
  }).join('');
  const logoHref = withBasePath(navbarData.logo.href, basePath);

  return `<nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <a href="${logoHref}" class="nav-logo">
            <div class="nav-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <circle cx="13.5" cy="10.5" r="0.7" fill="var(--text-bright)" opacity="0.85"/>
              </svg>
            </div>
            <div>
              <div class="nav-logo-text">${navbarData.logo.text}</div>
              <div class="nav-logo-subtitle">${navbarData.logo.subtitle}</div>
            </div>
          </a>
          <div class="nav-links">
            ${desktopLinksHTML}
            ${ctaHTML}
          </div>
          <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="mobile-menu">
        ${mobileLinksHTML}
      </div>
    </nav>`;
}

function renderFooter(footerData, options = {}) {
  const basePath = options.basePath || '';
  const quickLinksHTML = footerData.quickLinks
    ? footerData.quickLinks.map(link =>
        `<a href="${withBasePath(link.href, basePath)}" class="footer-link">${link.text}</a>`
      ).join('')
    : '';

  const socialsHTML = footerData.socials
    ? footerData.socials.map(social => {
        const iconHTML = renderSiteIcon(social.icon, 'card-icon-sm');
        const label = social.name || 'Social';
        return `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="footer-social" title="${label}" aria-label="${label}">
      ${iconHTML}<span>${label}</span>
    </a>`;
      }).join('')
    : '';

  const bitcoinHint = footerData.support?.bitcoinHint
    || 'Direct contribution — scan the QR or copy the address.';

  const btcAddress = footerData.support?.bitcoinAddress || '';
  const btcDisplay = truncateMiddle(btcAddress, 10, 6);
  const btcIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 8.5h4.2a2 2 0 0 1 0 4H9.5zm0 4h4.6a2 2 0 0 1 0 4H9.5z"/><path d="M11 7v1.5M13 7v1.5M11 15.5V17M13 15.5V17"/></svg>';

  const funds = Array.isArray(footerData.support?.funds) ? footerData.support.funds : [];
  const fundsHTML = funds.length
    ? `<ul class="footer-support-funds" aria-label="${footerData.support.fundsLabel || 'What support covers'}">
        ${funds.map((item) => `<li>${item}</li>`).join('')}
      </ul>`
    : '';

  const kofi = footerData.support?.kofi;
  const gofundme = footerData.support?.gofundme;
  const eyebrow = footerData.support?.eyebrow || 'Optional';
  const heading = footerData.support?.heading || 'Support the archive';

  const supportHTML = footerData.support
    ? `<div class="footer-support" id="support">
            <div class="footer-support-head">
              <p class="footer-support-eyebrow">${eyebrow}</p>
              <h2 class="footer-support-title">${heading}</h2>
              <p class="footer-support-message">${footerData.support.message}</p>
              ${fundsHTML}
            </div>
            <div class="footer-donate-grid">
              ${kofi ? `<div class="footer-donate-card footer-donate-card--kofi">
                <div class="footer-donate-icon" aria-hidden="true">${SITE_ICON_SVGS.kofi}</div>
                <span class="footer-donate-label">Ko-fi</span>
                ${kofi.image ? `<div class="footer-donate-media-wrap">
                  <img src="${withBasePath(kofi.image, basePath)}" alt="${kofi.imageAlt || 'Ko-fi'}" class="footer-donate-media" width="180" height="320" loading="lazy" decoding="async" />
                </div>` : ''}
                <p class="footer-donate-desc">${kofi.hint}</p>
                <a href="${kofi.href}" target="_blank" rel="noopener noreferrer" class="btn-primary footer-donate-btn">
                  <span>${kofi.buttonText}</span>
                </a>
              </div>` : ''}
              <div class="footer-donate-card footer-donate-card--btc">
                <div class="footer-donate-icon footer-donate-icon--btc" aria-hidden="true">${btcIcon}</div>
                <span class="footer-donate-label">Bitcoin</span>
                <p class="footer-donate-desc">${bitcoinHint}</p>
                <div class="footer-donate-qr-block">
                  <img src="${withBasePath(footerData.support.qrImage, basePath)}" alt="${footerData.support.qrAlt}" class="footer-donate-qr" width="180" height="180" loading="lazy" decoding="async" />
                </div>
                <code class="footer-support-address" id="btc-address" title="${btcAddress}">${btcAddress}</code>
                <button type="button" class="btn-primary footer-donate-btn footer-support-copy" data-copy-target="btc-address" data-copy-text="${btcAddress}" aria-label="Copy Bitcoin address">Copy address</button>
              </div>
              ${gofundme ? `<div class="footer-donate-card footer-donate-card--gofundme">
                <div class="footer-donate-icon footer-donate-icon--heart" aria-hidden="true">${SITE_ICON_SVGS.heart}</div>
                <span class="footer-donate-label">GoFundMe</span>
                ${gofundme.image ? `<div class="footer-donate-media-wrap">
                  <img src="${withBasePath(gofundme.image, basePath)}" alt="${gofundme.imageAlt || 'GoFundMe'}" class="footer-donate-media" width="180" height="320" loading="lazy" decoding="async" />
                </div>` : ''}
                <p class="footer-donate-desc">${gofundme.hint}</p>
                <a href="${gofundme.href}" target="_blank" rel="noopener noreferrer" class="btn-primary footer-donate-btn">
                  <span>${gofundme.buttonText}</span>
                </a>
              </div>` : ''}
            </div>
            <p class="footer-support-note">Always free · Many ways to help · Grateful for every form of support</p>
          </div>`
    : '';

  const copyrightHTML = footerData.copyright
    ? `<p class="footer-copyright">${footerData.copyright}</p>`
    : '';

  return `<footer class="site-footer">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-12 gap-10 text-left mb-10">
          <div class="md:col-span-4">
            <div class="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-mem-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <circle cx="13.5" cy="10.5" r="0.7" fill="var(--text-prose)" opacity="0.9"/>
              </svg>
              <div class="text-2xl font-semibold tracking-[0.5px] text-white">${footerData.brand.name}</div>
            </div>
            <p class="text-mem-secondary text-[15px] max-w-md leading-relaxed mb-4">
              ${footerData.brand.description}
            </p>
            <p class="text-xs text-mem-muted tracking-wide font-medium">${footerData.principle}</p>
          </div>
          <div class="md:col-span-3">
            <div class="footer-heading">Quick links</div>
            <div class="space-y-1">
              ${quickLinksHTML}
            </div>
          </div>
          <div class="md:col-span-5">
            <div class="footer-heading">Connect</div>
            <div class="footer-social-grid">
              ${socialsHTML}
            </div>
          </div>
        </div>
        ${supportHTML}
        <div class="pt-8 border-t border-mem-subtle text-center">
          <p class="text-sm text-mem-dim">${footerData.tagline}</p>
          <p class="text-xs text-mem-muted mt-1">${footerData.subtitle}</p>
          ${copyrightHTML}
        </div>
      </div>
    </footer>`;
}

module.exports = { renderNavbar, renderFooter };