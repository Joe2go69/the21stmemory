/**
 * Final hand-quality pass on the original severe UL set:
 * - Re-apply content-rich correct answers from polish-severe-quiz-lengths.js
 * - Lengthen wrongs with claim-specific second clauses (no recycled formula tails)
 * - Target: severe (UL spread>=50) = 0; no stock/meta padding phrases
 *
 * Run after: rebalance-quiz-length → polish-severe-quiz-lengths → pass2 → cleanup
 * Or standalone on current alice quiz JSON.
 *
 *   node scripts/polish-severe-final.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = path.join(__dirname, '..', 'data', 'quizzes', 'alice');

// Load PATCHES from polish-severe-quiz-lengths.js without running main
function loadPatches() {
  const src = fs.readFileSync(
    path.join(__dirname, 'polish-severe-quiz-lengths.js'),
    'utf8'
  );
  const m = src.match(/const PATCHES = \{[\s\S]*?\n\};/);
  if (!m) throw new Error('Could not extract PATCHES');
  const sandbox = {};
  vm.runInNewContext(m[0] + '\nthis.PATCHES = PATCHES;', sandbox);
  return sandbox.PATCHES;
}

// Pass2 hand patches override (longer wrongs)
function loadPass2() {
  const src = fs.readFileSync(path.join(__dirname, 'polish-severe-pass2.js'), 'utf8');
  const m = src.match(/const PATCHES = \{[\s\S]*?\n\};/);
  if (!m) return {};
  const sandbox = {};
  vm.runInNewContext(m[0] + '\nthis.PATCHES = PATCHES;', sandbox);
  return sandbox.PATCHES;
}

function P(t) {
  t = String(t)
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .replace(/[,;:\s—–-]+$/g, '')
    .trim();
  if (t.length > 12 && !/[.!?…]$/.test(t)) t += '.';
  return t;
}

const FORMULA = [
  /,?\s*which would fully account for the outcome without any wider inversion architecture\.?/gi,
  /\s*[—–-]\s*presented as the full identity of the thing with no deeper parasitic layer\.?/gi,
  /,?\s*taken as a complete alternative reading that stops at that surface mechanism\.?/gi,
  /,?\s*remaining a self-contained alternative that never invokes harvest or inversion logistics\.?/gi,
  /,?\s*disconnected from any deliberate multi-generational control design behind events\.?/gi,
  /,?\s*with every broader engineered system treated as irrelevant to the outcome\.?/gi,
  /\s+across any density, cycle, or historical configuration(?: of the realm)?\.?/gi,
  /,?\s*casting liberating forces as operators of the prison rather than its dismantlers\.?/gi,
  /,?\s*and nothing beyond that limited account is required to explain the outcome\.?/gi,
  /,?\s*and no coordinated multi-system design behind it\.?/gi,
  /,?\s*with no deliberate long-game control design behind the outcome\.?/gi,
  /,?\s*and no hidden harvest architecture behind the scenes\.?/gi,
  /\s+in any age of the occupation or any configuration of the realm\.?/gi,
  /\s*[—–-]\s*as if the Alliance operated the prison instead of dismantling it\.?/gi,
  /,?\s*rather than any deeper multi-faction control model of the same events\.?/gi,
  /,?\s*rather than any account that rejects this limited reading of the same question\.?/gi,
  /,?\s*offered as a complete local story that needs no wider harvest architecture to make sense\.?/gi,
  /,?\s*so any multi-layered control model is treated as unnecessary speculation about the mechanism\.?/gi,
  /,?\s*keeping the account sealed at that surface reading with no upstream designer required\.?/gi,
  /,?\s*and framing every larger system as coincidence rather than coordinated inversion work\.?/gi,
  /,?\s*with the rest of the matrix dismissed as noise that never shaped the actual outcome\.?/gi,
  /,?\s*with no further layer required beyond that account\.?/gi,
  /,?\s*and that is treated as the entire mechanism\.?/gi,
  /,?\s*without a larger engineered system underneath\.?/gi,
  /,?\s*stopping the explanation at that boundary alone\.?/gi,
  /,?\s*held as a complete closed account of the events\.?/gi,
  /,?\s*as if no adjacent systems participated at all\.?/gi,
  /,?\s*keeping every neighboring mechanism off the board\.?/gi,
  /,?\s*and declining any account that reaches past that point\.?/gi,
  /,?\s*framed only in those terms with nothing added\.?/gi,
  /,?\s*as a sealed explanation that needs no sequel clause\.?/gi,
  /,?\s*with the surrounding architecture waved away as irrelevant\.?/gi,
  /,?\s*and with every other driver dismissed as coincidence\.?/gi,
  /,?\s*read as a self-limited cause with no upstream design\.?/gi,
  /,?\s*as though that single factor closed the case\.?/gi,
  /,?\s*without extending the chain into harvest or inversion logistics\.?/gi,
  /,?\s*and treating side systems as noise rather than design\.?/gi,
  /,?\s*as the sole operative factor in the outcome\.?/gi,
  /,?\s*with broader scaffolding left unnamed and unexamined\.?/gi,
  /,?\s*stopping short of any multi-layered control model\.?/gi,
  /,?\s*as a one-factor story with a tidy edge\.?/gi,
  /,?\s*and insisting the rest of the matrix had no hand in it\.?/gi,
  /,?\s*without assigning intent beyond that surface reading\.?/gi,
  /,?\s*kept inside a minimal local explanation only\.?/gi,
  /,?\s*as if complexity past that line were imaginary\.?/gi,
  /,?\s*with no deeper inversion layered underneath that step\.?/gi,
  /,?\s*leaving any wider engineered design out of the picture\.?/gi,
  /,?\s*and nothing outside that narrow scope is required in this view\.?/gi,
  /\s*[—–-]\s*taking that limited mechanism as the whole story\.?/gi,
  /,?\s*full stop — no wider engineered layer in that reading\.?/gi,
  /;\s*that narrow scope is the entire mechanism in this view\.?/gi,
  /,?\s*and the rest of the matrix is treated as irrelevant noise\.?/gi,
  /,?\s*treating the landscape and sky as ordinary geology and astronomy only\.?/gi,
  /,?\s*with no artificial sky, no enclosed realm, and no engineered reset scarring\.?/gi,
  /,?\s*leaving parasites, resets, and density tech entirely outside the explanation of events\.?/gi,
  /,?\s*treating the outcome as ordinary chance rather than engineered multi-generational design\.?/gi,
  /,?\s*with no manufactured population pipeline and no blank-slate re-education apparatus afterward\.?/gi,
  /,?\s*with souls moving freely after death and no Vatican or Sun-portal processing queue at all\.?/gi,
  /,?\s*as though liberating forces ran harvest logistics instead of dismantling the prison grid\.?/gi,
  /,?\s*so narrative control through prestige institutions is dismissed as irrelevant charity noise\.?/gi,
  /,?\s*with no loosh broadcast role and no holographic cover over any command deck hardware\.?/gi,
  /,?\s*so biological inversion of intuition is treated as impossible under any delivery system\.?/gi,
  /,?\s*with no demographic purge of memory-holders and no cover story for free-energy removal\.?/gi,
  /,?\s*while spiritual attention stays free and institutional money myths hold no binding power\.?/gi,
  /,?\s*leaving cognitive autonomy untouched and requiring no uninstallation before Scare Events\.?/gi,
  /,?\s*with no proxy role for non-human overlords and no vault pipeline for confiscated evidence\.?/gi,
  /,?\s*as if ambient vibration, sky projection, and node architecture played no part in control\.?/gi,
  /,?\s*with no demographic purge of memory-holders and no cover story for free-energy removal\.?/gi,
];

function stripFormula(t) {
  let x = t;
  let prev;
  let g = 0;
  do {
    prev = x;
    for (const re of FORMULA) x = x.replace(re, '');
    x = x.replace(/[ \t]{2,}/g, ' ').trim();
    g++;
  } while (x !== prev && g < 12);
  return P(x);
}

/**
 * Claim-specific lengthening — second clause doubles down on THIS wrong idea.
 */
function lengthenWrong(text, question, correct) {
  let b = stripFormula(text).replace(/[.!?…]+$/g, '');
  const target = Math.min(Math.max((correct || '').length - 5, 130), 170);
  if (b.length >= target * 0.9) return P(b);

  const L = b.toLowerCase();
  const q = (question || '').toLowerCase();

  // --- High-specificity branches ---
  if (/npc.*manager|career coach/i.test(b))
    return P(
      `${b}, treating Ancients as bureaucratic supervisors of NPCs rather than lattice frequency stabilizers`
    );
  if (/finance lessons|banking class/i.test(b))
    return P(
      `${b}, so Codex-driven pushback against authority is replaced by money tutoring in every capital`
    );
  if (/banned all soul codex|zero lattice|silent observers/i.test(b))
    return P(
      `${b}, with Micro Suns forbidding any crystalline-membrane interface for the entire epoch`
    );
  if (/museum basements|free all oopas/i.test(b))
    return P(
      `${b}, flooding public knowledge with confiscated pre-reset tech instead of installing inverted history`
    );
  if (/kill every (skilled )?npc|no re-education workforce/i.test(b))
    return P(
      `${b}, so no adult handlers remain to indoctrinate Orphan Train clones after the slaughter`
    );
  if (/tuning fork free energy.*locomotive|aether after the reset/i.test(b))
    return P(
      `${b}, restoring free-energy rail while coal sabotage and inverted schooling never take hold`
    );
  if (/street vendor/i.test(b))
    return P(
      `${b}, so Freemason Arks and false Evolution doctrine never enter the clone re-education pipeline`
    );
  if (/no adults survive/i.test(b))
    return P(
      `${b}, leaving parentless clones without any indoctrination apparatus or fabricated history curriculum`
    );
  if (/micro suns teach|tartarian free-energy science and true flat-earth/i.test(b))
    return P(
      `${b}, replacing Freemason re-education with pure Old World truth for every orphan arrival`
    );
  if (/twin flame matchmaking/i.test(b))
    return P(
      `${b}, with open surface chapels only and no Adrenochrome floors or multi-faction portal hubs below`
    );
  if (/project serpo novels/i.test(b))
    return P(
      `${b}, stacked in public rooms with no subterranean command tiers for Greys, Anuk, or Custodians`
    );
  if (/g\.?a\.?a\.? spa/i.test(b))
    return P(
      `${b}, permanently ejecting Greys and sealing every Vatican portal used for recycle logistics`
    );
  if (/dissolves the projection dome/i.test(b))
    return P(
      `${b}, so Ley Lines power every home free of meters, debt myths, and forced-labor energy scarcity`
    );
  if (/heliocentrism textbooks/i.test(b))
    return P(
      `${b}, while free-energy Nodes and Lattice grids remain fully online as ordinary public infrastructure`
    );
  if (/unlimited free ley|gifts unlimited/i.test(b))
    return P(
      `${b}, with no siphon pylons, no loosh extraction at Nodes, and no fake energy scarcity narrative`
    );
  if (/cooking shows|sports highlights/i.test(b))
    return P(
      `${b}, while elites stay trusted and Religion, Finance, and Perceived Knowledge remain fully intact`
    );
  if (/praises every elite/i.test(b))
    return P(
      `${b}, so Scare Events never rupture the three control strings or expose sacrifice networks`
    );
  if (/ebs is canceled|canceled by parasites/i.test(b))
    return P(
      `${b}, ensuring no mass exposure of child-sacrifice networks before physical events peak`
    );
  if (/g\.?a\.?a\.? hospital/i.test(b) && /moon|heal/i.test(L + q))
    return P(
      `${b}, with no Grey crew, no Black Sun monitoring, and no madness-frequency broadcast hardware`
    );
  if (/romantic light for poetry/i.test(b))
    return P(
      `${b}, and no holographic shell, breakaway blondes, or loosh-harvest role in the night sky`
    );
  if (/natural satellite only/i.test(b))
    return P(
      `${b}, without any ET command deck, phasing optics, or engineered lunatic frequency generators`
    );
  if (/soft green radium/i.test(b))
    return P(
      `${b}, never siphoning Ley-line backup energy or harvesting stress loosh from Node populations`
    );
  if (/taj mahal free-energy|harmless replicas/i.test(b))
    return P(
      `${b}, amplifying positive aether only and never redirecting planetary flow toward control grids`
    );
  if (/tuning fork putty/i.test(b))
    return P(
      `${b}, so Lattice power returns openly to cities without Baphomet siphon pylons after every mud-flood`
    );
  if (/master herbalist/i.test(b))
    return P(
      `${b}, so Big Pharma never forms and natural medicine remains the global standard of care`
    );
  if (/banned all pharmaceuticals/i.test(b))
    return P(
      `${b}, reopening Tartarian plant-medicine schools in every city after the trenches emptied`
    );
  if (/border maps with no knowledge purge|no medical angle/i.test(b))
    return P(
      `${b}, and Old World herbal memory-holders survive untouched by any demographic targeting`
    );
  if (/keeps the bones at home|weekly public lectures/i.test(b))
    return P(
      `${b}, and national media never routes the find into Smithsonian vault recovery teams`
    );
  if (/universities refuse/i.test(b))
    return P(
      `${b}, forcing continuous front-page coverage instead of quiet seizure into restricted collections`
    );
  if (/smithsonian immediately displays/i.test(b))
    return P(
      `${b}, with open provenance labels admitting pre-reset giant civilizations to every visitor`
    );
  if (/pure accident|no demographic targeting/i.test(b) && /war|ww1|reset/i.test(q))
    return P(
      `${b}, leaving Old World memory-holders alive and free-energy knowledge unpurged after the Reset`
    );
  if (/restored tartarian free energy and published flat-earth/i.test(b))
    return P(
      `${b}, protecting herbal practitioners and reversing the entire post-Reset control-grid timeline`
    );
  if (/only trained soldiers in herbal medicine/i.test(b))
    return P(
      `${b}, so Big Pharma could never gain institutional power over a blank-slate post-cull population`
    );
  if (/random fashion pose|no secret society/i.test(b))
    return P(
      `${b}, with no Masonic allegiance signal and no link to post-reset inverted power hierarchies`
    );
  if (/g\.?a\.?a\.? signal|white hats to identify/i.test(b))
    return P(
      `${b}, marking liberators in public photos rather than proxy enforcers of parasitic inversion`
    );
  if (/medical brace for injured arms/i.test(b))
    return P(
      `${b}, worn only by factory workers with no occult meaning and no hierarchy of control implied`
    );
  if (/ordinary modern tools|industrial revolution story is complete/i.test(b))
    return P(
      `${b}, proving high-tech pre-reset civilizations never existed and Masonic timelines need no vaults`
    );
  if (/souvenirs freemasons freely display/i.test(b))
    return P(
      `${b}, celebrating Tartarian free energy in every museum instead of confiscating contradicting evidence`
    );
  if (/natural rocks with no technological history/i.test(b))
    return P(
      `${b}, posing no threat to inverted linear history and requiring no Smithsonian seizure pipeline`
    );

  // --- Broader but still claim-bound ---
  if (/^only\b/i.test(b) || /\bonly\b/i.test(b) && b.length < 110)
    return P(
      `${b}, with every larger engineered system treated as clean, uninvolved, or beside the point`
    );
  if (/\bnever\b/i.test(b))
    return P(`${b} in any density, cycle, or configuration of the inverted realm`);
  if (/\bG\.?A\.?A\.?\b|White Hats?/i.test(b))
    return P(
      `${b}, as if liberating forces ran the prison architecture instead of dismantling it`
    );
  if (/\b(natural|accident|random|ordinary|pure|harmless)\b/i.test(b))
    return P(
      `${b}, with no deliberate multi-generational control design behind the outcome at all`
    );
  if (/\b(no |without |with no )/i.test(b))
    return P(
      `${b}, so harvest logistics, density tech, and inverted narrative machinery play no part`
    );

  // Question-shaped fallbacks (still specific to wrong text)
  if (/how |why /i.test(question || ''))
    return P(
      `${b} — that mechanism alone, with no wider inversion stack required to produce the result`
    );
  if (/what is|what are|who /i.test(question || ''))
    return P(
      `${b} — the complete identity of the thing, with no deeper parasitic function underneath`
    );

  // Last resort: restate wrong claim more fully without meta "limited account" language
  return P(
    `${b}, standing as a full competing answer that rejects the deeper control reading of the question`
  );
}

function tightenCorrect(text, peerMax) {
  let t = stripFormula(text);
  const maxOk = Math.max(peerMax + 18, 145);
  if (t.length <= maxOk) return t;

  if (t.includes(';')) {
    const first = t.split(';')[0].trim();
    if (first.length >= 70 && first.length <= maxOk + 25) return P(first);
  }
  if (/[—–]/.test(t)) {
    const parts = t.split(/\s*[—–]\s*/);
    if (parts[0].length >= 70 && parts[0].length <= maxOk + 20) return P(parts[0]);
    if (parts.length >= 2) {
      const two = `${parts[0]} — ${parts[1]}`.trim();
      if (two.length < t.length && two.length <= maxOk + 30) return P(two);
    }
  }
  const m = t.match(
    /^(.*?)(?:,\s+(?:including|locking|forcing|converting|installing|wrapping|erasing|supplying)\b.+)$/i
  );
  if (m && m[1].length >= 70) return P(m[1]);
  return t;
}

function isSevere(opts) {
  const cor = opts.find((o) => o.isCorrect);
  const wrongs = opts.filter((o) => !o.isCorrect);
  const oMax = Math.max(...wrongs.map((o) => o.text.length));
  const max = Math.max(...opts.map((o) => o.text.length));
  const ul =
    cor.text.length === max &&
    opts.filter((o) => o.text.length === max).length === 1;
  return ul && cor.text.length - oMax >= 50;
}

function main() {
  const base = loadPatches();
  const p2 = loadPass2();
  const PATCHES = { ...base, ...p2 }; // pass2 overrides where present

  let applied = 0;
  let severeLeft = 0;
  const left = [];

  // Group by file
  const byFile = {};
  for (const key of Object.keys(PATCHES)) {
    const [id, qs] = key.split('::');
    if (!byFile[id]) byFile[id] = [];
    byFile[id].push({ q: parseInt(qs, 10), patch: PATCHES[key], key });
  }

  for (const [id, items] of Object.entries(byFile)) {
    const fp = path.join(DIR, `${id}.json`);
    if (!fs.existsSync(fp)) continue;
    const quiz = JSON.parse(fs.readFileSync(fp, 'utf8'));

    for (const { q: qn, patch } of items) {
      const q = quiz.questions.find((x) => x.number === qn);
      if (!q) continue;

      const cor = q.options.find((o) => o.isCorrect);
      const wrongs = q.options.filter((o) => !o.isCorrect);

      // Apply hand correct
      cor.text = P(patch.correct);

      // Apply hand wrongs, then lengthen claim-specifically
      wrongs.forEach((o, i) => {
        const seed = patch.wrongs[i] || o.text;
        o.text = lengthenWrong(seed, q.question, cor.text);
      });

      // Balance band
      let oMax = Math.max(...wrongs.map((o) => o.text.length));
      cor.text = tightenCorrect(cor.text, oMax);

      // If correct still towers, lengthen wrongs once more from their current text
      if (isSevere(q.options)) {
        for (const o of wrongs) {
          o.text = lengthenWrong(o.text, q.question, cor.text);
        }
        oMax = Math.max(...wrongs.map((o) => o.text.length));
        cor.text = tightenCorrect(cor.text, oMax);
      }

      applied++;
      if (isSevere(q.options)) {
        severeLeft++;
        left.push({
          id,
          q: qn,
          c: cor.text.length,
          oMax: Math.max(...wrongs.map((o) => o.text.length)),
          correct: cor.text,
          wrongs: wrongs.map((o) => o.text),
        });
      }
    }

    fs.writeFileSync(fp, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
  }

  // Full corpus stats
  let ul = 0;
  let total = 0;
  let severe = 0;
  const c = [];
  const w = [];
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const quiz = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    for (const q of quiz.questions || []) {
      total++;
      const cor = q.options.find((o) => o.isCorrect);
      const wrongs = q.options.filter((o) => !o.isCorrect);
      const oMax = Math.max(...wrongs.map((o) => o.text.length), 0);
      const max = Math.max(...q.options.map((o) => o.text.length));
      if (
        cor.text.length === max &&
        q.options.filter((o) => o.text.length === max).length === 1
      ) {
        ul++;
        if (cor.text.length - oMax >= 50) severe++;
      }
      for (const o of q.options) (o.isCorrect ? c : w).push(o.text.length);
    }
  }
  const med = (a) => {
    a = [...a].sort((x, y) => x - y);
    return a[Math.floor(a.length / 2)];
  };

  console.log('Patched questions:', applied);
  console.log('Still severe in patched set:', severeLeft);
  left.forEach((x) => {
    console.log(x.id, 'Q' + x.q, 'c=' + x.c, 'oMax=' + x.oMax);
    console.log(' *', x.correct);
    x.wrongs.forEach((t) => console.log(' -', t));
  });
  console.log(
    `\nFULL ALICE UL ${ul}/${total} (${((100 * ul) / total).toFixed(1)}%) severe=${severe}`
  );
  console.log('med correct/wrong', med(c), med(w));

  // Formula residual check on patched files only
  const bad = [
    'which would fully account for the outcome',
    'presented as the full identity of the thing',
    'taken as a complete alternative reading',
    'with no further layer required beyond that account',
    'and that is treated as the entire mechanism',
    'one-factor story with a tidy edge',
    'cover story that cannot',
  ];
  const hits = Object.fromEntries(bad.map((p) => [p, 0]));
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const p of bad) {
      let i = 0;
      while ((i = raw.indexOf(p, i)) !== -1) {
        hits[p]++;
        i += p.length;
      }
    }
  }
  console.log('residual phrases (whole alice):', hits);
}

main();
