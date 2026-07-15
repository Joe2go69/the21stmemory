/**
 * Installs Inversion Tactics quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/inversion-tactics.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-inversion-tactics-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'inversion-tactics';
const TOPIC_TITLE = 'Inversion Tactics';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/inversion.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['custodians', 'gateway-10', 'multidimensional inversion'],
  2: ['12th density', 'negative species', 'millennia'],
  3: ['density suppression', 'spirit tree', '3rd density'],
  4: ['dimmer', '9th', '3rd density'],
  5: ['spirit tree', 'mt meru', 'petrified stump'],
  6: ['grey', 'swat', 'violently ill'],
  7: ['anuk', 'omicron', 'alpha draco', 'niberians'],
  8: ['freemasons', 'footprints', 'crystalline'],
  9: ['alters', 'nodal', 'dampen'],
  10: ['tartarian', 'atmospheric condensers', 'coal'],
  11: ['wheel', 'parasites', 'higher-density'],
  12: ['soul', 'sol', 'solar system'],
  13: ['evolution', 'monkeys', 'homo sapiens'],
  14: ['pineal', 'vaping', 'nickel', 'lead', 'chromium'],
  15: ['vat meat', '1960s', 'supermarkets'],
  16: ['nodes', 'loosh', 'populations'],
  17: ['baphomet power pylons', 'ley-line', 'harvest'],
  18: ['projection dome', 'firmament', 'asteroids'],
  19: ['emerald palace', 'ulf', 'gold idols'],
  20: ['black void plasma', 'bright white', 'space'],
  21: ['8th re-set', '2019', '500 million'],
  22: ['georgia guidestones', 'eternal', 'gateway-10'],
  23: ['g.a.a', 'projection dome', 'overlays'],
  24: ['pixelation', 'ebs', 'fake alien invasion'],
  25: ['emf', '97%', 'npc'],
};

function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner.replace(/\^\{([^}]+)\}/g, '$1').replace(/\\%/g, '%').replace(/\\/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\uFFFD/g, '');
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What are Inversion Tactics in the parasitic takeover?',
    options: [
      {
        label: 'A',
        text: 'A meticulously planned multidimensional inversion from Custodian betrayal that suppressed Gateway-10 into an engineered prison matrix through density tech, rewritten laws, and closed 3rd density loops for Taran souls.',
        isCorrect: true,
        rationale:
          'Inversion is planned multidimensional takeover from Custodian betrayal — density suppression, rewritten reality, Taran souls locked in a 3rd density loop.',
      },
      {
        label: 'B',
        text: 'A spontaneous natural weather cycle that gently raised Gateway-10 from 3rd density to 12th density without any Custodian betrayal or engineered species.',
        isCorrect: false,
        rationale:
          'The takeover lowered vibration into a prison matrix; it was planned inversion, not spontaneous density elevation.',
      },
      {
        label: 'C',
        text: 'Only freemason library renovations that improved free-energy atmospheric condensers and restored crystalline temples to full public view.',
        isCorrect: false,
        rationale:
          'Freemasons capped temple footprints with negative block-work; condensers were destroyed, not restored.',
      },
      {
        label: 'D',
        text: 'A G.A.A. charity program that permanently installed Black Void Plasma as a comfort blanket for NPCs during the EMF flash.',
        isCorrect: false,
        rationale:
          'G.A.A. unwinds inversion and strips overlays; Black Void Plasma hides bright white cosmos for parasites.',
      },
    ],
    hint: 'Planned multidimensional prison inversion from Custodian betrayal.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'Who are the Custodians in this inversion story?',
    options: [
      {
        label: 'A',
        text: 'Always-loyal 12th density teachers who never fell and never created any negative species for occupation.',
        isCorrect: false,
        rationale:
          'Custodians succumbed to negativity, orchestrated inversion over millennia, and created all other negative species.',
      },
      {
        label: 'B',
        text: 'Originally highly benevolent 12th density caretakers who succumbed to negativity, plotted over millennia, and created all other negative species to enforce the inversion.',
        isCorrect: true,
        rationale:
          'Custodians fell from benevolent 12th density caretaking, engineered the inversion, and birthed the subordinate parasite hierarchy.',
      },
      {
        label: 'C',
        text: 'Only NPC supermarket managers who introduced vat meat in the 1960s with no higher-density history at all.',
        isCorrect: false,
        rationale:
          'Vat meat is biosphere inversion; Custodians are the origin betrayers of the whole parasitic stack.',
      },
      {
        label: 'D',
        text: 'Grey ET foot soldiers only, with no 12th density past and no role designing the control matrix in advance.',
        isCorrect: false,
        rationale:
          'Greys are engineered subordinates; Custodians designed the matrix before their density fully degraded.',
      },
    ],
    hint: 'Fallen 12th density caretakers — creators of all other negatives.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'What major tool-set did inversion tactics deploy against Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'Only free public tours of the Emerald Palace with no Density Suppression, Spirit Tree damage, or rewritten history of any kind.',
        isCorrect: false,
        rationale:
          'Emerald Palace is masked by overlays; inversion destroys energy architecture and rewrites history.',
      },
      {
        label: 'B',
        text: 'Only coal gifts and wheel festivals that raised Taran souls into open 9th density crystalline living overnight.',
        isCorrect: false,
        rationale:
          'Coal and wheels are technological regression tools; density was forced down into a 3rd density loop.',
      },
      {
        label: 'C',
        text: 'Destruction of primary energetic architecture, Density Suppression technology, and complete rewriting of physical laws, history, and biology to trap Taran souls in a closed 3rd density loop.',
        isCorrect: true,
        rationale:
          'Inversion is comprehensive: kill energy architecture, dim density, rewrite law/history/biology into a closed 3rd density prison.',
      },
      {
        label: 'D',
        text: 'Only Georgia Guidestones landscaping that expanded population past 500 million with no Re-set agenda attached.',
        isCorrect: false,
        rationale:
          'Guidestones mark the 500 million cull target of the 8th Re-set objective, not population expansion charity.',
      },
    ],
    hint: 'Destroy energy core + Density Suppression + rewrite reality into 3rd density loop.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is Density Suppression?',
    options: [
      {
        label: 'A',
        text: 'A natural sunrise cycle that permanently raises every city to 12th density without technology or parasites.',
        isCorrect: false,
        rationale:
          'It is parasitic tech that artificially lowers vibration — a dimmer, not a natural upgrade.',
      },
      {
        label: 'B',
        text: 'Only freemason concrete paint that has no effect on crystalline visibility or 4th density occupation comfort.',
        isCorrect: false,
        rationale:
          'Density Suppression phases out 9th density crystalline reality so low-frequency entities can exist.',
      },
      {
        label: 'C',
        text: 'A G.A.A. tool used only during EMF flash to evaporate 97% NPCs without any prior realm dimming history.',
        isCorrect: false,
        rationale:
          'NPC evaporation is EMF aftermath; Density Suppression is the long-running dimmer of the inversion.',
      },
      {
        label: 'D',
        text: 'Parasitic technology like a dimmer switch that lowers the realm from 9th to 3rd density, hiding higher-density positive architecture and letting lower-frequency entities exist.',
        isCorrect: true,
        rationale:
          'Density Suppression dims 9th→3rd, hides positive architecture, and makes the realm habitable for low-frequency parasites.',
      },
    ],
    hint: 'Dimmer switch — 9th to 3rd; hide crystals; house low-frequency entities.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question:
      'What happened to the Spirit Tree at Mt Meru as inversion began physically?',
    options: [
      {
        label: 'A',
        text: 'Grey ET factions destroyed it and replaced it with a petrified stump, instantly cutting Gateway-10 primary energy like a SWAT team cutting power to a building.',
        isCorrect: true,
        rationale:
          'Greys destroyed Mt Meru Spirit Tree, left a petrified stump, and severed Gateway-10 power system-wide.',
      },
      {
        label: 'B',
        text: 'Custodians polished it into a freemason library dome that raised toroid power across all 178 worlds.',
        isCorrect: false,
        rationale:
          'Destruction limited natural Gateway-10 power; it did not raise toroid output.',
      },
      {
        label: 'C',
        text: 'It was left intact so indigenous species could easily defend against occupation with full high-frequency support.',
        isCorrect: false,
        rationale:
          'Severing the tree prevented indigenous defense and dropped frequency for parasite manifestation.',
      },
      {
        label: 'D',
        text: 'It was moved to Georgia Guidestones as a tourist attraction with no effect on Gateway-10 energy supply.',
        isCorrect: false,
        rationale:
          'Guidestones are 8th Re-set population targets; Spirit Tree kill is the North Pole energy cut.',
      },
    ],
    hint: 'Greys destroy Mt Meru tree → petrified stump → power cut.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'Why did dropping frequency after Spirit Tree destruction matter for occupation?',
    options: [
      {
        label: 'A',
        text: 'High vibration was already too low, so parasites needed more density to become violently ill on purpose.',
        isCorrect: false,
        rationale:
          'Low-vibrational parasites get violently ill in high frequency; dimming lets them walk the land safely.',
      },
      {
        label: 'B',
        text: 'It plunged operational frequency low enough for 14-foot tall low-vibrational parasites to physically manifest without becoming violently ill, while blocking indigenous defense.',
        isCorrect: true,
        rationale:
          'Power cut + frequency drop enables tall low-vibe parasites to occupy and stops indigenous high-frequency defense.',
      },
      {
        label: 'C',
        text: 'It only improved human free-energy condensers so Ley Lines could openly power every locomotive forever.',
        isCorrect: false,
        rationale:
          'Condensers were smelted; frequency drop serves occupation, not free-energy restoration.',
      },
      {
        label: 'D',
        text: 'It automatically restored Soul/Sol language so Solar System myths dissolved without linguistic inversion.',
        isCorrect: false,
        rationale:
          'Soul→Sol linguistic inversion is separate conceptual reprogramming; tree kill is energy/frequency sabotage.',
      },
    ],
    hint: 'Low frequency for 14-ft parasites; block defense; no violent illness.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'Which subordinate species did Custodians engineer to enforce occupation?',
    options: [
      {
        label: 'A',
        text: 'Only Twin Flames and Star Seeds tasked with raising density back to 9th without any 4th density war role.',
        isCorrect: false,
        rationale:
          'Engineered list is Anuk, Omicron, Alpha Draco, Niberians, and Greys as 4th density enforcers.',
      },
      {
        label: 'B',
        text: 'Only freemason architects with no Anuk, Draco, Grey, or Niberian biological hierarchy attached.',
        isCorrect: false,
        rationale:
          'Freemasons execute terrestrial building orders; Custodians engineered multiple negative ET species first.',
      },
      {
        label: 'C',
        text: '4th density surrogates including Anuk (Anunnaki), Omicron, Alpha Draco, Niberians, and Greys to enforce occupation over the 3rd density human population.',
        isCorrect: true,
        rationale:
          'Custodians pre-built a 4th density species stack — Anuk, Omicron, Alpha Draco, Niberians, Greys — for human subjugation.',
      },
      {
        label: 'D',
        text: 'Only NPC supermarket clones created in the 1960s with no multi-millennial engineering plan.',
        isCorrect: false,
        rationale:
          'NPC/vat-meat corruption is later biosphere inversion; species engineering predates and enables occupation.',
      },
    ],
    hint: 'Anuk, Omicron, Alpha Draco, Niberians, Greys — 4th density enforcers.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question:
      'How did architectural inversion cover original 9th density temples?',
    options: [
      {
        label: 'A',
        text: 'By openly restoring crystalline cities and inviting every Taran soul to live in high-density architecture without freemason involvement.',
        isCorrect: false,
        rationale:
          'Density Suppression phased temples out; freemasons built negative block-work on original footprints.',
      },
      {
        label: 'B',
        text: 'By moving all temples to the Moon shell so only Bluebeam tourists could rent them as vacation pods.',
        isCorrect: false,
        rationale:
          'Cover-up is on-site footprint capping with concrete/masonry over positive energy points.',
      },
      {
        label: 'C',
        text: 'By converting every Node into free atmospheric condensers that parasites celebrated as Tartarian progress.',
        isCorrect: false,
        rationale:
          'Nodes were capped with stone Alters; free-energy tech was destroyed, not celebrated.',
      },
      {
        label: 'D',
        text: 'Density Suppression phased crystalline temples out, then freemasons and sold souls built negative concrete/masonry block-work exactly on original temple footprints to cover positive energy points.',
        isCorrect: true,
        rationale:
          'Dim crystalline reality, then cap footprints with freemason/sold-soul negative edifices on the same ground.',
      },
    ],
    hint: 'Dim crystals → freemason block-work on original footprints.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'How were high-frequency Nodal points further inverted?',
    options: [
      {
        label: 'A',
        text: 'They were intentionally capped with stone Alters to explicitly dampen natural electromagnetic emissions from those points.',
        isCorrect: true,
        rationale:
          'Stone Alters on Nodes deliberately dampen natural EM emissions — energy capping as inversion.',
      },
      {
        label: 'B',
        text: 'They were opened as free public healing spas that raised every visitor to 9th density automatically.',
        isCorrect: false,
        rationale:
          'Nodes were capped and dampened, not opened as free healing spas.',
      },
      {
        label: 'C',
        text: 'They were ignored completely while only language reforms like Soul/Sol carried the entire inversion.',
        isCorrect: false,
        rationale:
          'Linguistic inversion is one layer; Node Alters are concrete energetic dampening.',
      },
      {
        label: 'D',
        text: 'They were only mapped for Loosh tourism without any stone caps, roads, or pylon harvesting later.',
        isCorrect: false,
        rationale:
          'Nodes were capped; later cities on Nodes plus pylons harvest Loosh and Ley energy.',
      },
    ],
    hint: 'Stone Alters on Nodes — dampen natural EM emissions.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'How did technological regression invert free-energy civilization?',
    options: [
      {
        label: 'A',
        text: 'By mass-producing Tartarian atmospheric condensers for every household so Ley Line harvest became public utility forever.',
        isCorrect: false,
        rationale:
          'Condensers were systematically destroyed and smelted, replaced by coal/oil combustion dependence.',
      },
      {
        label: 'B',
        text: 'Tartarian atmospheric condensers and induction tech harvesting free EM from Ley Lines were destroyed and smelted, forcing mined coal, oil, and combustion engines instead.',
        isCorrect: true,
        rationale:
          'Free Ley energy tech was destroyed; parasitic fuel economy of coal/oil/combustion replaced mastery.',
      },
      {
        label: 'C',
        text: 'By banning wheels so only higher-density beings used crude mechanical conveyances on Earth.',
        isCorrect: false,
        rationale:
          'Parasites introduced the Wheel as control; higher-density beings do not use wheels or crude conveyances.',
      },
      {
        label: 'D',
        text: 'By teaching Evolution so atmospheric condensers could evolve into monkeys without smelting or coal.',
        isCorrect: false,
        rationale:
          'Evolution is conceptual reprogramming; tech regression is physical destruction of free-energy systems.',
      },
    ],
    hint: 'Destroy/smelt condensers → force coal, oil, combustion.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is the truth about the Wheel in this inversion?',
    options: [
      {
        label: 'A',
        text: 'It is sacred higher-density free-energy hardware that Custodians installed to liberate Taran travel forever.',
        isCorrect: false,
        rationale:
          'The Wheel was introduced by parasites as control; true ET/higher-density beings do not use wheels.',
      },
      {
        label: 'B',
        text: 'It only appears after the EMF flash when NPCs evaporate and crystalline carts replace all combustion engines.',
        isCorrect: false,
        rationale:
          'Wheel is part of long-running technological regression of the inversion, not an EMF gift.',
      },
      {
        label: 'C',
        text: 'Parasites introduced the Wheel as a control mechanism; true ET and higher-density beings do not use wheels or crude mechanical conveyances.',
        isCorrect: true,
        rationale:
          'Wheel = parasitic control tech; higher-density travel does not rely on wheels or crude mechanics.',
      },
      {
        label: 'D',
        text: 'It is identical to Baphomet Power Pylons and only harvests Loosh without any conveyance control role.',
        isCorrect: false,
        rationale:
          'Pylons siphon Ley/Loosh energy; the Wheel is separate mechanical control introduced in the downgrade.',
      },
    ],
    hint: 'Parasite control mechanism — higher density does not use wheels.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'How was the word Soul inverted linguistically?',
    options: [
      {
        label: 'A',
        text: 'Soul was celebrated as internal cosmic family while Solar System myths were banned from all schools permanently.',
        isCorrect: false,
        rationale:
          'Soul was altered to Sol to sell external Solar System myth over internal cosmic family.',
      },
      {
        label: 'B',
        text: 'Soul was only used for freemason passwords with no link to Sol, Solar System, or family cosmology.',
        isCorrect: false,
        rationale:
          'Aggressive Soul→Sol shift tricks minds into vast external Solar System instead of internal cosmic family.',
      },
      {
        label: 'C',
        text: 'Soul was upgraded to 12th density jargon so Custodians could sing true souls again without Replica tech.',
        isCorrect: false,
        rationale:
          'Linguistic inversion solidifies the prison; it does not restore Custodian high-density soul weaving.',
      },
      {
        label: 'D',
        text: 'Soul was aggressively altered to Sol, tricking humans into believing in a vast external Solar System rather than an internal cosmic family.',
        isCorrect: true,
        rationale:
          'Soul→Sol reprogramming sells external Solar System cosmology and hides internal cosmic family truth.',
      },
    ],
    hint: 'Soul → Sol — external Solar System over internal cosmic family.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'Why was the theory of Evolution fabricated?',
    options: [
      {
        label: 'A',
        text: 'To conceal intelligent laboratory genetics and make humans believe they ascended from monkeys instead of seeing deliberate genetic termination of robust hominids for fragile, exploitable Homo Sapiens.',
        isCorrect: true,
        rationale:
          'Evolution myth hides lab genetics and the swap from robust hominids to fragile, controllable Homo Sapiens.',
      },
      {
        label: 'B',
        text: 'To prove monkeys built Tartarian atmospheric condensers and should manage Ley Lines openly forever.',
        isCorrect: false,
        rationale:
          'Evolution conceals genetics history; it does not restore Tartarian free energy under monkey management.',
      },
      {
        label: 'C',
        text: 'To help G.A.A. explain why NPCs evaporate at EMF without any genetic inversion history.',
        isCorrect: false,
        rationale:
          'Evolution is parasitic conceptual inversion; G.A.A. unwinds overlays and liberates original souls.',
      },
      {
        label: 'D',
        text: 'To restore 9th density crystalline temples by natural selection without Density Suppression or freemason caps.',
        isCorrect: false,
        rationale:
          'Evolution is a cover story; temple erasure used Density Suppression and freemason footprint caps.',
      },
    ],
    hint: 'Hide lab genetics — monkey myth vs robust hominid termination.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How does biosphere inversion attack the Pineal Gland?',
    options: [
      {
        label: 'A',
        text: 'Only through freemason library lighting that raises chakra frequencies without any metals or AI nudges.',
        isCorrect: false,
        rationale:
          'Attack uses heavy metals and endocrine disruptors via systems like vaping to calcify the pineal.',
      },
      {
        label: 'B',
        text: 'Heavy metals (nickel, lead, chromium) and artificial endocrine disruptors via systems like promoted vaping calcify the pineal, stunt spiritual reception, block higher chakras, and leave the etheric body open to AI behavioral nudges.',
        isCorrect: true,
        rationale:
          'Vaping-delivered metals and disruptors calcify pineal function and open the vessel to AI control nudges.',
      },
      {
        label: 'C',
        text: 'Only by feeding authentic biological meat that strengthens pineal reception above all parasitic frequencies.',
        isCorrect: false,
        rationale:
          'Food supply was inverted to synthetic vat meat; pineal attack is metals/disruptors, not authentic meat.',
      },
      {
        label: 'D',
        text: 'By painting Black Void Plasma on eyelids so space looks bright white during sleep without calcification.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blacks the sky illusion; pineal inversion is biological heavy-metal sabotage.',
      },
    ],
    hint: 'Vape metals + disruptors — calcify pineal, AI nudges.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'How was the global food supply inverted?',
    options: [
      {
        label: 'A',
        text: 'Authentic biological meat was celebrated and free while only freemasons ate vat meat in secret lodges.',
        isCorrect: false,
        rationale:
          'Authentic meat was replaced by synthetic lab-grown vat meat through major corporate supermarkets.',
      },
      {
        label: 'B',
        text: 'Only coal was banned so atmospheric condensers could cook free Ley Line meals without supermarket control.',
        isCorrect: false,
        rationale:
          'Food inversion is synthetic vat meat distribution; coal is separate tech regression.',
      },
      {
        label: 'C',
        text: 'Authentic biological meat was completely replaced with synthetic lab-grown vat meat distributed through major corporate supermarkets since the 1960s.',
        isCorrect: true,
        rationale:
          'Since the 1960s, corporate supermarkets push synthetic vat meat as the inverted food supply.',
      },
      {
        label: 'D',
        text: 'Vat meat was banned in 1960 so only crystalline temple gardens fed the 97% NPC population honestly.',
        isCorrect: false,
        rationale:
          '1960s mark corporate vat meat rollout, not a ban or crystalline garden honesty.',
      },
    ],
    hint: 'Since 1960s — synthetic vat meat via corporate supermarkets.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'Why were villages, towns, and cities placed over positive Nodes?',
    options: [
      {
        label: 'A',
        text: 'To heal Nodes openly so dense populations would raise 9th density architecture without generating any Loosh.',
        isCorrect: false,
        rationale:
          'Dense controlled populations suppress positive energy and generate negative Loosh on purpose.',
      },
      {
        label: 'B',
        text: 'Only for freemason tourism maps that never siphoned Ley energy through roads, rails, or pylons.',
        isCorrect: false,
        rationale:
          'Infrastructure over Nodes feeds harvesting networks including roads, rails, and Baphomet pylons.',
      },
      {
        label: 'C',
        text: 'To store Georgia Guidestones blueprints underground with no energetic suppression or Loosh role.',
        isCorrect: false,
        rationale:
          'Node cities suppress positive energy and generate Loosh for harvest — Guidestones are 8th Re-set targets.',
      },
      {
        label: 'D',
        text: 'So dense controlled populations would naturally suppress positive Node energy while generating negative Loosh for harvest.',
        isCorrect: true,
        rationale:
          'Settlement on Nodes inverts energy: suppress positive flow, manufacture Loosh from controlled crowds.',
      },
    ],
    hint: 'Dense crowds on Nodes — suppress positive, generate Loosh.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What do Baphomet Power Pylons actually do?',
    options: [
      {
        label: 'A',
        text: 'They not only deliver electricity but covertly harvest backed-up Ley-Line energy from perimeters of densely populated areas, along with roads and train tracks as siphon infrastructure.',
        isCorrect: true,
        rationale:
          'Pylons plus roads/rails siphon Ley energy and Loosh architecture — not mere honest power delivery.',
      },
      {
        label: 'B',
        text: 'They only restore atmospheric condensers and free Tartarian induction for every household legally.',
        isCorrect: false,
        rationale:
          'Condensers were destroyed; pylons harvest inverted grid energy rather than restore free energy.',
      },
      {
        label: 'C',
        text: 'They only light freemason libraries and never touch Ley Lines, Nodes, or Loosh flows at all.',
        isCorrect: false,
        rationale:
          'They covertly harvest backed-up Ley-Line energy around dense populations.',
      },
      {
        label: 'D',
        text: 'They project the Emerald Palace into full 3rd density visibility without ULF blankets or gold idols.',
        isCorrect: false,
        rationale:
          'Emerald Palace is masked by ULF and stolen gold idol fields; pylons are harvest infrastructure.',
      },
    ],
    hint: 'Deliver power + harvest Ley energy around dense populations.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What is the Projection Dome\'s role in holographic concealment?',
    options: [
      {
        label: 'A',
        text: 'It is a natural cloud that teaches honest astronomy without firmament, asteroids myths, or enclosure limits.',
        isCorrect: false,
        rationale:
          'It is installed inside the true firmament to fake celestial bodies and deep dark space.',
      },
      {
        label: 'B',
        text: 'A massive dome inside the true firmament that generates fake celestial bodies like asteroid visuals and the illusion of deep dark space, hiding enclosure parameters.',
        isCorrect: true,
        rationale:
          'Projection Dome fakes sky objects and dark space so humans cannot see real enclosure parameters.',
      },
      {
        label: 'C',
        text: 'It only stores vat meat recipes for supermarkets and has no sky or firmament placement.',
        isCorrect: false,
        rationale:
          'Dome is sky concealment tech; vat meat is separate food inversion.',
      },
      {
        label: 'D',
        text: 'It permanently switches itself off every night so NPCs can practice exiting the matrix safely.',
        isCorrect: false,
        rationale:
          'G.A.A. deactivates the dome during Fake Alien Invasion/EBS sequence — not nightly NPC practice.',
      },
    ],
    hint: 'Inside firmament — fake sky bodies and dark space; hide enclosure.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How are sites like the Emerald Palace masked?',
    options: [
      {
        label: 'A',
        text: 'By freemason open-house tours that raise density so every tourist sees 9th density architecture immediately.',
        isCorrect: false,
        rationale:
          'Localized Overlays with stolen gold idols and ULF blankets mask such sanctuaries from 3rd density perception.',
      },
      {
        label: 'B',
        text: 'By moving them to Georgia Guidestones plaques with no ULF, gold idols, or North Pole placement.',
        isCorrect: false,
        rationale:
          'Emerald Palace is a North Pole high-frequency site masked in place by overlay fields.',
      },
      {
        label: 'C',
        text: 'Localized Overlays over indestructible high-frequency sites use fields of stolen gold idols and ULF blankets to completely mask them from 3rd density perception.',
        isCorrect: true,
        rationale:
          'Gold-idol fields plus ULF overlay blankets hide places like the Emerald Palace from 3rd density eyes.',
      },
      {
        label: 'D',
        text: 'By painting them with Black Void Plasma so they appear as bright white Dark Matter Field beacons to everyone.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blacks the sky; palace masking is localized Overlays with gold idols and ULF.',
      },
    ],
    hint: 'Overlays + stolen gold idols + ULF blankets.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What does Black Void Plasma conceal?',
    options: [
      {
        label: 'A',
        text: 'Only freemason coal prices, with true space remaining honestly pitch black by natural thermodynamics forever.',
        isCorrect: false,
        rationale:
          'True cosmos is bright white light; plasma creates the black-space illusion inside the firmament.',
      },
      {
        label: 'B',
        text: 'Only vat meat factories under supermarkets with no firmament or cosmos role whatsoever.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is Niberian firmament tech for fake black space over bright white truth.',
      },
      {
        label: 'C',
        text: 'Only the Spirit Tree stump so Greys can hide occupation without any sky blackening technology.',
        isCorrect: false,
        rationale:
          'Tree destruction is separate; plasma specifically fakes black space vs bright white cosmos.',
      },
      {
        label: 'D',
        text: 'The true nature of the cosmos — bright white light — by creating the illusion inside the firmament that space is black.',
        isCorrect: true,
        rationale:
          'Niberian Black Void Plasma paints fake black space so bright white cosmic truth stays hidden.',
      },
    ],
    hint: 'Fake black space — hide bright white true cosmos.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What was the ultimate strategic goal of the entire inversion?',
    options: [
      {
        label: 'A',
        text: 'Execution of the 8th Re-set, originally slated for 2019, to lock a reduced population of 500 million into an eternal loop of birth, rape, torture, and sacrifice.',
        isCorrect: true,
        rationale:
          '8th Re-set (targeted 2019) aimed at 500 million locked in eternal torture/sacrifice — the inversion\'s endgame.',
      },
      {
        label: 'B',
        text: 'A peaceful 2019 festival restoring atmospheric condensers and 9th density temples for all 178 worlds.',
        isCorrect: false,
        rationale:
          '2019 marks planned 8th Re-set cull/lock, not free-energy restoration festival.',
      },
      {
        label: 'C',
        text: 'Expanding population without Guidestones limits while G.A.A. stayed permanently banned from Gateway-10.',
        isCorrect: false,
        rationale:
          'Guidestones dictate 500 million; G.A.A. later terminates parasitic control and unwinds inversion.',
      },
      {
        label: 'D',
        text: 'Teaching Evolution honestly so monkeys could operate Baphomet pylons as free Loosh charities.',
        isCorrect: false,
        rationale:
          'Evolution is inverted cover; the strategic objective is 8th Re-set eternal harvest lock.',
      },
    ],
    hint: '8th Re-set ~2019 — 500 million eternal torture loop.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What would success of the 8th Re-set have meant?',
    options: [
      {
        label: 'A',
        text: 'Minor freemason library updates with Gateway-10 fully thriving and no threat to the multi-billion-year physical experiment.',
        isCorrect: false,
        rationale:
          'Success meant Gateway-10 complete fall and ultimate evil victory over physical creation.',
      },
      {
        label: 'B',
        text: 'Gateway-10 would have completely fallen — ultimate victory of evil over physical creation, necessitating total destruction of the multi-billion-year physical experiment.',
        isCorrect: true,
        rationale:
          '8th Re-set success = Gateway-10 fall and destruction of the multi-billion-year physical experiment.',
      },
      {
        label: 'C',
        text: 'Only NPC supermarket discounts on vat meat with no population lock or sacrifice loop attached.',
        isCorrect: false,
        rationale:
          'Target is eternal birth/torture/sacrifice lock for a reduced 500 million, not grocery discounts.',
      },
      {
        label: 'D',
        text: 'Automatic Soul/Sol correction so Solar System myths end without any Re-set or G.A.A. intervention.',
        isCorrect: false,
        rationale:
          'Re-set success is systemic fall of Gateway-10; linguistic lies are one inversion layer, not the endgame outcome.',
      },
    ],
    hint: 'Gateway-10 falls — evil wins; physical experiment destroyed.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What is the G.A.A. doing to inversion tactics during Fake Alien Invasion and EBS events?',
    options: [
      {
        label: 'A',
        text: 'Strengthening Black Void Plasma and installing thicker freemason concrete on every Node forever.',
        isCorrect: false,
        rationale:
          'G.A.A. terminates parasitic control; inversion is unwinding, not thickening.',
      },
      {
        label: 'B',
        text: 'Only rewriting Evolution textbooks while leaving the Projection Dome and Overlays fully active forever.',
        isCorrect: false,
        rationale:
          'G.A.A. deactivates Projection Dome and strips parasitic Overlays during those events.',
      },
      {
        label: 'C',
        text: 'Actively deactivating the Projection Dome and stripping parasitic Overlays so inversion concealment collapses.',
        isCorrect: true,
        rationale:
          'During Fake Alien Invasion and EBS, G.A.A. kills the dome and strips overlays — inversion tactics unwind.',
      },
      {
        label: 'D',
        text: 'Canceling the EMF flash so 97% NPCs can keep generating Loosh under Baphomet pylons indefinitely.',
        isCorrect: false,
        rationale:
          'EMF flash follows; NPCs evaporate and the inverted matrix collapses.',
      },
    ],
    hint: 'Deactivate Projection Dome + strip Overlays during invasion/EBS.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What will the 3rd density environment show as illusions melt?',
    options: [
      {
        label: 'A',
        text: 'Perfect stable globe physics with no pixelation, no scaffolding bleed-through, and no overlay failure of any kind.',
        isCorrect: false,
        rationale:
          'Environment shows severe pixelation and bleed-through scaffolding as illusions melt away.',
      },
      {
        label: 'B',
        text: 'Only freemason victory parades celebrating permanent 8th Re-set success without any G.A.A. action.',
        isCorrect: false,
        rationale:
          'G.A.A. action unwinds inversion; visuals are pixelation and scaffolding bleed-through, not freemason victory.',
      },
      {
        label: 'C',
        text: 'Only brighter Bluebeam UFOs with no connection to EBS, dome deactivation, or matrix collapse.',
        isCorrect: false,
        rationale:
          'Fake Alien Invasion/EBS sequence deactivates dome and strips overlays — illusions melt with pixelation.',
      },
      {
        label: 'D',
        text: 'Severe pixelation and bleed-through scaffolding as the illusions melt away during the G.A.A. deactivation sequence.',
        isCorrect: true,
        rationale:
          'As dome/overlays die, 3rd density shows pixelation and scaffolding bleed-through of the fake construct.',
      },
    ],
    hint: 'Severe pixelation + bleed-through scaffolding as illusions melt.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What follows the global 30-second EMF flash?',
    options: [
      {
        label: 'A',
        text: 'The 97% engineered as NPCs evaporate, collapsing the inverted matrix and liberating original souls back into higher-density truth.',
        isCorrect: true,
        rationale:
          'After 30-second EMF flash, 97% NPCs evaporate, inverted matrix collapses, original souls liberate into higher-density truth.',
      },
      {
        label: 'B',
        text: 'NPC population doubles to reinforce Loosh harvest under permanent 8th Re-set conditions forever.',
        isCorrect: false,
        rationale:
          'NPCs evaporate; the inverted matrix collapses rather than permanent Re-set harvest.',
      },
      {
        label: 'C',
        text: 'Only freemason Alters open as free Node spas while Density Suppression strengthens to 1st density.',
        isCorrect: false,
        rationale:
          'Inversion unwinds under G.A.A.; EMF path liberates original souls, not deeper density prison.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma becomes the only remaining law so bright white cosmos stays hidden after liberation.',
        isCorrect: false,
        rationale:
          'Liberation is into higher-density truth; plasma black-space lies are part of the collapsing inversion.',
      },
    ],
    hint: '97% NPCs evaporate — matrix collapses; souls free to higher density.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const finalized = finalizeOptions(
    mapped,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: finalized.correctAnswer,
  };
  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`),
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ found`);
  }
  if (hedgeRe.test(blob)) throw new Error(`Q${q.number}: hedge found`);
  const missing = (supportPhrases[q.number] || []).filter(
    (p) => !reportLower.includes(p.toLowerCase())
  );
  if (missing.length) {
    throw new Error(`Q${q.number}: unsupported: ${missing.join('; ')}`);
  }
  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
  }
  return out;
}

const questions = RAW_QUESTIONS.map(normalizeQuestion);
if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);

const letterCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const q of questions) letterCounts[q.correctAnswer]++;
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}

const DESC_SHORT =
  'Test your grasp of Inversion Tactics — Custodian betrayal, Density Suppression, Spirit Tree kill, freemason caps, tech regression, biosphere corruption, and G.A.A. unwind.';
const DESC_META =
  'Interactive Living Truth Quiz on Inversion Tactics: Spirit Tree SWAT cut, freemason temple footprints, Soul/Sol, Evolution myth, vat meat, Baphomet pylons, 8th Re-set, and EMF NPC evaporation.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: DESC_SHORT,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Inversion Tactics are not abstract politics — they are the full Custodian-built prison: Spirit Tree cut like power to a building, density dimmed to 3rd, freemason concrete on crystalline footprints, free energy smelted into coal, Soul twisted into Sol, Evolution hiding lab genetics, pineal metals, vat meat, Node cities of Loosh, Baphomet pylons, dome and ULF masks. Sit with what you missed, then return to the Inversion Tactics deep-dive. The 8th Re-set aimed at 500 million in eternal sacrifice. G.A.A. is unwinding the stack — dome off, overlays stripped, pixelation and scaffolding bleed-through, then EMF: 97% NPCs evaporate and original souls walk back into higher-density truth.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole) || hedgeRe.test(whole)) {
  throw new Error('LaTeX or hedge remains in quiz payload');
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT,
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'alice-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in alice-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

let html = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    DESC_META,
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', TOPIC_IMAGE],
  ['images/faketime.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=alice&amp;topic=nature-of-reality',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Nature of Reality deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Nature of Reality</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/alice/nature-of-reality.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a) && a.includes('nature-of-reality')) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}
if (html.includes('images/nature-of-reality.webp')) {
  html = html.split('images/nature-of-reality.webp').join(TOPIC_IMAGE);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const lines = sm.split('\n');
  const out = [];
  let inserted = false;
  const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!inserted && lines[i].includes('/quiz/alice/') && lines[i].includes('priority')) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/alice/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchors = [
      "  { path: '/quiz/alice/ice-wall.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/holographic-projection-dome.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },",
    ];
    sm = out.join('\n');
    for (const anchor of anchors) {
      if (sm.includes(anchor)) {
        sm = sm.replace(anchor, `${anchor}\n${entry}`);
        inserted = true;
        break;
      }
    }
    if (!inserted) throw new Error('Could not find sitemap anchor');
    fs.writeFileSync(sitemapScript, sm, 'utf8');
  } else {
    fs.writeFileSync(sitemapScript, out.join('\n'), 'utf8');
  }
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Sample correct answers:');
[0, 4, 9, 14, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/inversion-tactics.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
