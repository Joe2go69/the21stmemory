// Progressive enhancement for prerendered dive/*.html pages

function initDiveStatic() {
  if (!document.body?.dataset?.diveStatic) return;

  initJumpPills();
  initInfographicModal();
  initSlideDeckArtifacts();
  initClickToPlayVideos();
  initReadingProgress();
  initReportToc();
  initTerminologyCards();
  initPrintReport();
  initSectionNavSticky();
  initShareMenu();
}

function initJumpPills() {
  document.querySelectorAll('[data-jump-section]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      if (typeof TopicUtils !== 'undefined' && TopicUtils.scrollToSection) {
        TopicUtils.scrollToSection(id);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initInfographicModal() {
  const modal = document.getElementById('infographic-modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.getElementById('close-modal');
  if (!modal || !modalImg) return;

  const open = (src, trigger) => {
    modalImg.src = src;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    closeBtn?.focus();
    modal._trigger = trigger;
  };

  const close = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    modalImg.src = '';
    modal._trigger?.focus?.();
  };

  document.querySelectorAll('[data-infographic-src]').forEach((el) => {
    const openThis = () => open(el.getAttribute('data-infographic-src'), el);
    el.addEventListener('click', openThis);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openThis();
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
}

function initSlideDeckArtifacts() {
  document.querySelectorAll('.slide-deck-artifact[data-pdf-url]').forEach((artifact) => {
    const openPdf = () => {
      const url = artifact.getAttribute('data-pdf-url');
      if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
    };
    artifact.addEventListener('click', openPdf);
    artifact.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPdf();
      }
    });
  });
}

function initClickToPlayVideos() {
  if (typeof TopicUtils !== 'undefined' && TopicUtils.setupClickToPlayVideos) {
    TopicUtils.setupClickToPlayVideos(document);
    return;
  }

  document.querySelectorAll('[data-rumble-embed]').forEach((el) => {
    const play = () => {
      const embed = el.getAttribute('data-rumble-embed');
      if (!embed) return;
      const iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.title = el.getAttribute('data-video-title') || 'Video';
      iframe.allowFullscreen = true;
      iframe.className = 'w-full h-full border-0 absolute inset-0';
      iframe.setAttribute('loading', 'lazy');
      el.replaceWith(iframe);
    };
    el.addEventListener('click', play);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        play();
      }
    });
  });
}

function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  const fill = bar?.querySelector('.reading-progress-fill');
  const reportSection = document.getElementById('report-section');
  if (!bar || !fill || !reportSection) return;

  const update = () => {
    const rect = reportSection.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = reportSection.offsetHeight;
    const viewportBottom = window.scrollY + window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, (viewportBottom - sectionTop) / Math.max(sectionHeight, 1))
    );
    fill.style.width = `${Math.round(progress * 100)}%`;
    bar.hidden = progress <= 0 || progress >= 1;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initReportToc() {
  const reportContainer = document.getElementById('report-container');
  const tocContainer = document.getElementById('report-toc');
  const tocMobile = document.getElementById('report-toc-mobile');
  if (!reportContainer || !tocContainer) return;
  if (typeof TopicUtils === 'undefined' || !TopicUtils.buildReportToc) return;

  TopicUtils.buildReportToc(reportContainer, tocContainer);

  if (tocMobile && tocContainer && !tocContainer.hidden) {
    tocMobile.innerHTML = tocContainer.innerHTML;
    tocMobile.hidden = false;
    tocMobile.querySelectorAll('[data-toc-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.tocLink);
        if (!target) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const top =
          target.getBoundingClientRect().top +
          scrollTop -
          TopicUtils.NAVBAR_HEIGHT -
          TopicUtils.SCROLL_EXTRA_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}

function initTerminologyCards() {
  const reportContainer = document.getElementById('report-container');
  if (!reportContainer) return;
  if (typeof TopicUtils !== 'undefined' && TopicUtils.enhanceTerminologyCards) {
    TopicUtils.enhanceTerminologyCards(reportContainer);
  }
}

function initPrintReport() {
  document.querySelector('[data-report-print]')?.addEventListener('click', () => {
    window.print();
  });
}

function initSectionNavSticky() {
  const heroPills = document.getElementById('jump-to-pills');
  if (!heroPills) return;

  const sectionIds = [...heroPills.querySelectorAll('[data-jump-section]')]
    .map((btn) => btn.getAttribute('data-jump-section'))
    .filter((id) => id && document.getElementById(id));

  if (!sectionIds.length) return;

  // Sticky segmented control (same language as hero jump pills)
  const sticky = document.createElement('div');
  sticky.className = 'section-nav-sticky';
  sticky.setAttribute('aria-label', 'Topic sections');
  sticky.innerHTML = `<div class="dive-section-seg dive-section-seg--sticky">${sectionIds
    .map((id) => {
      const label =
        heroPills.querySelector(`[data-jump-section="${id}"]`)?.textContent?.trim() || id;
      return `<button type="button" data-jump-section="${id}" class="btn-jump-pill">${label}</button>`;
    })
    .join('')}</div>`;
  document.body.appendChild(sticky);

  sticky.querySelectorAll('[data-jump-section]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      if (typeof TopicUtils !== 'undefined' && TopicUtils.scrollToSection) {
        TopicUtils.scrollToSection(id);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const allPills = () =>
    document.querySelectorAll('#jump-to-pills [data-jump-section], .section-nav-sticky [data-jump-section]');

  const setActive = (activeId) => {
    allPills().forEach((pill) => {
      const on = !!activeId && pill.getAttribute('data-jump-section') === activeId;
      pill.classList.toggle('is-active', on);
      pill.classList.toggle('active', on);
      if (on) pill.setAttribute('aria-current', 'true');
      else pill.removeAttribute('aria-current');
    });
  };

  // Position-based spy (not IntersectionObserver) so Report correctly
  // takes over once its header crosses the sticky chrome line.
  if (typeof TopicUtils !== 'undefined' && TopicUtils.bindSectionPillSpy) {
    TopicUtils.bindSectionPillSpy(sectionIds, setActive);
  }

  const updateStickyVisibility = () => {
    const rect = heroPills.getBoundingClientRect();
    // Stay under the navbar; hide until hero jump pills leave the nav zone
    const pastHero = rect.bottom < 72;
    sticky.classList.toggle('is-visible', pastHero);
    // Re-run spy after sticky appears so active section recalculates offset
    if (typeof TopicUtils !== 'undefined' && TopicUtils.bindSectionPillSpy) {
      /* spy already listening to scroll */
    }
  };

  updateStickyVisibility();
  window.addEventListener('scroll', updateStickyVisibility, { passive: true });
  window.addEventListener('resize', updateStickyVisibility);
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

function initShareMenu() {
  // Support both new share menu and legacy single copy button
  document.querySelectorAll('.dive-copy-link').forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      const url = btn.getAttribute('data-copy-url') || window.location.href;
      const ok = await copyText(url);
      btn.textContent = ok ? 'Link copied' : 'Copy failed';
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });

  document.querySelectorAll('.share-menu').forEach((menu) => {
    const toggle = menu.querySelector('.share-menu__toggle');
    const panel = menu.querySelector('.share-menu__panel');
    if (!toggle || !panel) return;

    const pageUrl = menu.getAttribute('data-share-url') || window.location.href;
    const pageTitle = menu.getAttribute('data-share-title') || document.title;
    const reportUrl = pageUrl.includes('#')
      ? pageUrl.replace(/#.*$/, '') + '#report-section'
      : pageUrl + '#report-section';

    const close = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.hidden) open();
      else close();
    });

    panel.querySelectorAll('[data-share-action]').forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-share-action');
        const original = item.textContent;
        let ok = false;
        let msg = original;

        if (action === 'copy-link') {
          ok = await copyText(pageUrl);
          msg = ok ? 'Link copied' : 'Copy failed';
        } else if (action === 'copy-report') {
          ok = await copyText(reportUrl);
          msg = ok ? 'Report link copied' : 'Copy failed';
        } else if (action === 'copy-title') {
          ok = await copyText(`${pageTitle}\n${pageUrl}`);
          msg = ok ? 'Copied title + URL' : 'Copy failed';
        } else if (action === 'native-share') {
          if (navigator.share) {
            try {
              await navigator.share({ title: pageTitle, url: pageUrl });
              ok = true;
              msg = 'Shared';
            } catch (_) {
              ok = false;
              msg = original;
            }
          } else {
            ok = await copyText(pageUrl);
            msg = ok ? 'Link copied' : 'Share unavailable';
          }
        }

        item.textContent = msg;
        setTimeout(() => {
          item.textContent = original;
          if (ok) close();
        }, 1600);
      });
    });

    // Hide native share when unavailable (desktop without Web Share)
    const nativeBtn = panel.querySelector('[data-share-action="native-share"]');
    if (nativeBtn && !navigator.share) {
      nativeBtn.hidden = true;
    }

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiveStatic);
} else {
  initDiveStatic();
}
