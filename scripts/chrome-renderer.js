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

function isExternalHref(href, explicit) {
  if (explicit) return true;
  return /^(https?:|mailto:)/i.test(href || '');
}

function bitcoinIconSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 8.5h4.2a2 2 0 0 1 0 4H9.5zm0 4h4.6a2 2 0 0 1 0 4H9.5z"/><path d="M11 7v1.5M13 7v1.5M11 15.5V17M13 15.5V17"/></svg>';
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

function renderSupportCta(footerData, basePath = '') {
  const cta = footerData.support?.cta;
  if (!cta) return '';
  const href = withBasePath(cta.href || 'support.html', basePath);
  const text = cta.text || 'This archive is free';
  const linkText = cta.linkText || 'Support the work →';
  return `<p class="footer-support-cta">
            <span class="footer-support-cta__text">${text}</span>
            <span class="footer-support-cta__dot" aria-hidden="true">·</span>
            <a href="${href}" class="text-link footer-support-cta__link">${linkText}</a>
          </p>`;
}

function renderSupportPage(footerData, options = {}) {
  const basePath = options.basePath || '';
  const s = footerData.support || {};
  const heading = s.heading || 'This archive is free';
  const eyebrow = (s.eyebrow || '').trim();
  const resolver = (s.resolver || '').trim();
  const supportNote = s.note || 'A gift is never required. Thank you for being here.';
  const messages = supportMessageParts(s.message, [
    'The transmissions are already free — at the source, and here. That will not change.',
    'I created The 21st Memory as a living archive: an organized, AI-assisted companion so people can more easily find their way through the dense material. The originals remain the source. I point everyone back to them because their frequencies carry something no summary can fully replace.',
    'I tend this archive from a quiet corner of Vancouver Island with my cat Spooky. Most days I try to finish one or two categories. It’s work I love, offered freely because charging for humanity’s free information would feel wrong.',
    'Sitting with a topic, sharing one, or showing up in the community is already real support. The Great Remembering happens through all of us.',
    'If you are moved to give, it covers the practical side — power, internet, AI tools, and the basic costs of keeping the work going — so the archive can continue without interruption. A gift is never required. Nothing is gated.',
  ]);
  const lead = messages[0] || '';
  const story = messages.slice(1);
  const fundsLabel = s.fundsLabel || 'Ways to support';
  const funds = Array.isArray(s.funds) ? s.funds : [];
  const gofundme = s.gofundme;
  const starlink = s.starlink;
  const btcAddress = s.bitcoinAddress || '';
  const btcDisplay = truncateMiddle(btcAddress, 12, 8);
  const bitcoinHint = s.bitcoinHint || 'Direct, no platform in between. Scan the QR or copy the address.';

  const leadHTML = lead
    ? `<p class="page-hero-lead support-lead">${lead}</p>`
    : '';
  const storyHTML = story.length
    ? `<div class="support-story">
        ${story.map((para) => `<p>${para}</p>`).join('\n        ')}
      </div>`
    : '';

  const cardMedia = (src) => {
    if (!src) return '';
    return `<span class="support-card-media" aria-hidden="true">
            <img src="${withBasePath(src, basePath)}" alt="" class="support-card-media__img" width="960" height="540" loading="lazy" decoding="async" />
            <span class="support-card-media__scrim"></span>
          </span>`;
  };

  const fundsHTML = funds
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const rawHref = item.href || '#';
      const href = withBasePath(rawHref, basePath);
      const external = isExternalHref(rawHref, item.external);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      const title = item.title || item.label || '';
      const desc = item.desc || item.description || '';
      const media = cardMedia(item.image);
      return `<li>
          <a class="support-way memory-card static-card${media ? ' has-media' : ''}" href="${href}"${attrs}>
            ${media}
            <span class="support-way__title">${title}</span>
            ${desc ? `<span class="support-way__desc">${desc}</span>` : ''}
          </a>
        </li>`;
    })
    .join('');

  const gofundmeMedia = cardMedia(gofundme?.image);
  const gofundmeCard = gofundme
    ? `<article class="support-give-card memory-card static-card${gofundmeMedia ? ' has-media' : ''}">
            ${gofundmeMedia}
            <span class="support-give-icon support-give-icon--heart" aria-hidden="true">${SITE_ICON_SVGS.heart}</span>
            <span class="support-give-label">Card or bank</span>
            <p class="support-give-desc">${gofundme.hint}</p>
            <a href="${gofundme.href}" target="_blank" rel="noopener noreferrer" class="btn-primary">
              <span>${gofundme.buttonText || 'Continue on GoFundMe'}</span>
            </a>
          </article>`
    : '';

  const starlinkMedia = cardMedia(starlink?.image);
  const starlinkCard = starlink
    ? `<article class="support-give-card memory-card static-card${starlinkMedia ? ' has-media' : ''}">
            ${starlinkMedia}
            <span class="support-give-icon support-give-icon--starlink" aria-hidden="true">${SITE_ICON_SVGS.satellite}</span>
            <span class="support-give-label">Starlink</span>
            <p class="support-give-desc">${starlink.hint}</p>
            <a href="${starlink.href}" target="_blank" rel="noopener noreferrer" class="btn-primary">
              <span>${starlink.buttonText || 'Claim a free month'}</span>
            </a>
          </article>`
    : '';

  const qrSrc = withBasePath(s.qrImage || 'assets/images/bitcoin-qr.png', basePath);
  const qrAlt = s.qrAlt || 'Bitcoin QR code for 21st Memory donations';
  const btcMedia = cardMedia(s.bitcoinImage);
  const btcCard = `<article class="support-give-card memory-card static-card support-give-card--btc${btcMedia ? ' has-media' : ''}">
            ${btcMedia}
            <span class="support-give-icon support-give-icon--btc" aria-hidden="true">${bitcoinIconSvg()}</span>
            <span class="support-give-label">Bitcoin</span>
            <p class="support-give-desc">${bitcoinHint}</p>
            <div class="support-give-qr">
              <img src="${qrSrc}" alt="${qrAlt}" width="148" height="148" loading="lazy" decoding="async" />
            </div>
            <code class="footer-support-address" id="btc-address" title="${btcAddress}">${btcDisplay}</code>
            <button type="button" class="btn-primary footer-support-copy" data-copy-target="btc-address" data-copy-text="${btcAddress}" aria-label="Copy Bitcoin address"><span>Copy address</span></button>
          </article>`;

  const resolverHTML = resolver
    ? `\n        <p class="support-resolver" role="note">${resolver}</p>`
    : '';

  return `    <header class="page-hero page-hero--interior max-w-3xl mx-auto px-6 text-center" id="support">
        ${eyebrow ? `<p class="page-hero-eyebrow">${eyebrow}</p>` : ''}
        <h1 class="page-hero-title page-hero-title--page font-semibold tracking-tighter leading-none mb-5">${heading}</h1>
        ${leadHTML}${resolverHTML}
        ${storyHTML}
    </header>
    <div class="max-w-6xl mx-auto px-6 page-shell page-shell--after-hero pb-16">
      <section class="support-ways-section" aria-labelledby="support-ways-heading">
        <p class="section-eyebrow mb-5" id="support-ways-heading">${fundsLabel}</p>
        <ul class="support-ways">
        ${fundsHTML}
        </ul>
      </section>
      <section id="give" class="support-give home-section-anchor" aria-labelledby="give-heading">
        <p class="section-eyebrow mb-5" id="give-heading">Ways to give</p>
        <div class="support-give-grid">
          ${gofundmeCard}
          ${starlinkCard}
          ${btcCard}
        </div>
        <p class="support-note">${supportNote}</p>
      </section>
    </div>`;
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

  const supportCtaHTML = renderSupportCta(footerData, basePath);

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
        <div class="footer-bottom">
          ${supportCtaHTML}
          <p class="footer-tagline">${footerData.tagline}</p>
          <div class="footer-bottom-bar">
            ${copyrightHTML}
            <p class="footer-bottom-principles">${footerData.principle}</p>
          </div>
        </div>
      </div>
    </footer>`;
}

module.exports = { renderNavbar, renderFooter, renderSupportPage, BRAND_MARK };
