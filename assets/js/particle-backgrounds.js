/**
 * 21st Memory — Title-Seeded Particle Backgrounds
 * Rich, deterministic crystalline/network art generated from each video title.
 * Same title → same artwork every time. No external libraries.
 */

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createSeededRandom(seed) {
  let s = seed;
  return function seededRandom() {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

/** Pick a cohesive palette from seed — keeps brand range, varies per title. */
function pickPalette(rand) {
  const palettes = [
    {
      // Violet crystal
      bgDeep: '#0A0618',
      bgMid: '#150B2E',
      glow: [124, 58, 237],
      line: [167, 139, 250],
      nodeA: [196, 181, 253],
      nodeB: [253, 224, 171],
      accent: [232, 121, 249]
    },
    {
      // Indigo + gold
      bgDeep: '#08061A',
      bgMid: '#12102E',
      glow: [99, 102, 241],
      line: [165, 180, 252],
      nodeA: [199, 210, 254],
      nodeB: [252, 211, 77],
      accent: [251, 191, 36]
    },
    {
      // Amethyst + rose
      bgDeep: '#0C0614',
      bgMid: '#1A0A28',
      glow: [147, 51, 234],
      line: [216, 180, 254],
      nodeA: [233, 213, 255],
      nodeB: [251, 207, 232],
      accent: [244, 114, 182]
    },
    {
      // Deep teal crystal
      bgDeep: '#060B14',
      bgMid: '#0C1A28',
      glow: [14, 116, 144],
      line: [103, 232, 249],
      nodeA: [165, 243, 252],
      nodeB: [196, 181, 253],
      accent: [34, 211, 238]
    },
    {
      // Royal night
      bgDeep: '#070512',
      bgMid: '#120A24',
      glow: [109, 40, 217],
      line: [192, 132, 252],
      nodeA: [221, 214, 254],
      nodeB: [254, 240, 138],
      accent: [167, 139, 250]
    }
  ];
  return palettes[Math.floor(rand() * palettes.length)];
}

function rgba(rgb, a) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
}

function drawSoftOrb(ctx, x, y, radius, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, rgba(color, alpha));
  g.addColorStop(0.45, rgba(color, alpha * 0.35));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawStarSpark(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = rgba(color, 1);
  ctx.lineWidth = Math.max(0.6, size * 0.18);
  ctx.lineCap = 'round';
  // Cross + diagonal spark
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.55;
  ctx.beginPath();
  ctx.moveTo(-size * 0.55, -size * 0.55);
  ctx.lineTo(size * 0.55, size * 0.55);
  ctx.moveTo(size * 0.55, -size * 0.55);
  ctx.lineTo(-size * 0.55, size * 0.55);
  ctx.stroke();
  ctx.restore();
}

function drawCrystalDiamond(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.65, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.65, 0);
  ctx.closePath();
  ctx.fillStyle = rgba(color, alpha * 0.55);
  ctx.fill();
  ctx.strokeStyle = rgba(color, alpha);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

function drawParticleBackground(canvas, title) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Cap DPR on small screens / mobile to cut pixel fill cost without visible loss
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.matchMedia('(max-width: 767px)').matches;
  const dprCap = isCoarse || isNarrow ? 1.25 : 2;
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  if (width < 2 || height < 2) return;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const seed = hashString(title || 'default');
  const rand = createSeededRandom(seed);
  const palette = pickPalette(rand);
  // 0 constellation · 1 lattice · 2 radial · 3 organic clusters
  const family = Math.floor(rand() * 4);

  // ── Background base ──────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, palette.bgDeep);
  bg.addColorStop(0.55, palette.bgMid);
  bg.addColorStop(1, palette.bgDeep);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Seeded ambient light pools (nebula depth)
  const blobCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < blobCount; i++) {
    const bx = rand() * width;
    const by = rand() * height;
    const br = (0.25 + rand() * 0.45) * Math.max(width, height);
    const color = rand() > 0.45 ? palette.glow : palette.accent;
    drawSoftOrb(ctx, bx, by, br, color, 0.07 + rand() * 0.08);
  }

  // Soft horizon wash
  const wash = ctx.createRadialGradient(
    width * (0.3 + rand() * 0.4),
    height * (0.25 + rand() * 0.35),
    0,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.75
  );
  wash.addColorStop(0, rgba(palette.glow, 0.12));
  wash.addColorStop(0.55, rgba(palette.glow, 0.03));
  wash.addColorStop(1, 'transparent');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // ── Optional family underlay geometry ────────────────────────────
  if (family === 1) {
    // Crystalline lattice grid
    const spacing = 36 + Math.floor(rand() * 28);
    const skew = (rand() - 0.5) * 0.35;
    ctx.lineWidth = 0.55;
    for (let x = -spacing; x < width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.strokeStyle = rgba(palette.line, 0.045 + rand() * 0.03);
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height * skew, height);
      ctx.stroke();
    }
    for (let y = -spacing; y < height + spacing; y += spacing) {
      ctx.beginPath();
      ctx.strokeStyle = rgba(palette.line, 0.04 + rand() * 0.025);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + width * skew * 0.4);
      ctx.stroke();
    }
  } else if (family === 2) {
    // Radial spokes + rings from a seeded center
    const cx = width * (0.35 + rand() * 0.3);
    const cy = height * (0.35 + rand() * 0.3);
    const spokes = 8 + Math.floor(rand() * 8);
    for (let i = 0; i < spokes; i++) {
      const ang = (Math.PI * 2 * i) / spokes + rand() * 0.2;
      const len = Math.max(width, height) * (0.35 + rand() * 0.45);
      ctx.beginPath();
      ctx.strokeStyle = rgba(palette.line, 0.05 + rand() * 0.04);
      ctx.lineWidth = 0.7;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
      ctx.stroke();
    }
    const rings = 2 + Math.floor(rand() * 3);
    for (let r = 1; r <= rings; r++) {
      const radius = (Math.min(width, height) * 0.15) * r * (0.85 + rand() * 0.3);
      ctx.beginPath();
      ctx.strokeStyle = rgba(palette.accent, 0.06 + rand() * 0.04);
      ctx.lineWidth = 0.8;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ── Build particle field (3 depth layers) ────────────────────────
  const particles = [];
  const farCount = 40 + Math.floor(rand() * 30);
  const midCount = 38 + Math.floor(rand() * 28);
  const nearCount = 12 + Math.floor(rand() * 10);

  // Cluster centers for organic family
  const clusters = [];
  if (family === 3) {
    const n = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < n; i++) {
      clusters.push({
        x: width * (0.2 + rand() * 0.6),
        y: height * (0.2 + rand() * 0.6),
        r: Math.min(width, height) * (0.12 + rand() * 0.18)
      });
    }
  }

  const place = (layer) => {
    let x = rand() * width;
    let y = rand() * height;
    if (family === 3 && clusters.length && layer !== 'far' && rand() > 0.25) {
      const c = clusters[Math.floor(rand() * clusters.length)];
      const ang = rand() * Math.PI * 2;
      const dist = rand() * c.r;
      x = c.x + Math.cos(ang) * dist;
      y = c.y + Math.sin(ang) * dist;
    }
    if (family === 2 && layer === 'near') {
      // Prefer ring near radial center for hub feel
      const cx = width * 0.5;
      const cy = height * 0.5;
      const ang = rand() * Math.PI * 2;
      const dist = Math.min(width, height) * (0.08 + rand() * 0.28);
      x = cx + Math.cos(ang) * dist * (0.7 + rand());
      y = cy + Math.sin(ang) * dist * (0.7 + rand());
    }
    return { x, y, layer };
  };

  for (let i = 0; i < farCount; i++) {
    const p = place('far');
    particles.push({
      ...p,
      radius: 0.4 + rand() * 1.1,
      alpha: 0.2 + rand() * 0.35,
      color: rand() > 0.5 ? palette.nodeA : palette.nodeB,
      glow: false,
      kind: 'dot'
    });
  }

  for (let i = 0; i < midCount; i++) {
    const p = place('mid');
    const kindRoll = rand();
    particles.push({
      ...p,
      radius: 1.1 + rand() * 2.2,
      alpha: 0.45 + rand() * 0.45,
      color: rand() > 0.55 ? palette.nodeA : (rand() > 0.5 ? palette.nodeB : palette.accent),
      glow: rand() > 0.35,
      kind: kindRoll > 0.88 ? 'spark' : kindRoll > 0.78 ? 'diamond' : 'dot'
    });
  }

  for (let i = 0; i < nearCount; i++) {
    const p = place('near');
    particles.push({
      ...p,
      radius: 2.2 + rand() * 3.5,
      alpha: 0.65 + rand() * 0.35,
      color: rand() > 0.5 ? palette.accent : palette.nodeB,
      glow: true,
      hub: true,
      kind: rand() > 0.7 ? 'diamond' : 'dot'
    });
  }

  // ── Crystalline triangle facets (mid layer only) ─────────────────
  const midPts = particles.filter((p) => p.layer === 'mid' || p.hub);
  const facetBudget = 8 + Math.floor(rand() * 10);
  let facets = 0;
  for (let i = 0; i < midPts.length && facets < facetBudget; i++) {
    for (let j = i + 1; j < midPts.length && facets < facetBudget; j++) {
      for (let k = j + 1; k < midPts.length && facets < facetBudget; k++) {
        const a = midPts[i];
        const b = midPts[j];
        const c = midPts[k];
        const d1 = Math.hypot(a.x - b.x, a.y - b.y);
        const d2 = Math.hypot(b.x - c.x, b.y - c.y);
        const d3 = Math.hypot(c.x - a.x, c.y - a.y);
        const maxD = Math.max(d1, d2, d3);
        const minD = Math.min(d1, d2, d3);
        if (maxD < 95 && minD > 18 && rand() > 0.72) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.closePath();
          ctx.fillStyle = rgba(palette.glow, 0.025 + rand() * 0.035);
          ctx.fill();
          facets++;
        }
      }
    }
  }

  // ── Network connections ──────────────────────────────────────────
  const linkPts = particles.filter((p) => p.layer !== 'far' || rand() > 0.7);
  const maxDist = family === 1 ? 95 : family === 3 ? 120 : 115;

  for (let i = 0; i < linkPts.length; i++) {
    for (let j = i + 1; j < linkPts.length; j++) {
      const a = linkPts[i];
      const b = linkPts[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= maxDist || dist < 1) continue;

      const t = 1 - dist / maxDist;
      const strong = (a.hub || b.hub) && t > 0.45;
      const alpha = strong ? t * 0.42 : t * 0.22;
      const lineColor = strong ? palette.accent : palette.line;

      // Soft glow pass on stronger edges
      if (strong) {
        ctx.beginPath();
        ctx.strokeStyle = rgba(lineColor, alpha * 0.35);
        ctx.lineWidth = 3.2;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = rgba(lineColor, alpha);
      ctx.lineWidth = strong ? 1.15 : 0.65;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  // ── Draw particles ───────────────────────────────────────────────
  particles.forEach((p) => {
    if (p.glow) {
      drawSoftOrb(ctx, p.x, p.y, p.radius * (p.hub ? 6.5 : 4.2), p.color, p.alpha * 0.35);
    }

    if (p.kind === 'spark') {
      drawStarSpark(ctx, p.x, p.y, p.radius * 1.8, p.color, p.alpha);
      // core
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, p.radius * 0.35), 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.color, Math.min(1, p.alpha + 0.15));
      ctx.fill();
    } else if (p.kind === 'diamond') {
      drawCrystalDiamond(ctx, p.x, p.y, p.radius * 1.4, p.color, p.alpha);
      if (p.hub) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = rgba([255, 255, 255], 0.55);
        ctx.fill();
      }
    } else {
      // Soft core + hard center
      if (p.radius > 1.4) {
        drawSoftOrb(ctx, p.x, p.y, p.radius * 2.2, p.color, p.alpha * 0.4);
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.color, p.alpha);
      ctx.fill();
      if (p.hub) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, p.radius * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = rgba([255, 255, 255], 0.5);
        ctx.fill();
      }
    }
  });

  // ── Film grain / micro dust (subtle texture) ─────────────────────
  const dust = 80 + Math.floor(rand() * 60);
  for (let i = 0; i < dust; i++) {
    const x = rand() * width;
    const y = rand() * height;
    ctx.fillStyle = rgba([255, 255, 255], 0.015 + rand() * 0.035);
    ctx.fillRect(x, y, 1, 1);
  }

  // ── Premium vignette + top sheen ─────────────────────────────────
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(0.65, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  const sheen = ctx.createLinearGradient(0, 0, 0, height * 0.55);
  sheen.addColorStop(0, rgba(palette.nodeA, 0.06));
  sheen.addColorStop(1, 'transparent');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);
}

function paintCanvas(canvas) {
  const wrap = canvas.closest('[data-rumble-embed]');
  if (wrap && wrap.dataset.loaded === 'true') return;

  const title =
    canvas.dataset.title ||
    canvas.closest('.video-card, .dive-video-card, .home-video-card')?.querySelector('h3')?.textContent ||
    wrap?.dataset?.videoTitle ||
    'default';
  drawParticleBackground(canvas, String(title).trim());
  canvas.dataset.painted = 'true';
}

/** Draw only when visible (or force for a scoped root after DOM rebuild). */
function initParticleBackgrounds(root = document, options = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !options.force) {
    // Still paint one static frame for reduced-motion users (no animation loop exists)
  }

  const scope = root && root.querySelectorAll ? root : document;
  const canvases = Array.from(scope.querySelectorAll('.particle-canvas'));
  if (!canvases.length) return;

  // Scoped re-init (e.g. after video poster restore) — paint immediately
  if (options.force || root !== document) {
    canvases.forEach(paintCanvas);
    return;
  }

  if (!('IntersectionObserver' in window)) {
    canvases.forEach(paintCanvas);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        paintCanvas(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '120px 0px', threshold: 0.05 }
  );

  canvases.forEach((canvas) => {
    if (canvas.dataset.painted === 'true') return;
    observer.observe(canvas);
  });
}

let resizeTimeout;
function onResizePaint() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    document.querySelectorAll('.particle-canvas[data-painted="true"]').forEach((canvas) => {
      // Allow repaint at new size
      delete canvas.dataset.painted;
      paintCanvas(canvas);
    });
  }, 220);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initParticleBackgrounds());
} else {
  initParticleBackgrounds();
}
window.addEventListener('resize', onResizePaint, { passive: true });

window.initParticleBackgrounds = (root) => initParticleBackgrounds(root || document, { force: !!root && root !== document });
