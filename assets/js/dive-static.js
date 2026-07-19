// Progressive enhancement for prerendered dive/*.html pages

function initDiveStatic() {
  if (!document.body?.dataset?.diveStatic) return;

  initJumpPills();
  initInfographicModal();
  initSlideDeckArtifacts();
  initClickToPlayVideos();
  initReadingProgress();
  initCopyLink();
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

function initCopyLink() {
  document.querySelectorAll('.dive-copy-link').forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener('click', async () => {
      const url = btn.getAttribute('data-copy-url') || window.location.href;
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          ok = true;
        }
      } catch (_) {
        /* fall through */
      }
      if (!ok) {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand('copy');
        } catch (_) {
          ok = false;
        }
        document.body.removeChild(ta);
      }
      btn.textContent = ok ? 'Link copied' : 'Copy failed';
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiveStatic);
} else {
  initDiveStatic();
}
