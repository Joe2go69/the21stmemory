const SITE_ICON_SVGS = {
  chat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m10 9 6 3-6 3z"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

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

function renderNavItem(link, className) {
  const isExternal = link.external || link.newTab || link.target === '_blank';
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const dataNav = link.href && !isExternal
    ? ` data-nav="${link.href.replace(/\.html.*$/, '').replace(/[^a-z0-9-]/gi, '-')}"`
    : '';
  return `<a href="${link.href}" class="${navLinkClasses(link, className)}"${dataNav}${attrs}>${link.text}</a>`;
}

function renderNavbar(navbarData) {
  const desktopLinksHTML = navbarData.links.map(link => renderNavItem(link, 'nav-link')).join('');
  const ctaHTML = navbarData.cta ? renderNavItem(navbarData.cta, 'nav-cta') : '';
  const allNavItems = navbarData.cta
    ? [...navbarData.links, navbarData.cta]
    : navbarData.links;
  const mobileLinksHTML = allNavItems.map(link => {
    const isCta = navbarData.cta && link.href === navbarData.cta.href;
    return renderNavItem(link, isCta ? 'nav-link nav-cta-mobile' : 'nav-link');
  }).join('');

  return `<nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <a href="${navbarData.logo.href}" class="nav-logo">
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

function renderFooter(footerData) {
  const quickLinksHTML = footerData.quickLinks
    ? footerData.quickLinks.map(link =>
        `<a href="${link.href}" class="footer-link">${link.text}</a>`
      ).join('')
    : '';

  const socialsHTML = footerData.socials
    ? footerData.socials.map(social => {
        const iconHTML = renderSiteIcon(social.icon, 'card-icon-sm');
        return `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="footer-social">
      ${iconHTML}<span>${social.name}</span>
    </a>`;
      }).join('')
    : '';

  const supportHTML = footerData.support
    ? `<div class="footer-support">
            <img src="${footerData.support.qrImage}" alt="${footerData.support.qrAlt}" class="footer-support-qr" width="140" height="140" loading="lazy" />
            <div class="footer-support-content">
              <div class="footer-heading">${footerData.support.heading}</div>
              <p class="footer-support-message">${footerData.support.message}</p>
              <div class="footer-support-address-wrap">
                <span class="footer-support-label">Bitcoin</span>
                <code class="footer-support-address" id="btc-address">${footerData.support.bitcoinAddress}</code>
                <button type="button" class="footer-support-copy" data-copy-target="btc-address" aria-label="Copy Bitcoin address">Copy</button>
              </div>
            </div>
          </div>`
    : '';

  return `<footer class="site-footer">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-12 gap-10 text-left mb-10">
          <div class="md:col-span-5">
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
          <div class="md:col-span-4">
            <div class="footer-heading">Quick links</div>
            <div class="space-y-1">
              ${quickLinksHTML}
            </div>
          </div>
          <div class="md:col-span-3">
            <div class="footer-heading">Connect</div>
            <div class="flex flex-wrap gap-2">
              ${socialsHTML}
            </div>
          </div>
        </div>
        ${supportHTML}
        <div class="pt-8 border-t border-mem-subtle text-center">
          <p class="text-sm text-mem-dim">${footerData.tagline}</p>
          <p class="text-xs text-mem-muted mt-1">${footerData.subtitle}</p>
        </div>
      </div>
    </footer>`;
}

module.exports = { renderNavbar, renderFooter };