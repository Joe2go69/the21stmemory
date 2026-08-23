/**
 * Rebalance quiz option lengths so "longest = correct" is not a reliable tell.
 *
 * Strategy (no stock / meta filler tails):
 * 1. Tighten long correct options only at safe clause boundaries.
 * 2. Expand short wrong options by elaborating *that wrong claim* with
 *    content-shaped second clauses — not corpus-wide padding or meta lines
 *    like "a full alternative reading…".
 * 3. Stable shuffle of A–D so letter mix stays mixed.
 *
 * Usage:
 *   node scripts/rebalance-quiz-length.js --all-alice
 *   node scripts/rebalance-quiz-length.js data/quizzes/alice/grey-ets.json
 *   node scripts/rebalance-quiz-length.js --dry-run
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LABELS = ['A', 'B', 'C', 'D'];

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ensurePeriod(t) {
  t = (t || '').replace(/[ \t]{2,}/g, ' ').trim();
  if (!t) return t;
  if (/^(true|false)$/i.test(t)) return t;
  if (t.length <= 12) return t;
  if (!/[.!?…]$/.test(t)) t += '.';
  return t;
}

function stripTerminal(t) {
  return (t || '').replace(/[.!?…]+$/g, '').trim();
}

/** Reject cuts that leave dangling grammar or mid-list fragments. */
function isIncomplete(t) {
  const s = (t || '').trim().replace(/[.!?…]+$/g, '');
  if (!s || s.length < 12) return true;
  if (/[,;:—–-]\s*$/.test(s)) return true;
  // Dangling function words only (content words like "only" / "under" are fine)
  if (
    /\b(and|or|the|a|an|of|to|for|with|then|than|that|which|who|whose|their|its|from|into|onto|by|as|at|in|on|is|are|was|were|be|been|being|this|these|those|such|also|just|not|nor|but|if|when|while|where|because|so|yet|both|either|neither|including|via|per|vs|versus|between|among|within|without|about|over|under|after|before|during|through|across|against|toward|towards|upon|whether)\s*$/i.test(
      s
    )
  ) {
    return true;
  }
  // Mid-list hang: "educational, financial"
  if (
    /,\s+(educational|financial|religious|political|military|historical|spiritual|physical|emotional|global|local|public|private|modern|ancient)\s*$/i.test(
      s
    )
  ) {
    return true;
  }
  return false;
}

function acceptCut(candidate, original, maxOk, minKeep) {
  if (!candidate) return null;
  let c = candidate.replace(/[,;:\s—–-]+$/g, '').trim();
  if (c.length < minKeep) return null;
  if (c.length > original.length * 0.94) return null; // barely shortened
  if (isIncomplete(c)) return null;
  // Don't gut to a vague stub — but allow strong cuts when original is a wall of text
  if (c.length < original.length * 0.28 && original.length > 160) return null;
  if (c.length < 40) return null;
  return ensurePeriod(c);
}

/**
 * Tighten a long correct option to a complete core claim.
 */
function tightenCorrect(text, peerTarget) {
  let t = (text || '').trim();
  if (!t) return t;

  const maxOk = Math.max(peerTarget + 14, Math.floor(peerTarget * 1.15), 80);
  if (t.length <= maxOk) return ensurePeriod(t);

  const minKeep = Math.min(60, Math.max(48, Math.floor(peerTarget * 0.7)));

  // 1) Semicolon: keep first clause (or first two if first is thin)
  if (t.includes(';')) {
    const parts = t.split(';').map((s) => s.trim()).filter(Boolean);
    const one = acceptCut(parts[0], t, maxOk, minKeep);
    if (one && one.length <= maxOk * 1.3) return one;
    if (parts.length >= 2) {
      const two = acceptCut(parts.slice(0, 2).join('; '), t, maxOk, minKeep);
      if (two && two.length <= maxOk * 1.35) return two;
    }
  }

  // 2) Em/en dash — prefer HEAD — APPOSITIVE when double-dashed list
  if (/[—–]/.test(t)) {
    const parts = t.split(/\s*[—–]\s*/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3 && parts[1].length <= 90) {
      // "Constructs — Religion, Finance, and X — engineered…"
      const headList = acceptCut(`${parts[0]} — ${parts[1]}`, t, maxOk, minKeep);
      if (headList) return headList;
    }
    const head = acceptCut(parts[0], t, maxOk, minKeep);
    // Only take bare head if it still carries real content (≥55% of a long original, or ≥70 chars)
    if (head && (head.length >= 70 || head.length >= t.length * 0.5)) return head;
  }

  // 3) Multi-sentence: keep first (or first two)
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= 2) {
    const one = acceptCut(sentences[0], t, maxOk, minKeep);
    if (one) return one;
    if (sentences.length >= 3) {
      const two = acceptCut(sentences.slice(0, 2).join(' '), t, maxOk, minKeep);
      if (two) return two;
    }
  }

  // 4) Trailing elaboration (relative / purpose clauses) — only when head is solid
  const trailingRes = [
    /^(.*?)(?:,?\s+because\b.+)$/i,
    /^(.*?)(?:,?\s+which\s+(?:solidifies|would|is|are|was|were|serves?|acts?|leaves?|ensures?|requires?|binds?|hides?|feeds?|makes?|keeps?|allows?|replaces?|dictates?|generates?|binds?)\b.+)$/i,
    /^(.*?)(?:,?\s+(?:leaving|ensuring|requiring|making|treating|offering|framing|generating|binding|erasing|supplying|wiping|rebooting)\b.+)$/i,
    /^(.*?)(?:,?\s+so\s+that\b.+)$/i,
  ];
  for (const re of trailingRes) {
    const m = t.match(re);
    if (m) {
      const hit = acceptCut(m[1], t, maxOk, minKeep);
      if (hit && hit.length >= 70) return hit;
    }
  }

  // 5) Last resort: cut near target at a SAFE boundary (not bare ", and")
  if (t.length > maxOk * 1.4) {
    const windowEnd = Math.min(t.length, Math.floor(maxOk * 1.25));
    const window = t.slice(0, windowEnd);
    const patterns = [
      '; ',
      ' — ',
      ' – ',
      ', which ',
      ', leaving ',
      ', ensuring ',
      ', requiring ',
      ', generating ',
      ', erasing ',
      ', because ',
      '. ',
    ];
    let best = -1;
    for (const p of patterns) {
      const i = window.lastIndexOf(p);
      if (i >= minKeep && i > best) best = i;
    }
    if (best >= minKeep) {
      const hit = acceptCut(t.slice(0, best), t, maxOk, minKeep);
      if (hit) return hit;
    }
  }

  return ensurePeriod(t);
}

/**
 * Content-shaped expansions for a wrong claim.
 * Avoid meta lines and banned stock tails. Prefer clauses that double down on
 * *this* distractor's idea rather than a generic pad used on every option.
 */
function buildWrongExpansions(base) {
  const b = stripTerminal(base);
  const out = [];

  // --- Surface patterns ---
  if (/^only\b/i.test(b)) {
    out.push(
      `${b}, with every larger system treated as clean, uninvolved, or beside the point`
    );
    out.push(
      b.replace(/^only\s+/i, 'Nothing beyond ') +
        ', and no coordinated multi-system design behind it'
    );
  }

  if (/\bnever\b/i.test(b)) {
    out.push(`${b} in any density, cycle, or historical configuration`);
  }

  if (
    /\b(minor|simple|ordinary|accidental|random|holiday|tourist|marketing|subway|leisure)\b/i.test(
      b
    )
  ) {
    out.push(`${b}, disconnected from any deliberate long-game control design`);
  }

  if (/\b(pure|uncorrupted|trustworthy|benevolent|harmless)\b/i.test(b)) {
    out.push(`${b}, so no severance from that system would ever be required`);
  }

  // --- Agent / topic (only when the term is central, not a passing mention) ---
  if (
    /^(the\s+)?g\.?a\.?a\.?\b/i.test(b) ||
    /^galactic ancestral/i.test(b) ||
    /\bwhite hats?\b/i.test(b)
  ) {
    out.push(
      `${b}, casting liberating forces as operators of the prison rather than its dismantlers`
    );
  }

  if (
    /\b(orphan trains?|manufactured (children|population)|clone crop|d\.?u\.?m\.?b)/i.test(
      b
    )
  ) {
    out.push(
      `${b}, with no manufactured population pipeline and no blank-slate reboot`
    );
  }

  if (
    /\b(amnesia vortex|reincarnation trap|soul (trap|recycle|portal)|grey ets?)\b/i.test(
      b
    )
  ) {
    out.push(
      `${b}, with souls moving freely and no trap logistics at death or birth`
    );
  }

  if (
    /\b(money|banking|debt slavery|retirement|currency|finance string)\b/i.test(b) ||
    (/finance/i.test(b) && b.length < 100)
  ) {
    out.push(
      `${b}, while spiritual attention and institutional trust stay fully intact`
    );
  }

  if (
    /\b(false deities|worship|string 1|religion as)\b/i.test(b) ||
    (/^religion\b/i.test(b) && b.length < 100)
  ) {
    out.push(`${b}, leaving cognitive autonomy untouched and unmediated`);
  }

  if (/\b(33rd degree|smithsonian|blood rite|freemasonry as)\b/i.test(b)) {
    out.push(
      `${b}, with no blackmail structure and no proxy role for non-human overlords`
    );
  }

  // Geology/astronomy line only for wrongs that *are about* landscape/sky claims
  if (
    /\b(ordinary geology|natural disaster|tectonic|globe earth|heliocentr|just weather|standard astronomy|space is empty)\b/i.test(
      b
    ) ||
    (/\b(mud-flood|firmament|flat earth|projection dome)\b/i.test(b) &&
      /\b(natural|ordinary|normal|simple|just|only)\b/i.test(b))
  ) {
    out.push(
      `${b}, with no artificial sky, no enclosed realm, and no engineered reset scarring`
    );
  }

  if (/\bwith no\b/i.test(b) && b.length < 120) {
    out.push(`${b} and no hidden harvest architecture behind the scenes`);
  }

  if (/^(to|by|for)\s+/i.test(b) && b.length < 110) {
    out.push(`${b}, with no deeper inversion layered underneath that step`);
  }

  // Large varied pool so one stock ending never becomes a reverse tell
  const universals = [
    'with no further layer required beyond that account',
    'and that is treated as the entire mechanism',
    'without a larger engineered system underneath',
    'stopping the explanation at that boundary alone',
    'held as a complete closed account of the events',
    'as if no adjacent systems participated at all',
    'keeping every neighboring mechanism off the board',
    'and declining any account that reaches past that point',
    'framed only in those terms with nothing added',
    'as a sealed explanation that needs no sequel clause',
    'with the surrounding architecture waved away as irrelevant',
    'and with every other driver dismissed as coincidence',
    'read as a self-limited cause with no upstream design',
    'as though that single factor closed the case',
    'without extending the chain into harvest or inversion logistics',
    'and treating side systems as noise rather than design',
    'as the sole operative factor in the outcome',
    'with broader scaffolding left unnamed and unexamined',
    'stopping short of any multi-layered control model',
    'as a one-factor story with a tidy edge',
    'and insisting the rest of the matrix had no hand in it',
    'without assigning intent beyond that surface reading',
    'kept inside a minimal local explanation only',
    'as if complexity past that line were imaginary',
  ];
  for (const u of universals) {
    // Grammatical join: prefer comma unless universal starts with "and"/"without"/"as"/"with"/"keeping"/"framed"/"read"/"held"/"stopping"/"kept"
    if (/^(and|without|as|with|keeping|framed|read|held|stopping|kept)\b/i.test(u)) {
      out.push(`${b}, ${u}`);
    } else {
      out.push(`${b}, ${u}`);
    }
  }

  // Prefer unique strings
  return [...new Set(out.map((s) => s.replace(/[ \t]{2,}/g, ' ').trim()))].filter(
    (s) => s.length > b.length + 8
  );
}

function expandWrong(text, targetLen, _rationale, rand) {
  let t = (text || '').trim();
  if (!t) return t;
  // Leave alone when already close to target
  if (t.length >= targetLen * 0.92) return ensurePeriod(t);
  if (t.length <= 18 || /^(true|false)$/i.test(t)) return t;
  // Short noun-phrase labels: leave parallel (do not bolt on a formula clause)
  if (t.length < 45 && !/\b(is|are|was|were|to |by |that |which |from |with |used |made |created |serves?|acts?|runs?|means?)\b/i.test(t)) {
    return ensurePeriod(t);
  }
  // Tiny gaps only: not worth a clause
  if (targetLen - t.length < 12) return ensurePeriod(t);

  const base = stripTerminal(t);
  const candidates = buildWrongExpansions(base);
  if (!candidates.length) return ensurePeriod(t);

  // Prefer pattern-specific candidates (shorter index in list before universals bulk)
  // Score by length fit + light randomness; slight bonus for earlier (more specific) candidates
  let best = base;
  let bestScore = Infinity;
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    if (c.length < base.length + 10) continue;
    const overshoot = Math.max(0, c.length - targetLen * 1.18);
    const undershoot = Math.max(0, targetLen * 0.84 - c.length);
    const specificityBonus = i < 8 ? -6 : 0; // prefer early pattern hits
    const score = overshoot * 1.5 + undershoot + rand() * 8 + i * 0.05 + specificityBonus;
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  }

  if (best.length > targetLen * 1.5 && targetLen > 55) {
    const cutAt = best.lastIndexOf(', ', Math.floor(targetLen * 1.2));
    if (cutAt > base.length) {
      const cut = best.slice(0, cutAt);
      if (!isIncomplete(cut)) best = cut;
    }
  }

  return ensurePeriod(best);
}

/** Repair known mid-claim truncations left by earlier hard-cut pass. */
const TRUNCATION_REPAIRS = {
  'evidence-of-resets::25': {
    match:
      "97% (NPCs and sleepers) evaporate; trusted institutions' genocidal child-sacrificing nature triggers mass shock; G.A.A.",
    text: "97% (NPCs and sleepers) evaporate; trusted institutions' genocidal child-sacrificing nature triggers mass shock; G.A.A. hardwires anti-compliance trauma so the occupation collapses and true souls reclaim the realm.",
  },
  'simulation-reality::24': {
    match:
      'A highly traumatizing Fake Alien Invasion projected into the sky via Project Bluebeam holographics; at climax the G.A.A.',
    text: 'A highly traumatizing Fake Alien Invasion projected into the sky via Project Bluebeam holographics; at climax the G.A.A. permanently deactivates the Projection Dome so the sky tears into pixelation and the bright white true plain.',
  },
  'resets-hidden-history::25': {
    match:
      'Project Bluebeam Fake Alien Invasion, EBS exposing satanic control and child sacrifice, then a 30-second EMF Flash; G.A.A.',
    text: 'Project Bluebeam Fake Alien Invasion, EBS exposing satanic control and child sacrifice, then a 30-second EMF Flash; G.A.A. peels Overlays and shuts the Projection Dome so the realm pixelates and 97% NPCs vaporize.',
  },
  'parasitic-takeover::24': {
    match:
      '8th Reset (15-minute cities, social credit, forced vaccinations, FEMA slaughter) is intercepted and neutralized; G.A.A.',
    text: '8th Reset (15-minute cities, social credit, forced vaccinations, FEMA slaughter) is intercepted and neutralized; G.A.A. runs the Fake Alien Invasion, switches off the projection dome, and pixelates the simulated environment.',
  },
};

function isTrueFalseQuestion(question, options) {
  if (/^\s*true\s+or\s+false\b/i.test(question || '')) return true;
  const texts = (options || []).map((o) => String(o.text || '').trim());
  return (
    texts.length >= 2 &&
    texts.every((t) => /^(true|false)(\s*[—–\-:].*)?$/i.test(t))
  );
}

function collapseTrueFalse(q) {
  const opts = q.options || [];
  const correct = opts.find((o) => o.isCorrect);
  if (!correct) throw new Error(`T/F Q${q.number}: no correct option`);
  const polMatch = String(correct.text || '')
    .trim()
    .match(/^(true|false)\b/i);
  if (!polMatch) {
    throw new Error(`T/F Q${q.number}: correct option must start with True or False`);
  }
  const correctPol = polMatch[1].toLowerCase() === 'true' ? 'True' : 'False';
  const wrongPol = correctPol === 'True' ? 'False' : 'True';
  const wrong =
    opts.find(
      (o) =>
        !o.isCorrect &&
        new RegExp(`^${wrongPol}\\b`, 'i').test(String(o.text || '').trim())
    ) || opts.find((o) => !o.isCorrect);
  if (!wrong) throw new Error(`T/F Q${q.number}: missing opposite polarity`);

  return {
    ...q,
    options: [
      {
        label: 'A',
        text: 'True',
        isCorrect: correctPol === 'True',
        rationale: correctPol === 'True' ? correct.rationale : wrong.rationale,
      },
      {
        label: 'B',
        text: 'False',
        isCorrect: correctPol === 'False',
        rationale: correctPol === 'False' ? correct.rationale : wrong.rationale,
      },
    ],
    correctAnswer: correctPol === 'True' ? 'A' : 'B',
  };
}

function rebalanceQuestion(q, quizId) {
  if (isTrueFalseQuestion(q.question, q.options)) {
    return {
      question: collapseTrueFalse(q),
      tightened: false,
      expanded: 0,
    };
  }

  const seed = hashSeed(`${quizId}::${q.number}::len-rebalance-v6`);
  const rand = mulberry32(seed);

  let options = (q.options || []).map((o) => ({
    label: o.label,
    text: String(o.text || '').trim(),
    isCorrect: !!o.isCorrect,
    rationale: String(o.rationale || '').trim(),
  }));

  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`${quizId} Q${q.number}: no correct option`);

  const repair = TRUNCATION_REPAIRS[`${quizId}::${q.number}`];
  if (repair && correct.text === repair.match) {
    correct.text = repair.text;
  }

  const wrongs = options.filter((o) => !o.isCorrect);
  const wrongLens = wrongs.map((o) => o.text.length).sort((a, b) => a - b);
  const medianWrong =
    wrongLens.length === 0 ? 80 : wrongLens[Math.floor(wrongLens.length / 2)];
  const maxWrong = wrongLens.length ? wrongLens[wrongLens.length - 1] : 80;

  const peerTarget = Math.max(medianWrong, Math.min(maxWrong + 10, 170));

  const beforeCorrect = correct.text;
  correct.text = tightenCorrect(correct.text, peerTarget);
  const tightened = correct.text.length < beforeCorrect.length - 8;

  // Target wrongs near the (possibly tightened) correct.
  // Do NOT floor at 70 when the correct option itself is short (e.g. "Gateway-10") —
  // padding short parallel labels with formula clauses looks worse than leaving them short.
  const targetWrong =
    correct.text.length < 55
      ? correct.text.length
      : Math.max(70, Math.min(Math.floor(correct.text.length * 0.98), 200));

  let expanded = 0;
  options = options.map((o) => {
    if (o.isCorrect) return o;
    const before = o.text;
    const next = expandWrong(o.text, targetWrong, o.rationale, rand);
    if (next.length > before.length + 12) expanded++;
    return { ...o, text: next };
  });

  // Second tighten if correct still towers over expanded wrongs
  const newWrongMax = Math.max(
    ...options.filter((o) => !o.isCorrect).map((o) => o.text.length),
    40
  );
  if (correct.text.length > newWrongMax * 1.2) {
    const again = tightenCorrect(correct.text, newWrongMax);
    if (again.length < correct.text.length - 5 && !isIncomplete(stripTerminal(again))) {
      correct.text = again;
    }
  }
  // Final structural pass: if still uniquely much longer and has a semicolon, keep first clause
  {
    const others = options.filter((o) => !o.isCorrect).map((o) => o.text.length);
    const oMax = Math.max(...others, 40);
    if (correct.text.length > oMax * 1.35 && correct.text.includes(';')) {
      const first = correct.text.split(';')[0].trim();
      if (first.length >= 55 && !isIncomplete(first)) {
        correct.text = ensurePeriod(first);
      }
    }
  }

  options = shuffle(options, rand).map((o, i) => ({
    ...o,
    label: LABELS[i],
  }));

  const newCorrect = options.find((o) => o.isCorrect);

  return {
    question: {
      ...q,
      options,
      correctAnswer: newCorrect.label,
    },
    tightened: tightened || correct.text.length < beforeCorrect.length - 8,
    expanded,
  };
}

function loadQuizPaths(argv) {
  const args = argv.slice(2).filter((a) => !a.startsWith('--'));
  if (args.length === 0 || argv.includes('--all-alice')) {
    const dir = path.join(ROOT, 'data', 'quizzes', 'alice');
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(dir, f));
  }
  return args.map((a) => (path.isAbsolute(a) ? a : path.join(ROOT, a)));
}

function lengthStats(quiz) {
  let total = 0;
  let uniqueLongest = 0;
  let longestInclTie = 0;
  const letters = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of quiz.questions || []) {
    total++;
    letters[q.correctAnswer] = (letters[q.correctAnswer] || 0) + 1;
    const opts = q.options || [];
    const lens = opts.map((o) => ({
      len: (o.text || '').length,
      c: !!o.isCorrect,
    }));
    const max = Math.max(...lens.map((o) => o.len));
    const correct = lens.find((o) => o.c);
    if (!correct) continue;
    const maxes = lens.filter((o) => o.len === max);
    if (correct.len === max) {
      longestInclTie++;
      if (maxes.length === 1) uniqueLongest++;
    }
  }
  return { total, uniqueLongest, longestInclTie, letters };
}

/** Residual quality checks after rebalance */
function qualityFlags(quiz, file) {
  const flags = [];
  const badMeta = [
    'full alternative reading',
    'self-contained account',
    'complete explanation of what occurred',
    'limited reading is taken as sufficient',
    'cover story that cannot',
    'collapses once the inverted',
    'natural or official account of events',
    'control matrix intact and the population asleep',
    'parasitic inversion had never engineered',
    'deliberate design of the subjugation systems',
    'prison architecture as if it were ordinary',
  ];
  for (const q of quiz.questions || []) {
    for (const o of q.options || []) {
      const t = o.text || '';
      for (const ph of badMeta) {
        if (t.toLowerCase().includes(ph)) {
          flags.push({ file, q: q.number, label: o.label, type: 'meta', t: t.slice(0, 120) });
          break;
        }
      }
      // Flag clear mid-phrase hangers (not G.A.A. / acronyms)
      const bare = t.trim().replace(/[.!?…]+$/g, '');
      if (t.length > 40 && /[,;:—–-]\s*$/.test(t.trim())) {
        flags.push({ file, q: q.number, label: o.label, type: 'incomplete', t: t.slice(0, 140) });
      } else if (
        t.length > 40 &&
        /\b(and|or|the|a|an|of|to|for|with|then|than|that|which)\s*$/i.test(bare) &&
        !/\bG\.?A\.?A\.?\s*$/i.test(bare)
      ) {
        flags.push({ file, q: q.number, label: o.label, type: 'incomplete', t: t.slice(0, 140) });
      } else if (/[;,—–]\s*(the\s+)?G\.?A\.?A\.?\s*$/i.test(bare)) {
        // "; G.A.A." with no predicate — truncated mid-claim
        flags.push({ file, q: q.number, label: o.label, type: 'truncated-gaa', t: t.slice(0, 140) });
      }
    }
  }
  return flags;
}

function rebalanceQuizFile(quizPath, { dry = false } = {}) {
  const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
  const id = quiz.id || quiz.topicId || path.basename(quizPath, '.json');
  const before = lengthStats(quiz);

  let tightened = 0;
  let expanded = 0;
  quiz.questions = (quiz.questions || []).map((q) => {
    const r = rebalanceQuestion(q, id);
    if (r.tightened) tightened++;
    expanded += r.expanded;
    return r.question;
  });

  const after = lengthStats(quiz);
  if (!dry) {
    fs.writeFileSync(quizPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
  }
  return { quiz, before, after, tightened, expanded };
}

function main() {
  const dry = process.argv.includes('--dry-run');
  const paths = loadQuizPaths(process.argv);
  let files = 0;
  let totalTightened = 0;
  let totalExpanded = 0;
  let beforeUL = 0;
  let afterUL = 0;
  let totalQ = 0;
  const allFlags = [];

  for (const p of paths) {
    if (!fs.existsSync(p)) {
      console.warn('Skip missing', p);
      continue;
    }
    const { quiz, before, after, tightened, expanded } = rebalanceQuizFile(p, { dry });
    beforeUL += before.uniqueLongest;
    afterUL += after.uniqueLongest;
    totalQ += after.total;
    totalTightened += tightened;
    totalExpanded += expanded;
    files++;

    allFlags.push(...qualityFlags(quiz, path.basename(p)));

    console.log(
      path.relative(ROOT, p),
      `UL ${before.uniqueLongest}/${before.total}→${after.uniqueLongest}/${after.total}`,
      `letters ${JSON.stringify(after.letters)}`,
      `tightenedQ=${tightened}`,
      `expandedOpts=${expanded}`,
      dry ? '(dry-run)' : ''
    );
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Files: ${files}${dry ? ' (dry-run, not written)' : ''}`);
  console.log(
    `Unique-longest-correct: ${beforeUL}/${totalQ} (${((100 * beforeUL) / Math.max(totalQ, 1)).toFixed(1)}%) → ${afterUL}/${totalQ} (${((100 * afterUL) / Math.max(totalQ, 1)).toFixed(1)}%)`
  );
  console.log(`Questions with tightened correct: ${totalTightened}`);
  console.log(`Wrong options expanded: ${totalExpanded}`);
  console.log(`Random baseline for unique-longest among 4: ~25%`);
  console.log(`Quality flags: ${allFlags.length}`);
  if (allFlags.length) {
    const byType = {};
    for (const f of allFlags) byType[f.type] = (byType[f.type] || 0) + 1;
    console.log('Flag types:', byType);
    allFlags.slice(0, 12).forEach((f) => {
      console.log(`  ${f.file} Q${f.q}${f.label} [${f.type}] ${f.t}`);
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = { rebalanceQuizFile, rebalanceQuestion };
