/**
 * Pass 2: hand-balance remaining severe UL cases after polish-severe-quiz-lengths.js.
 * Goal: every option in a patched question lands in a similar length band (~130–170),
 * with content-specific wrong claims (no formula tails).
 *
 * Run: node scripts/polish-severe-pass2.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'data', 'quizzes', 'alice');

/** Ensure terminal punctuation */
function P(t) {
  t = String(t).trim().replace(/[ \t]{2,}/g, ' ');
  if (t.length > 12 && !/[.!?…]$/.test(t)) t += '.';
  return t;
}

/**
 * For each severe key: { correct, wrongs: [3] }
 * Lengths intentionally clustered ~140–165.
 */
const PATCHES = {
  'loosh-harvesting::23': {
    correct:
      'EBS exposes elites — politicians, royalty, clergy, celebrities — in sacrifice and control crimes, rupturing the 3 Strings before physical Scare Events peak.',
    wrongs: [
      'EBS only airs cooking shows and sports highlights so the population stays calm, entertained, and fully tethered to all three control strings.',
      'EBS praises every elite as innocent public servants and bans any mention of sacrifice, finance fraud, false gods, or institutional crime.',
      'EBS is canceled by parasites before broadcast so no psychological correction occurs and no string-break ever reaches the masses.',
    ],
  },
  'evidence-of-resets::5': {
    correct:
      'Tartaria was a global advanced civilization of free energy, harmonic architecture, and high culture — wiped and inverted so later ages inherit only fragments and faked timelines.',
    wrongs: [
      'Tartaria was only a scatter of medieval wood-hut villages with no free energy, no harmonic temples, and no architecture worth suppressing from history.',
      'Tartaria is a future utopia that has not happened yet and leaves no stones, condensers, star forts, or mud-flood scars in the present landscape.',
      'Tartaria is merely a Smithsonian brand name for coal museums and never described any real pre-reset civilization of excellence on Earth.',
    ],
  },
  'control-mechanisms::22': {
    correct:
      'The “Dark Ages” are a fabricated buffer story that covers the engineered drop from free-energy Tartaria to Industrial austerity without admitting Reset and inversion.',
    wrongs: [
      'The Dark Ages are a precise eyewitness chronicle of unbroken progress with no resets, no free-energy past, and no engineered civilization downgrade.',
      'The Dark Ages chapter in G.A.A. textbooks fully discloses Mud-floods, giants, Atmospheric Condensers, and the entire parasitic occupation timeline.',
      'The Dark Ages are only a weather diary about rainy decades with no link to narrative cover, free-energy loss, or inverted industrial history.',
    ],
  },
  'parasitic-takeover::20': {
    correct:
      'The Moon is a holographic shell over a negative ET command station — Greys and breakaway blondes harvest Loosh, watch Black Sun banks, and broadcast lunatic frequencies.',
    wrongs: [
      'The Moon is a G.A.A. hospital that only heals children, never phases out of view, and has no Grey crew or loosh-harvest hardware at all.',
      'The Moon is pure romantic light for poetry with no station, no Grey staff, no Mt Meru storage role, and no frequency broadcast into human minds.',
      'The Moon is a natural satellite only — no holography, no command deck, no loosh harvest, and no engineered lunar frequencies of any kind.',
    ],
  },
  'recycled-souls::8': {
    correct:
      'After a purge: annihilate the surface, harvest stem cells, grow orphan clones underground, then distribute blank-slate children by Orphan Train into emptied lands.',
    wrongs: [
      'After a purge: invite the old population back with full memory and hand them free-energy keys to every city with no clone pipeline at all.',
      'After a purge: grow no clones and leave the land empty forever with no trains, no Arks, and no re-education apparatus for a new crop.',
      'After a purge: rescue every child into G.A.A. fleets and permanently ban stem-cell harvest, orphan logistics, and blank-slate repopulation.',
    ],
  },
  'tartaria::6': {
    correct:
      'Density Suppression lowers local vibration so Tartarian sacred architecture fades from view while low-frequency occupation hardware stays visible and “normal.”',
    wrongs: [
      'Density Suppression is a restoration tool that brightens every Tartarian temple for tourism, free study, and open public free-energy use.',
      'Density Suppression is only cultural renaming of buildings with no frequency change, no hidden architecture, and no occupation hardware preference.',
      'Density Suppression is a G.A.A. program that raises density until parasites cannot stand on the open plain and all temples blaze at full power.',
    ],
  },
  'emf-white-flash::25': {
    correct:
      'The Flash neutralizes Religion, Finance, and Perceived Knowledge, erases 97% herd pressure, and opens a path for true souls to process the realm’s uninstallation.',
    wrongs: [
      'The Flash only reboots phones overnight and leaves Religion, Finance, and Perceived Knowledge fully operational as control strings.',
      'The Flash upgrades every NPC into organic 12th-density status and cancels any need for soul work, detox, or string severance.',
      'The Flash strengthens Vatican portals so amnesia, recycle logistics, and harvest throughput run faster after the white burst.',
    ],
  },
  'firmament::20': {
    correct:
      'Hostile ETs breached the Firmament in craft, but ambient frequencies were too high for 4th-density bodies until Density Suppression dimmed the realm for disembark.',
    wrongs: [
      'Hostile ETs walked in on foot through open gates with no craft, no membrane breach, and no need for any frequency dimming at all.',
      'Hostile ETs thrived at full 9th density on arrival and installed even brighter frequencies to celebrate permanent open occupation.',
      'The Firmament never blocked anyone; all densities always mixed freely on the open plain with no craft or suppression required.',
    ],
  },
  'resets-hidden-history::1': {
    correct:
      'Resets erased true chronology and memory through cyclic destruction of advanced civilizations, burying Tartaria under mud, myth, and inverted timelines.',
    wrongs: [
      'Resets gently preserved all Tartarian records in public schools for continuous open study and free-energy apprenticeship programs.',
      'No resets ever occurred; history is a clean uninterrupted line from caves to smartphones with full archival continuity everywhere.',
      'Resets only rearranged museum furniture and never touched populations, free-energy grids, or the true chronological timeline.',
    ],
  },
  'finance-fake-money::14': {
    correct:
      'Gold Rushes targeted grandchildren of post-Reset cloned orphans (America ~mid-1800s), locking a blank-slate generation into mineral frenzy and fake wealth religion.',
    wrongs: [
      'Gold Rushes targeted only ancient Tartarian kings who already understood free-energy economics and needed no blank-slate wealth myth.',
      'Gold Rushes were canceled charity events that redistributed free-energy devices instead of gold myths to every emptied township.',
      'Gold Rushes happened before any Re-set and only involved tourists collecting painted stage props with no clone-generation targeting.',
    ],
  },
  'finance-fake-money::17': {
    correct:
      'Carnegie converted steel fortune into thousands of libraries that spread fabricated history and science — financial empire reborn as narrative control labeled philanthropy.',
    wrongs: [
      'Carnegie secretly funded EMF Flash tech for the G.A.A. and stocked only free-energy engineering texts in every public reading room.',
      'Carnegie refused all libraries and kept every steel dollar for private yachts with no public narrative influence of any kind.',
      'Carnegie’s libraries taught flat earth, Mud-floods, and Anuk history as mandatory curriculum to accelerate mass awakening.',
    ],
  },
  'inversion-tactics::14': {
    correct:
      'Heavy metals and endocrine disruptors (including via promoted vaping) calcify the pineal, dulling intuition and sealing biological inversion of perception.',
    wrongs: [
      'Promoted vaping dissolves pineal calcification with pure minerals and restores full multidimensional sight within weeks of use.',
      'Only prayer beads affect the pineal; metals and nanoparticles have zero endocrine, neural, or intuitive impact on human awareness.',
      'Biosphere inversion targets only soil pH and crop yield and never touches human glands, pineal function, or spiritual reception.',
    ],
  },
  'negative-entities::17': {
    correct:
      'The Lunar Command Station is a negative ET frequency-control base under a holographic shell, manned by Greys and breakaways to broadcast disruptive lunar frequencies.',
    wrongs: [
      'The Moon is a pure natural rock with no crew, no holography, no command deck, and no frequency role in human psychology or loosh harvest.',
      'The Moon is a G.A.A. lighthouse that only guides Twin Flames home, never phases out of view, and never broadcasts madness frequencies.',
      '“Lunatic” frequencies are a Victorian poetry metaphor only — no hardware, no Greys, and no link to loosh or population control systems.',
    ],
  },
  'resets-hidden-history::17': {
    correct:
      'After the last Reset (America ~1860, UK ~1900), WW1 killed 15–22 million aged 15–50 who still held Old World, flat-earth, and herbal knowledge.',
    wrongs: [
      'WW1 was a pure accident with no demographic targeting, no memory-holder purge, and no link to the post-Reset control grid at all.',
      'WW1 restored Tartarian free energy and published flat-earth maps in every school while protecting herbal practitioners worldwide.',
      'WW1 only trained soldiers as master herbalists so Big Pharma could never gain institutional power after the Reset generation matured.',
    ],
  },
  'sol-soul-portal::20': {
    correct:
      'Selling “solar systems” as physical star-planet machines hides that a Sol-System is soul-farm architecture and keeps minds locked in globe-orbit cosmology.',
    wrongs: [
      'Schools openly teach that Sol means soul farm, so every child rejects globe cosmology and refuses Sun-portal reincarnation logistics.',
      'Controllers removed the word Sol from all languages so no linguistic deception about soul farms or fake orbit stories remains possible.',
      '“Solar” language only describes weather and seasons with no cosmological deception and no soul-architecture implications whatsoever.',
    ],
  },
};

// Auto-balance helper for remaining severe not in hand map:
// tighten correct + expand wrongs with content-bound second clauses (not stock tails).
function autoBalance(q) {
  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  let c = cor.text.trim();

  // Tighten multi-part corrects
  if (c.includes('—') && c.length > 150) {
    const parts = c.split(/\s*—\s*/);
    if (parts[0].length >= 70 && parts[0].length <= 160) c = parts[0];
    else if (parts.length >= 2 && (parts[0] + ' — ' + parts[1]).length <= 170)
      c = parts[0] + ' — ' + parts[1];
  }
  if (c.includes(';') && c.length > 155) {
    const first = c.split(';')[0].trim();
    if (first.length >= 70) c = first;
  }
  // Soft trim trailing purpose clauses
  c = c.replace(
    /,\s+(forcing|locking|converting|so that|so later|while low-frequency|and opens)\b.+$/i,
    ''
  );
  c = P(c);

  // Target ~ same band as tightened correct
  const target = Math.max(130, Math.min(c.length + 5, 165));

  const expanded = wrongs.map((o, idx) => {
    let t = o.text.trim().replace(/[.!?…]+$/g, '');
    if (t.length >= target * 0.88) return P(t);

    // Content-bound second clauses (rotate by index) — claim-specific, not corpus stock tails
    const addons = buildAddons(t, q.question || '');
    const pick = addons[idx % addons.length];
    let next = `${t}, ${pick}`;
    // If still short, add one more short finisher from remaining
    if (next.length < target * 0.9 && addons.length > 1) {
      const pick2 = addons[(idx + 2) % addons.length];
      if (!next.includes(pick2.slice(0, 20))) next = `${next} — ${pick2}`;
    }
    // Cap soft
    if (next.length > target * 1.25) {
      const cut = next.lastIndexOf(', ', Math.floor(target * 1.15));
      if (cut > t.length) next = next.slice(0, cut);
    }
    return P(next);
  });

  // If correct still towers, one more tighten
  const oMax = Math.max(...expanded.map((t) => t.length));
  if (c.length > oMax + 45) {
    const first = c.split(/[;—]/)[0].trim();
    if (first.length >= 65 && first.length < c.length) c = P(first);
  }

  cor.text = c;
  wrongs.forEach((o, i) => {
    o.text = expanded[i];
  });
}

function buildAddons(wrongText, question) {
  const t = wrongText.toLowerCase();
  const q = (question || '').toLowerCase();
  const out = [];

  if (/\b(g\.?a\.?a|white hat)/i.test(wrongText)) {
    out.push(
      'as though liberating forces ran harvest logistics instead of dismantling the prison grid'
    );
  }
  if (/\b(npc|clone|orphan)/i.test(wrongText)) {
    out.push(
      'with no manufactured population pipeline and no blank-slate re-education apparatus afterward'
    );
  }
  if (/\b(natural|accident|random|ordinary|pure|only)\b/i.test(wrongText)) {
    out.push(
      'treating the outcome as ordinary chance rather than engineered multi-generational design'
    );
  }
  if (/\b(never|no link|with no)\b/i.test(wrongText)) {
    out.push(
      'leaving parasites, resets, and density tech entirely outside the explanation of events'
    );
  }
  if (/\b(library|carnegie|philanthrop)/i.test(wrongText) || /philanthrop|library/.test(q)) {
    out.push(
      'so narrative control through prestige institutions is dismissed as irrelevant charity noise'
    );
  }
  if (/\b(moon|lunar|grey|station)/i.test(wrongText) || /moon|lunar/.test(q)) {
    out.push(
      'with no loosh broadcast role and no holographic cover over any command deck hardware'
    );
  }
  if (/\b(vaping|pineal|metal)/i.test(wrongText) || /pineal|vaping/.test(q)) {
    out.push(
      'so biological inversion of intuition is treated as impossible under any delivery system'
    );
  }
  if (/\b(reset|mud-flood|tartaria|ww1|war)\b/i.test(wrongText) || /reset|war|tartaria/.test(q)) {
    out.push(
      'with no demographic purge of memory-holders and no cover story for free-energy removal'
    );
  }
  if (/\b(finance|gold|money|debt)/i.test(wrongText) || /finance|gold|money/.test(q)) {
    out.push(
      'while spiritual attention stays free and institutional money myths hold no binding power'
    );
  }
  if (/\b(religion|deit|god|worship)/i.test(wrongText) || /religion|god/.test(q)) {
    out.push(
      'leaving cognitive autonomy untouched and requiring no uninstallation before Scare Events'
    );
  }
  if (/\b(freemason|smithsonian|33rd)/i.test(wrongText) || /freemason|smithsonian/.test(q)) {
    out.push(
      'with no proxy role for non-human overlords and no vault pipeline for confiscated evidence'
    );
  }
  if (/\b(density|overlay|firmament|frequency)/i.test(wrongText) || /density|firmament|frequency/.test(q)) {
    out.push(
      'as if ambient vibration, sky projection, and node architecture played no part in control'
    );
  }
  if (/\b(soul|reincarn|portal|vortex|amnesia)/i.test(wrongText) || /soul|portal|reincarn/.test(q)) {
    out.push(
      'with souls moving freely after death and no Vatican or Sun-portal processing queue at all'
    );
  }

  // Always have enough variety
  const fallbacks = [
    'offered as a complete local story that needs no wider harvest architecture to make sense',
    'so any multi-layered control model is treated as unnecessary speculation about the mechanism',
    'keeping the account sealed at that surface reading with no upstream designer required',
    'and framing every larger system as coincidence rather than coordinated inversion work',
    'with the rest of the matrix dismissed as noise that never shaped the actual outcome',
  ];
  for (const f of fallbacks) {
    if (!out.includes(f)) out.push(f);
  }
  return out;
}

function isSevere(q) {
  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  if (!cor || wrongs.length < 2) return false;
  const oMax = Math.max(...wrongs.map((o) => o.text.length));
  const max = Math.max(...q.options.map((o) => o.text.length));
  const ul =
    cor.text.length === max &&
    q.options.filter((o) => o.text.length === max).length === 1;
  return ul && cor.text.length - oMax >= 50;
}

function applyHand(q, patch) {
  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  cor.text = P(patch.correct);
  wrongs.forEach((o, i) => {
    o.text = P(patch.wrongs[i]);
  });
}

function main() {
  let hand = 0;
  let auto = 0;
  let files = 0;

  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const filePath = path.join(DIR, f);
    const quiz = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;
    const id = quiz.id || f.replace('.json', '');

    for (const q of quiz.questions || []) {
      if (!isSevere(q)) continue;
      const key = `${id}::${q.number}`;
      if (PATCHES[key]) {
        applyHand(q, PATCHES[key]);
        hand++;
        changed = true;
      } else {
        autoBalance(q);
        auto++;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
      files++;
    }
  }

  // Re-scan
  let severe = 0;
  let ul = 0;
  let total = 0;
  const left = [];
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
        });
      }
    }
  }

  left.sort((a, b) => b.spread - a.spread);
  console.log('Hand patches applied:', hand);
  console.log('Auto-balanced:', auto);
  console.log('Files written:', files);
  console.log(`UL: ${ul}/${total} (${((100 * ul) / total).toFixed(1)}%)`);
  console.log('Severe remaining:', severe);
  left.slice(0, 20).forEach((x) => console.log(x));
}

main();
