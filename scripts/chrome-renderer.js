const SITE_ICON_SVGS = {
  /* Telegram paper-plane (footer "chat" key) */
  chat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267L8.267 4H4z"/><path d="M4 20l6.768-6.768m2.46-2.46L20 4"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m10 9 6 3-6 3z"/></svg>',
  /* Rumble: circular play mark — distinct from YouTube’s landscape screen */
  rumble: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.75v6.5L16.25 12 10 8.75z"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 6-3-6-3z"/></svg>',
  tiktok: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4h3a5 5 0 0 0 5 5"/></svg>',
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  satellite: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4"/><circle cx="19" cy="5" r="2"/><path d="M15 15a6 6 0 0 1-6 6"/></svg>',
};

/** Official frosted-glass “21st” brand mark (relative to site root). */
const BRAND_MARK = 'images/21st-mark.webp';

function truncateMiddle(str, head = 10, tail = 6) {
  if (!str || str.length <= head + tail + 1) return str || '';
  return `${str.slice(0, head)}…${str.slice(-tail)}`;
}

function supportMessageParts(text, fallback) {
  if (Array.isArray(text)) {
    return text.map((part) => String(part || '').trim()).filter(Boolean);
  }
  if (typeof text === 'string' && text.trim()) return [text.trim()];
  return fallback;
}

function renderSupportMessages(parts, variant) {
  return parts
    .map((para, i) => {
      const beat = parts.length > 1 && i === parts.length - 1
        ? ' footer-support-message--beat'
        : '';
      return `<p class="footer-support-message footer-support-message--${variant}${beat} page-hero-lead">${para}</p>`;
    })
    .join('\n              ');
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

function dataNavValue(href) {
  if (!href) return '';
  // Pure hash anchors (e.g. #support) → "-support"
  if (href.startsWith('#')) {
    return href.replace(/[^a-z0-9-]/gi, '-');
  }
  // Page + hash (e.g. index.html#oracle) → section id so it doesn't collide with Home
  const hashMatch = href.match(/#([a-z0-9_-]+)/i);
  if (hashMatch) return hashMatch[1].toLowerCase();
  // Plain page → basename without .html
  return href.replace(/\.html.*$/i, '').replace(/[^a-z0-9-]/gi, '-');
}

function renderNavItem(link, className, basePath = '') {
  const isExternal = link.external || link.newTab || link.target === '_blank';
  const href = withBasePath(link.href, basePath);
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const navKey = !isExternal ? dataNavValue(link.href) : '';
  const dataNav = navKey ? ` data-nav="${navKey}"` : '';
  return `<a href="${href}" class="${navLinkClasses(link, className)}"${dataNav}${attrs}>${link.text}</a>`;
}

function renderBrandMark(basePath, options = {}) {
  const {
    className = 'brand-mark',
    width = 48,
    height = 48,
    lazy = false,
  } = options;
  const src = withBasePath(BRAND_MARK, basePath);
  const loading = lazy ? ' loading="lazy"' : '';
  return `<img src="${src}" alt="" class="${className}" width="${width}" height="${height}" decoding="async"${loading} />`;
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
  const markHTML = renderBrandMark(basePath, {
    className: 'nav-logo-mark-img',
    width: 48,
    height: 48,
    lazy: false,
  });

  return `<nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <a href="${logoHref}" class="nav-logo" aria-label="21st Memory home">
            <span class="nav-logo-mark" aria-hidden="true">
              ${markHTML}
            </span>
            <span class="nav-logo-copy">
              <span class="nav-logo-text">${navbarData.logo.text}</span>
              <span class="nav-logo-subtitle">${navbarData.logo.subtitle}</span>
            </span>
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
  const homeHref = withBasePath('index.html', basePath);
  const brandSubtitle = footerData.brand?.subtitle || 'Living Archive';
  const quickLinksHTML = footerData.quickLinks
    ? footerData.quickLinks.map(link =>
        `<a href="${withBasePath(link.href, basePath)}" class="footer-link">${link.text}</a>`
      ).join('')
    : '';

  const socialsHTML = footerData.socials
    ? footerData.socials.map(social => {
        const iconHTML = renderSiteIcon(social.icon, 'card-icon-sm');
        const label = social.name || 'Social';
        return `<a href="${social.href}" target="_blank" rel="noopener noreferrer" class="footer-social footer-social--icon" title="${label}" aria-label="${label}">
      ${iconHTML}<span class="footer-social-label">${label}</span>
    </a>`;
      }).join('')
    : '';

  const bitcoinHint = footerData.support?.bitcoinHint
    || 'Scan with a wallet app, or copy the address below.';
  const btcAddress = footerData.support?.bitcoinAddress || '';
  const btcDisplay = truncateMiddle(btcAddress, 12, 8);
  const btcIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 8.5h4.2a2 2 0 0 1 0 4H9.5zm0 4h4.6a2 2 0 0 1 0 4H9.5z"/><path d="M11 7v1.5M13 7v1.5M11 15.5V17M13 15.5V17"/></svg>';

  const gofundme = footerData.support?.gofundme;
  const starlink = footerData.support?.starlink;
  const eyebrow = (footerData.support?.eyebrow || '').trim();
  const heading = footerData.support?.heading || 'Keep the archive growing';
  const supportNote = footerData.support?.note || 'Entirely optional · Every form counts';
  const supportMessagePartsLong = supportMessageParts(
    footerData.support?.message,
    [
      'The 21st Memory is free and always will be. This is the work I do — organizing and making the transmissions clearer because I love it and because it helps people remember. Support can look like sharing a topic, joining the community, or doing your own remembering.',
      'I’m not trying to get rich — I’m covering the basics so I can keep doing this. Any amount makes a real difference.',
    ]
  );
  const supportMessagePartsShort = supportMessageParts(
    footerData.support?.messageShort,
    supportMessagePartsLong
  );
  const eyebrowHTML = eyebrow
    ? `<p class="footer-support-eyebrow page-hero-eyebrow">${eyebrow}</p>`
    : '';

  const funds = Array.isArray(footerData.support?.funds) ? footerData.support.funds : [];
  const fundsHTML = funds.length
    ? `<ul class="footer-support-funds" aria-label="${footerData.support.fundsLabel || 'Ways to support'}">
        ${funds
          .map((item) => {
            if (item && typeof item === 'object') {
              const title = item.title || item.label || '';
              const desc = item.desc || item.description || '';
              return `<li class="footer-support-fund">
          <span class="footer-support-fund__title">${title}</span>
          ${desc ? `<span class="footer-support-fund__desc">${desc}</span>` : ''}
        </li>`;
            }
            return `<li class="footer-support-fund"><span class="footer-support-fund__title">${item}</span></li>`;
          })
          .join('')}
      </ul>`
    : '';

  // Tab order: GoFundMe → Starlink → Bitcoin (default = first)
  const tabItems = [];
  if (gofundme) {
    tabItems.push({ id: 'gofundme', label: 'GoFundMe', icon: SITE_ICON_SVGS.heart, iconMod: ' footer-tab-icon--heart' });
  }
  if (starlink) {
    tabItems.push({ id: 'starlink', label: 'Starlink', icon: SITE_ICON_SVGS.satellite, iconMod: ' footer-tab-icon--starlink' });
  }
  tabItems.push({ id: 'btc', label: 'Bitcoin', icon: btcIcon, iconMod: ' footer-tab-icon--btc' });

  const defaultTab = tabItems[0]?.id || 'gofundme';

  const tabsHTML = tabItems.map((tab) => {
    const selected = tab.id === defaultTab;
    return `<button type="button" class="footer-tab${selected ? ' is-active' : ''}" role="tab" id="footer-tab-${tab.id}" aria-controls="footer-panel-${tab.id}" aria-selected="${selected ? 'true' : 'false'}" tabindex="${selected ? '0' : '-1'}" data-footer-tab="${tab.id}">
              <span class="footer-tab-icon${tab.iconMod || ''}" aria-hidden="true">${tab.icon}</span>
              <span class="footer-tab-label">${tab.label}</span>
            </button>`;
  }).join('');

  // Side-blend panels: image visible in the box on left or right, fading into copy
  const gofundmePanel = gofundme
    ? `<div class="footer-tabpanel footer-tabpanel--blend footer-tabpanel--blend-right${gofundme.image ? ' has-media' : ''}${defaultTab === 'gofundme' ? ' is-active' : ''}" role="tabpanel" id="footer-panel-gofundme" aria-labelledby="footer-tab-gofundme"${defaultTab === 'gofundme' ? '' : ' hidden'}>
              ${gofundme.image ? `<div class="footer-tab-media" aria-hidden="true">
                <img src="${withBasePath(gofundme.image, basePath)}" alt="" class="footer-tab-media__img" width="1280" height="720" loading="lazy" decoding="async" />
                <div class="footer-tab-media__scrim"></div>
              </div>` : ''}
              <div class="footer-tab-body">
                <span class="footer-donate-label">GoFundMe</span>
                <p class="footer-donate-desc">${gofundme.hint}</p>
                <a href="${gofundme.href}" target="_blank" rel="noopener noreferrer" class="btn-primary footer-donate-btn">
                  <span>${gofundme.buttonText}</span>
                </a>
              </div>
            </div>`
    : '';

  // Alternate blend side from GoFundMe so consecutive image tabs feel balanced
  const starlinkPanel = starlink
    ? `<div class="footer-tabpanel footer-tabpanel--blend footer-tabpanel--blend-left${starlink.image ? ' has-media' : ''}${defaultTab === 'starlink' ? ' is-active' : ''}" role="tabpanel" id="footer-panel-starlink" aria-labelledby="footer-tab-starlink"${defaultTab === 'starlink' ? '' : ' hidden'}>
              ${starlink.image ? `<div class="footer-tab-media" aria-hidden="true">
                <img src="${withBasePath(starlink.image, basePath)}" alt="" class="footer-tab-media__img" width="1280" height="720" loading="lazy" decoding="async" />
                <div class="footer-tab-media__scrim"></div>
              </div>` : ''}
              <div class="footer-tab-body">
                <span class="footer-donate-label">Starlink</span>
                <p class="footer-donate-desc">${starlink.hint}</p>
                <a href="${starlink.href}" target="_blank" rel="noopener noreferrer" class="btn-primary footer-donate-btn">
                  <span>${starlink.buttonText}</span>
                </a>
              </div>
            </div>`
    : '';

  // Bitcoin: blend atmosphere (optional) + QR + copy
  const btcImage = footerData.support?.bitcoinImage || '';
  const btcPanel = `<div class="footer-tabpanel footer-tabpanel--btc${btcImage ? ' footer-tabpanel--blend footer-tabpanel--blend-right has-media' : ''}${defaultTab === 'btc' ? ' is-active' : ''}" role="tabpanel" id="footer-panel-btc" aria-labelledby="footer-tab-btc"${defaultTab === 'btc' ? '' : ' hidden'}>
              ${btcImage ? `<div class="footer-tab-media" aria-hidden="true">
                <img src="${withBasePath(btcImage, basePath)}" alt="" class="footer-tab-media__img" width="1280" height="720" loading="lazy" decoding="async" />
                <div class="footer-tab-media__scrim"></div>
              </div>` : ''}
              <div class="footer-tab-body footer-tab-body--btc">
                <div class="footer-btc-qr-wrap">
                  <img src="${withBasePath(footerData.support.qrImage, basePath)}" alt="${footerData.support.qrAlt || 'Bitcoin QR code'}" class="footer-tab-media__qr" width="140" height="140" loading="lazy" decoding="async" />
                </div>
                <div class="footer-btc-copy">
                  <span class="footer-donate-label">Bitcoin</span>
                  <p class="footer-donate-desc">${bitcoinHint}</p>
                  <code class="footer-support-address" id="btc-address" title="${btcAddress}">${btcDisplay}</code>
                  <button type="button" class="btn-primary footer-donate-btn footer-support-copy" data-copy-target="btc-address" data-copy-text="${btcAddress}" aria-label="Copy Bitcoin address"><span>Copy address</span></button>
                </div>
              </div>
            </div>`;

  const supportHTML = footerData.support
    ? `<div class="footer-support" id="support">
            <div class="footer-support-head">
              ${eyebrowHTML}
              <h2 class="footer-support-title page-hero-title--page">${heading}</h2>
              ${renderSupportMessages(supportMessagePartsLong, 'long')}
              ${renderSupportMessages(supportMessagePartsShort, 'short')}
              ${fundsHTML}
            </div>
            <div class="footer-support-tabs" data-footer-tabs>
              <div class="footer-tablist footer-tablist--${tabItems.length}" role="tablist" aria-label="Ways to support">
                ${tabsHTML}
              </div>
              <div class="footer-tabpanels">
                ${gofundmePanel}
                ${starlinkPanel}
                ${btcPanel}
              </div>
            </div>
            <p class="footer-support-note">${supportNote}</p>
          </div>`
    : '';

  const copyrightHTML = footerData.copyright
    ? `<p class="footer-copyright">${footerData.copyright}</p>`
    : '';

  const markHTML = renderBrandMark(basePath, {
    className: 'footer-brand-mark',
    width: 56,
    height: 56,
    lazy: true,
  });

  return `<footer class="site-footer">
      <div class="footer-inner max-w-6xl mx-auto px-6">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-brand-row">
              <span class="footer-brand-mark-wrap" aria-hidden="true">${markHTML}</span>
              <a href="${homeHref}" class="footer-brand-link" aria-label="21st Memory home">
                <span class="footer-brand-copy">
                  <span class="footer-brand-name">${footerData.brand.name}</span>
                  <span class="footer-brand-subtitle">${brandSubtitle}</span>
                </span>
              </a>
            </div>
            <p class="footer-brand-desc">${footerData.brand.description}</p>
          </div>
          <div class="footer-col footer-col--links">
            <div class="footer-heading">Explore</div>
            <div class="footer-link-list">
              ${quickLinksHTML}
            </div>
          </div>
          <div class="footer-col footer-col--connect">
            <div class="footer-heading">Connect</div>
            <div class="footer-social-row">
              ${socialsHTML}
            </div>
          </div>
        </div>
        ${supportHTML}
        <div class="footer-bottom">
          <p class="footer-tagline">${footerData.tagline}</p>
          <p class="footer-subtitle">${footerData.subtitle}</p>
          <div class="footer-bottom-bar">
            ${copyrightHTML}
            <p class="footer-bottom-principles">${footerData.principle}</p>
          </div>
        </div>
      </div>
    </footer>`;
}

module.exports = { renderNavbar, renderFooter, BRAND_MARK };
