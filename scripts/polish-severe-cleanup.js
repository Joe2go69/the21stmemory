/**
 * Strip formulaic auto-balance tails, then hand-fix any severe cases that reappear.
 * Run: node scripts/polish-severe-cleanup.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data', 'quizzes', 'alice');

const FORMULA_TAILS = [
  /,?\s*offered as a complete local story that needs no wider harvest architecture to make sense\.?/gi,
  /,?\s*so any multi-layered control model is treated as unnecessary speculation about the mechanism\.?/gi,
  /,?\s*keeping the account sealed at that surface reading with no upstream designer required\.?/gi,
  /,?\s*and framing every larger system as coincidence rather than coordinated inversion work\.?/gi,
  /,?\s*with the rest of the matrix dismissed as noise that never shaped the actual outcome\.?/gi,
  /\s*—\s*offered as a complete local story that needs no wider harvest architecture to make sense\.?/gi,
  /\s*—\s*so any multi-layered control model is treated as unnecessary speculation about the mechanism\.?/gi,
  /\s*—\s*keeping the account sealed at that surface reading with no upstream designer required\.?/gi,
];

// Off-topic bolts that autoBalance sometimes attached via weak keyword hits
const OFFTOPIC_TAILS = [
  /,?\s*with souls moving freely after death and no Vatican or Sun-portal processing queue at all\.?/gi,
  /,?\s*with no manufactured population pipeline and no blank-slate re-education apparatus afterward\.?/gi,
  /,?\s*as though liberating forces ran harvest logistics instead of dismantling the prison grid\.?/gi,
  /,?\s*so narrative control through prestige institutions is dismissed as irrelevant charity noise\.?/gi,
  /,?\s*with no loosh broadcast role and no holographic cover over any command deck hardware\.?/gi,
  /,?\s*so biological inversion of intuition is treated as impossible under any delivery system\.?/gi,
  /,?\s*with no demographic purge of memory-holders and no cover story for free-energy removal\.?/gi,
  /,?\s*while spiritual attention stays free and institutional money myths hold no binding power\.?/gi,
  /,?\s*leaving cognitive autonomy untouched and requiring no uninstallation before Scare Events\.?/gi,
  /,?\s*with no proxy role for non-human overlords and no vault pipeline for confiscated evidence\.?/gi,
  /,?\s*as if ambient vibration, sky projection, and node architecture played no part in control\.?/gi,
  /,?\s*leaving parasites, resets, and density tech entirely outside the explanation of events\.?/gi,
  /,?\s*treating the outcome as ordinary chance rather than engineered multi-generational design\.?/gi,
];

function P(t) {
  t = String(t)
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .replace(/[,;:\s—–-]+$/g, '')
    .trim();
  if (t.length > 12 && !/[.!?…]$/.test(t)) t += '.';
  return t;
}

function stripFormulas(text) {
  let t = text;
  let prev;
  let guard = 0;
  do {
    prev = t;
    for (const re of FORMULA_TAILS) t = t.replace(re, '');
    for (const re of OFFTOPIC_TAILS) t = t.replace(re, '');
    t = t.replace(/[ \t]{2,}/g, ' ').trim();
    guard++;
  } while (t !== prev && guard < 10);
  return P(t);
}

/**
 * Hand rewrites for cases that become severe again after strip.
 * Key: id::q
 */
const FIXUPS = {
  // Will be filled after strip scan if needed — pass runs twice conceptually
};

function isSevere(q) {
  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  if (!cor || !wrongs.length) return false;
  const oMax = Math.max(...wrongs.map((o) => o.text.length));
  const max = Math.max(...q.options.map((o) => o.text.length));
  const ul =
    cor.text.length === max &&
    q.options.filter((o) => o.text.length === max).length === 1;
  return ul && cor.text.length - oMax >= 50;
}

/** Expand a wrong claim into a fuller parallel sentence without formula. */
function expandWrongNatural(text, question, correctText) {
  let t = text.replace(/[.!?…]+$/g, '').trim();
  if (t.length >= 130) return P(t);

  // Pattern-based natural expansions using the wrong claim itself
  if (/^only\b/i.test(t)) {
    return P(
      `${t}, with every broader engineered system treated as irrelevant to the outcome`
    );
  }
  if (/\bnever\b/i.test(t)) {
    return P(`${t} across any density, cycle, or historical configuration of the realm`);
  }
  if (/\bG\.?A\.?A\.?\b/i.test(t) || /White Hat/i.test(t)) {
    return P(
      `${t}, casting liberating forces as operators of the prison rather than its dismantlers`
    );
  }
  if (/\b(natural|accident|random|ordinary|pure)\b/i.test(t)) {
    return P(
      `${t}, disconnected from any deliberate multi-generational control design behind events`
    );
  }
  if (/\b(no link|with no|without any)\b/i.test(t)) {
    return P(
      `${t}, remaining a self-contained alternative that never invokes harvest or inversion logistics`
    );
  }

  // Question-type mirrors
  if (/what is|what are|who are|who is/i.test(question || '')) {
    return P(
      `${t} — presented as the full identity of the thing with no deeper parasitic layer`
    );
  }
  if (/how does|how did|how do|why /i.test(question || '')) {
    return P(
      `${t}, which would fully account for the outcome without any wider inversion architecture`
    );
  }

  // Generic but still claim-bound
  return P(
    `${t}, taken as a complete alternative reading that stops at that surface mechanism`
  );
}

function tightenCorrect(text, peerMax) {
  let t = text.trim();
  const maxOk = Math.max(peerMax + 15, 140);
  if (t.length <= maxOk) return P(t);

  if (t.includes(';')) {
    const first = t.split(';')[0].trim();
    if (first.length >= 70 && first.length <= maxOk + 20) return P(first);
  }
  if (/[—–]/.test(t)) {
    const parts = t.split(/\s*[—–]\s*/);
    if (parts[0].length >= 70 && parts[0].length <= maxOk + 15) return P(parts[0]);
    if (parts.length >= 2) {
      const two = `${parts[0]} — ${parts[1]}`.trim();
      if (two.length <= maxOk + 25 && two.length < t.length) return P(two);
    }
  }
  // Cut trailing ", including/locking/forcing…"
  const m = t.match(
    /^(.*?)(?:,\s+(?:including|locking|forcing|converting|installing|wrapping|so that|while)\b.+)$/i
  );
  if (m && m[1].length >= 70) return P(m[1]);

  return P(t);
}

function rebalanceQuestion(q) {
  // First strip formulas from all options
  for (const o of q.options) {
    o.text = stripFormulas(o.text);
  }

  if (!isSevere(q)) return false;

  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);

  // Expand wrongs first with natural claim-bound clauses
  for (const o of wrongs) {
    o.text = expandWrongNatural(o.text, q.question, cor.text);
  }

  const oMax = Math.max(...wrongs.map((o) => o.text.length));
  cor.text = tightenCorrect(cor.text, oMax);

  // If still severe, expand wrongs once more with a short concrete finisher from the wrong text
  if (isSevere(q)) {
    for (const o of wrongs) {
      let t = o.text.replace(/[.!?…]+$/g, '');
      if (t.length < cor.text.length - 30) {
        // Mirror structure of correct length with wrong-specific detail restatement
        const words = t.split(/\s+/);
        if (words.length >= 8) {
          o.text = P(
            `${t}, rather than any account that rejects this limited reading of the same question`
          );
        }
      }
    }
    const oMax2 = Math.max(...wrongs.map((o) => o.text.length));
    if (cor.text.length > oMax2 + 40) {
      cor.text = tightenCorrect(cor.text, oMax2);
    }
  }

  return true;
}

function main() {
  let stripped = 0;
  let rebalanced = 0;
  let severe = 0;
  let ul = 0;
  let total = 0;
  const left = [];

  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const fp = path.join(DIR, f);
    const quiz = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let changed = false;

    for (const q of quiz.questions || []) {
      const before = JSON.stringify(q.options.map((o) => o.text));
      // Always strip formulas
      for (const o of q.options) {
        const next = stripFormulas(o.text);
        if (next !== o.text) {
          o.text = next;
          stripped++;
          changed = true;
        }
      }
      if (isSevere(q)) {
        rebalanceQuestion(q);
        rebalanced++;
        changed = true;
      }
      const after = JSON.stringify(q.options.map((o) => o.text));
      if (before !== after) changed = true;
    }

    if (changed) fs.writeFileSync(fp, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
  }

  // Final scan
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const quiz = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    for (const q of quiz.questions || []) {
      total++;
      const cor = q.options.find((o) => o.isCorrect);
      const wrongs = q.options.filter((o) => !o.isCorrect);
      if (!cor) continue;
      const oMax = Math.max(...wrongs.map((o) => o.text.length), 0);
      const max = Math.max(...q.options.map((o) => o.text.length));
      const uniq =
        cor.text.length === max &&
        q.options.filter((o) => o.text.length === max).length === 1;
      if (uniq) ul++;
      if (uniq && cor.text.length - oMax >= 50) {
        severe++;
        left.push({
          id: quiz.id,
          q: q.number,
          c: cor.text.length,
          oMax,
          spread: cor.text.length - oMax,
          correct: cor.text.slice(0, 100),
          wrongs: wrongs.map((o) => o.text.slice(0, 90)),
        });
      }
    }
  }

  // Phrase audit
  const phrases = [
    'offered as a complete local story',
    'multi-layered control model is treated',
    'keeping the account sealed at that surface',
    'cover story that cannot',
    'collapses once the inverted',
    'rather than any account that rejects this limited reading',
  ];
  const hits = {};
  for (const p of phrases) hits[p] = 0;
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const p of phrases) {
      let i = 0;
      while ((i = raw.indexOf(p, i)) !== -1) {
        hits[p]++;
        i += p.length;
      }
    }
  }

  console.log('Stripped formula instances:', stripped);
  console.log('Rebalanced after strip:', rebalanced);
  console.log(`UL: ${ul}/${total} (${((100 * ul) / total).toFixed(1)}%)`);
  console.log('Severe remaining:', severe);
  left.slice(0, 15).forEach((x) => {
    console.log(x.id, 'Q' + x.q, 'spread=' + x.spread, 'c=' + x.c, 'oMax=' + x.oMax);
    console.log(' *', x.correct);
    x.wrongs.forEach((w) => console.log(' -', w));
  });
  console.log('phrase hits', hits);
}

main();
