/**
 * Installs Density Suppression quiz for Alice transmission.
 * All 25 items from data/alice-topics/density-suppression.json only.
 * Plain English; absolute Living Truth voice.
 * Run: node scripts/install-density-suppression-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'density-suppression';
const TOPIC_TITLE = 'Density Suppression';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['9th-density', '3rd density', '4th-density parasites'],
  2: ['dial', '9th-density', '15th-density', '3rd-density'],
  3: ['inversion', 'gateway-10', 'loosh'],
  4: ['overlays', 'projection dome', 'fake stars'],
  5: ['spirit tree', 'mt meru', 'hyperborea', 'toroid'],
  6: ['nodes', 'crystalline temples', 'lattice'],
  7: ['ley lines', 'crystalline lattice membrane'],
  8: ['sold soul', 'keys', 'inter-realm'],
  9: ['radium', 'kryptonite', '4th density'],
  10: ['orion greys', 'spirit tree', 'north pole', 'petrified stump'],
  11: ['woven', 'sung', 'ultra high frequency'],
  12: ['dimmer', '15th density', 'fades away'],
  13: ['freemasons', 'concrete', 'tarmac', 'footings'],
  14: ['red mercury', 'gold', 'ultra low', 'emerald palace'],
  15: ['baphomet', 'pylons', 'ley lines'],
  16: ['atmospheric condensers', 'railway', 'ley lines'],
  17: ['re-sets', 'rise and fall', 'fabricated'],
  18: ['homo sapiens', 'adrenochrome', 'telepathy'],
  19: ['amnesia vortex', 'vatican', '15 to 20 minutes'],
  20: ['heliocentrism', 'black void plasma', 'bright white'],
  21: ['galactic ancestral alliance', 'projection dome'],
  22: ['30-second', 'emf', 'project bluebeam'],
  23: ['97%', 'npc', 'pixelate'],
  24: ['star seeds', '4,000 ancients', '178,000'],
  25: ['9th density', 'gateway-10', 'prison'],
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
    question:
      'Why did 4th-density Parasites impose Density Suppression on Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'To lower an original 9th-density environment to 3rd density so parasites that cannot survive high frequency could occupy and quarantine the realm.',
        isCorrect: true,
        rationale:
          'Parasites cannot survive high-frequency environments, so they used Density Suppression to drop the realm from advanced 9th density to controlled 3rd density and enforce full quarantine.',
      },
      {
        label: 'B',
        text: 'To raise Realm-3 permanently to 15th density for Custodian beauty.',
        isCorrect: false,
        rationale:
          'Suppression lowers density; it does not restore high-density paradise for parasites.',
      },
      {
        label: 'C',
        text: 'To gift Taran humans free telepathy and end all Loosh harvest.',
        isCorrect: false,
        rationale:
          'The system traps mind-wiped souls for control and extraction, not liberation.',
      },
      {
        label: 'D',
        text: 'Because crystalline temples requested concrete overlays for fashion.',
        isCorrect: false,
        rationale:
          'Concrete and masonry hide crystalline footings; they are parasitic obfuscation, not fashion.',
      },
    ],
    hint: 'Parasites cannot live in high frequency — so they dialed the realm down.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'How does Density Suppression work as a "dial"?',
    options: [
      {
        label: 'A',
        text: 'It lowers perception from a 9th- or 15th-density reality down to restricted 3rd-density visibility so higher-vibrating structures fade from view while remaining physically present.',
        isCorrect: true,
        rationale:
          'Density Suppression dampens vibratory frequency like a dial from 9th or 15th density visibility down to 3rd, fading higher structures from view without destroying them.',
      },
      {
        label: 'B',
        text: 'It permanently erases every temple by converting it into Black Void Plasma.',
        isCorrect: false,
        rationale:
          'High-frequency architecture cannot be destroyed by parasites — only hidden.',
      },
      {
        label: 'C',
        text: 'It only changes clock time from 24 hours to 96 hours.',
        isCorrect: false,
        rationale:
          'The dial is about vibratory perception of matter and architecture, not only day length.',
      },
      {
        label: 'D',
        text: 'It raises NPCs to 12th density caretaker status automatically.',
        isCorrect: false,
        rationale:
          'NPCs vanish when suppression collapses; they are not upgraded to caretakers.',
      },
    ],
    hint: 'Dial down perception; structures stay but fade from view.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'What is the Inversion of Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'The parasitic takeover and energetic reversal of the central realm from a harmonious 9th-density environment into a negative looping 3rd-density slaughterhouse for Loosh extraction.',
        isCorrect: true,
        rationale:
          'Inversion is the overarching parasitic takeover reversing Gateway-10 from harmonious 9th density into a 3rd-density slaughterhouse designed for Loosh extraction.',
      },
      {
        label: 'B',
        text: 'A gentle G.A.A. art exhibit projected only on the moon.',
        isCorrect: false,
        rationale:
          'Inversion is multi-millennial parasitic subjugation of the central realm, not a benign show.',
      },
      {
        label: 'C',
        text: 'The natural seasonal freeze of Ley Lines every spring.',
        isCorrect: false,
        rationale:
          'It is orchestrated takeover, not a natural seasonal cycle.',
      },
      {
        label: 'D',
        text: 'The renaming of Realm-3 back to Realm-2 by Freemasons alone.',
        isCorrect: false,
        rationale:
          'Known Lands / Realm-3 labels mark the inverted partition; Inversion is the full energetic reversal.',
      },
    ],
    hint: '9th-density harmony flipped into 3rd-density Loosh farm.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'What do Overlays do under Density Suppression?',
    options: [
      {
        label: 'A',
        text: 'Project frequencies, fake stars, and technological illusions on the Projection Dome to hide unmoveable true architecture from 3rd-density perception.',
        isCorrect: true,
        rationale:
          'Overlays are projected frequencies and fake celestial bodies on the Projection Dome that hide indestructible true architecture from 3rd-density eyes.',
      },
      {
        label: 'B',
        text: 'Permanently destroy Nodes by singing them into 15th density.',
        isCorrect: false,
        rationale:
          'Overlays hide architecture; they do not grant pure harmonic creation to parasites.',
      },
      {
        label: 'C',
        text: 'Feed Atmospheric Condensers with Red Mercury only.',
        isCorrect: false,
        rationale:
          'Condensers pull Ley Line inductance; Overlays are perceptual projections.',
      },
      {
        label: 'D',
        text: 'Restore telepathy to every Homo Sapiens vessel overnight.',
        isCorrect: false,
        rationale:
          'Vessel engineering disconnected telepathy; Overlays obscure, they do not heal that.',
      },
    ],
    hint: 'Fake sky frequencies hiding real architecture.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What was the Spirit Tree (Mt Meru / Black Rock / Hyperborea)?',
    options: [
      {
        label: 'A',
        text: 'The enormously powerful central positive energy conduit of the realm at the center of the Toroid Field before negative ETs destroyed it.',
        isCorrect: true,
        rationale:
          'The Spirit Tree — Mt Meru, Black Rock, or Hyperborea — was the central positive energy conduit at the Toroid Field center before destruction.',
      },
      {
        label: 'B',
        text: 'A Freemason concrete pylon used only after 1918.',
        isCorrect: false,
        rationale:
          'It was the original high-power conduit, not post-reset masonry.',
      },
      {
        label: 'C',
        text: 'An NPC brand of supermarket wood sold for Adrenochrome crates.',
        isCorrect: false,
        rationale:
          'It is the realm\'s central energy architecture, not a commercial product.',
      },
      {
        label: 'D',
        text: 'The Projection Dome\'s outer paint layer of Black Void Plasma.',
        isCorrect: false,
        rationale:
          'Black Void Plasma darkens the sky; the Spirit Tree was the positive power source.',
      },
    ],
    hint: 'Central Toroid power conduit — later destroyed.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What are Nodes on the lattice network?',
    options: [
      {
        label: 'A',
        text: 'Extremely high-energy junction points that amplify electromagnetic energy, over which ancient Crystalline Temples (now churches/cathedrals) were originally grown.',
        isCorrect: true,
        rationale:
          'Nodes are extreme high-energy lattice junctions amplifying EM energy; Crystalline Temples were grown over them and later repurposed as churches and cathedrals.',
      },
      {
        label: 'B',
        text: 'Only subway ticket machines in the original London Underground.',
        isCorrect: false,
        rationale:
          'Nodes are planetary energy junctions under temples, not fare machines.',
      },
      {
        label: 'C',
        text: 'NPC personality chips installed during the Amnesia Vortex.',
        isCorrect: false,
        rationale:
          'Nodes are geographic lattice points, not soul-trap chips.',
      },
      {
        label: 'D',
        text: 'Sold Soul visas stamped by 33rd-degree Freemasons only.',
        isCorrect: false,
        rationale:
          'Sold Souls are Keys for inter-realm travel; Nodes are energy junctions.',
      },
    ],
    hint: 'High-energy junctions under crystalline temple growth.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'What are Ley Lines in this framework?',
    options: [
      {
        label: 'A',
        text: 'The Crystalline Lattice Membrane Network linking all Nodal points, meant to distribute harmonious planetary energy, later targeted and exploited by parasites.',
        isCorrect: true,
        rationale:
          'Ley Lines are the Crystalline Lattice Membrane Network linking Nodes to distribute harmonious energy — later targeted and exploited by parasites.',
      },
      {
        label: 'B',
        text: 'Random dirt roads with no energetic function.',
        isCorrect: false,
        rationale:
          'They are the energy grid later harvested and built over for free power and control.',
      },
      {
        label: 'C',
        text: 'Only the routes of modern nuclear submarines.',
        isCorrect: false,
        rationale:
          'Railway and pylon infrastructure ride these lines; they are planetary energy paths.',
      },
      {
        label: 'D',
        text: 'The 15-to-20-minute soul timer under the Vatican alone.',
        isCorrect: false,
        rationale:
          'That timer is Amnesia Vortex reincarnation trap timing, not Ley Lines.',
      },
    ],
    hint: 'Lattice membrane linking Nodes — later exploited.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'What is a Sold Soul in Density Suppression mechanics?',
    options: [
      {
        label: 'A',
        text: 'A human vessel hosting a demon or deeply negative entity, hijacked as a "Key" so 4th-density entities can bypass frequency barriers into Realm-3.',
        isCorrect: true,
        rationale:
          'A Sold Soul hosts a demon or deep negative entity; parasites hijack that harmonic architecture as Keys for inter-realm travel into Realm-3.',
      },
      {
        label: 'B',
        text: 'A pure Star Seed who never accepted any contract.',
        isCorrect: false,
        rationale:
          'Sold Souls are hijacked hosts for parasitic entry, not pure uncompromised seeds.',
      },
      {
        label: 'C',
        text: 'An Atmospheric Condenser serial number stamped in 1887.',
        isCorrect: false,
        rationale:
          'Condensers harvest Ley Line inductance; Sold Souls are living Keys.',
      },
      {
        label: 'D',
        text: 'Any NPC that survives the EMF flash.',
        isCorrect: false,
        rationale:
          'NPCs pixelate and vanish in the flash; Sold Souls are compromised human vessels.',
      },
    ],
    hint: 'Hosted demon/negative — Key past frequency barriers.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'Why could parasites not simply walk into the original high-density realm?',
    options: [
      {
        label: 'A',
        text: 'Extreme high vibrations act like poison (Radium or "Kryptonite") to negative entities, causing immense illness or death.',
        isCorrect: true,
        rationale:
          'High vibrations poison negative entities like Radium or Kryptonite; parasites could not enter without Density Suppression.',
      },
      {
        label: 'B',
        text: 'They lacked passports from the Council of 12 tourist office.',
        isCorrect: false,
        rationale:
          'The barrier is vibrational incompatibility, not paperwork.',
      },
      {
        label: 'C',
        text: 'Only Homo Sapiens vessels can feel high density as comfort.',
        isCorrect: false,
        rationale:
          'Original Tarans thrived in high density; parasites engineered lower vessels after freezing them out.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma already made them immune to all frequency.',
        isCorrect: false,
        rationale:
          'They still required full suppression and quarantine to occupy the realm.',
      },
    ],
    hint: 'High frequency is poison to 4th-density parasites.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'How was the realm\'s Toroid power first cut?',
    options: [
      {
        label: 'A',
        text: 'Orion Greys used phasing technology to destroy the Spirit Tree at the North Pole and replace it with a petrified stump.',
        isCorrect: true,
        rationale:
          'Orion Greys destroyed the Spirit Tree at the North Pole with phasing tech, replacing it with a petrified stump and collapsing available energy across the Gateway.',
      },
      {
        label: 'B',
        text: 'Freemasons poured Red Mercury into every church steeple at once.',
        isCorrect: false,
        rationale:
          'Red Mercury and gold idols serve ULF blanketing later; the first cut was Spirit Tree destruction.',
      },
      {
        label: 'C',
        text: 'Atmospheric Condensers drained the Toroid by overheating boilers.',
        isCorrect: false,
        rationale:
          'Condensers later rode Ley Lines; the primary cut was Spirit Tree destruction.',
      },
      {
        label: 'D',
        text: 'The G.A.A. voluntarily dimmed the field for a holiday.',
        isCorrect: false,
        rationale:
          'G.A.A. strips suppression now; the original cut was parasitic.',
      },
    ],
    hint: 'Orion Greys, North Pole Spirit Tree → petrified stump.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'Why could parasites not destroy Tartarian crystalline architecture?',
    options: [
      {
        label: 'A',
        text: 'Structures woven and sung into existence via intention and harmonic tonal frequencies resonate at Ultra High Frequency beyond parasitic weapon density.',
        isCorrect: true,
        rationale:
          'Temples woven and sung via pure intention resonate at UHF; parasitic weapons cannot destroy artifacts vibrating octaves above their density — only hide them.',
      },
      {
        label: 'B',
        text: 'Because they were made of ordinary soft clay that parasites liked.',
        isCorrect: false,
        rationale:
          'They are indestructible high-frequency crystalline works, not soft clay.',
      },
      {
        label: 'C',
        text: 'Because Freemasons already owned the demolition rights.',
        isCorrect: false,
        rationale:
          'Freemasons laid over footings; they did not gain the power to erase UHF structures.',
      },
      {
        label: 'D',
        text: 'Because NPCs refused to sign the wrecking permits.',
        isCorrect: false,
        rationale:
          'The limit is structural density incompatibility, not NPC paperwork.',
      },
    ],
    hint: 'UHF woven/sung temples — hide, cannot erase.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'What happens when the density dial turns from 15th to 3rd density for a crystalline temple?',
    options: [
      {
        label: 'A',
        text: 'The highly vibrating structure fades from lower-density perception to a bare silhouette or nothing, while still existing in the same location.',
        isCorrect: true,
        rationale:
          'Like a dimmer in a warehouse: at 15th density every detail is interactable; at 3rd density the temple fades from view yet remains present.',
      },
      {
        label: 'B',
        text: 'The temple teleports to Venus for storage.',
        isCorrect: false,
        rationale:
          'Location stays; only perception drops.',
      },
      {
        label: 'C',
        text: 'The temple converts into a Baphomet Power Pylon automatically.',
        isCorrect: false,
        rationale:
          'Pylons harvest backed-up Ley Line energy; temples are hidden, not converted into pylons.',
      },
      {
        label: 'D',
        text: 'The temple becomes fully nuclear and radiates only Loosh.',
        isCorrect: false,
        rationale:
          'It remains crystalline high-frequency architecture under suppression.',
      },
    ],
    hint: 'Fades from view — still there.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'How did Freemasons help hide suppressed crystalline footings?',
    options: [
      {
        label: 'A',
        text: 'By laying negative 3rd-density stone blockwork exactly over original crystalline footings and covering Nodes with concrete, tarmac, and masonry to mask bleed-thru harmonic scaffolding.',
        isCorrect: true,
        rationale:
          'Parasites instructed Freemasons to build over crystalline footings with concrete, tarmac, and masonry so bleed-thru harmonic scaffolding stays masked.',
      },
      {
        label: 'B',
        text: 'By polishing temples until they reached 15th density visibility for all.',
        isCorrect: false,
        rationale:
          'Their work lowered and hid, not revealed.',
      },
      {
        label: 'C',
        text: 'By planting Spirit Trees on every Node after the stump.',
        isCorrect: false,
        rationale:
          'The Spirit Tree was destroyed; masonry covered Nodes rather than restoring the conduit.',
      },
      {
        label: 'D',
        text: 'By refusing all contracts related to Realm-3.',
        isCorrect: false,
        rationale:
          'They executed footprint hijacking for the parasites.',
      },
    ],
    hint: 'Stone over crystalline footings; concrete on Nodes.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'How were sites like the North Pole Emerald Palace kept invisible without ordinary buildings?',
    options: [
      {
        label: 'A',
        text: 'Red Mercury extracted gold for satanic gold idols that project Ultra Low Frequency blankets dampening the field to invisibility.',
        isCorrect: true,
        rationale:
          'Where building was impossible, Red Mercury drew gold seams for satanic gold idols projecting ULF blankets that keep sacred sites invisible.',
      },
      {
        label: 'B',
        text: 'Only fog machines rented from Project Bluebeam vendors.',
        isCorrect: false,
        rationale:
          'ULF gold-idol blanketing is the named dampening method at such sites.',
      },
      {
        label: 'C',
        text: 'Homo Sapiens consensus alone without technology.',
        isCorrect: false,
        rationale:
          'Specialized dampening technology and gold idols are specified.',
      },
      {
        label: 'D',
        text: 'Atmospheric Condensers sprayed Black Void Plasma hourly.',
        isCorrect: false,
        rationale:
          'Condensers harvest Ley Line inductance on railways; ULF gold idols dampen polar sacred sites.',
      },
    ],
    hint: 'Red Mercury → gold idols → ULF blanket.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What do Baphomet Power Pylons harvest after Nodes are suppressed?',
    options: [
      {
        label: 'A',
        text: 'Massive electromagnetic and crystalline output backed up along Ley Lines as energy radiates outward from populated centers.',
        isCorrect: true,
        rationale:
          'Once Nodes are suppressed, backed-up positive Ley Line energy is harvested by Baphomet Power Pylons radiating from populated centers.',
      },
      {
        label: 'B',
        text: 'Only rainwater for Freemason gardens.',
        isCorrect: false,
        rationale:
          'They harvest EM and crystalline output from the suppressed grid.',
      },
      {
        label: 'C',
        text: 'Star Seed memories during the 15-to-20-minute vortex window.',
        isCorrect: false,
        rationale:
          'Memory wipe is Amnesia Vortex; pylons harvest Ley Line energy.',
      },
      {
        label: 'D',
        text: 'Nothing — pylons are decorative only.',
        isCorrect: false,
        rationale:
          'They manage and harvest backed-up planetary energy after suppression.',
      },
    ],
    hint: 'Backed-up Ley Line EM/crystalline harvest.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'Why were old-world railway tracks laid over Ley Lines?',
    options: [
      {
        label: 'A',
        text: 'So Atmospheric Condensers on locomotives could pull free electromagnetic inductance directly from the network.',
        isCorrect: true,
        rationale:
          'Tracks over Ley Lines let Atmospheric Condenser domes on locomotives pull free EM inductance from the lattice network.',
      },
      {
        label: 'B',
        text: 'So trains would avoid all Nodes and energy forever.',
        isCorrect: false,
        rationale:
          'Placement is strategic over energy paths, not avoidance.',
      },
      {
        label: 'C',
        text: 'Only to ship Red Mercury idols to the South Pole.',
        isCorrect: false,
        rationale:
          'Primary free-energy motive is condenser inductance from Ley Lines.',
      },
      {
        label: 'D',
        text: 'Because gravity makes tracks curve around a globe.',
        isCorrect: false,
        rationale:
          'Heliocentrism and gravity are named fictions of the fake cosmos under suppression.',
      },
    ],
    hint: 'Condensers ride Ley Lines for free inductance.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'What is the "Rise and Fall" of civilizations under this system?',
    options: [
      {
        label: 'A',
        text: 'A fabricated lie covering planned Re-set culling events that wiped original Taran humans with ice ages, energy weapons, mud-floods, and petrification.',
        isCorrect: true,
        rationale:
          'Rise and Fall is a fabricated lie explaining away planned Re-sets; Tarans were wiped with rapid ice ages, energy weapons, mud-floods, and petrification.',
      },
      {
        label: 'B',
        text: 'Natural economic cycles managed by honest central banks.',
        isCorrect: false,
        rationale:
          'Re-sets are genocidal planned culls, not organic market cycles.',
      },
      {
        label: 'C',
        text: 'Proof that density always rises automatically every century.',
        isCorrect: false,
        rationale:
          'Suppression and culls enforce low density; rise/fall is cover narrative.',
      },
      {
        label: 'D',
        text: 'Only a description of NPC career ladders in film and TV.',
        isCorrect: false,
        rationale:
          'It covers planetary culling of true civilizations like Tartaria\'s fall narrative.',
      },
    ],
    hint: 'Fabricated cover for planned Re-set culls.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'Why was the Homo Sapiens vessel chosen for 3rd-density trapping?',
    options: [
      {
        label: 'A',
        text: 'Smart enough to speak and form societies, but disconnected from telepathy and able to produce maximum Adrenochrome under torture.',
        isCorrect: true,
        rationale:
          'After freezing out 9th-density inhabitants, parasites engineered Homo Sapiens as ideal 3rd-density vessels: social and speaking, telepathy-disconnected, max Adrenochrome under torture.',
      },
      {
        label: 'B',
        text: 'Because it instantly ascends all NPCs at birth.',
        isCorrect: false,
        rationale:
          'The vessel traps souls for harvest and control, not automatic NPC ascension.',
      },
      {
        label: 'C',
        text: 'Because it cannot feel pain or produce any fluid under stress.',
        isCorrect: false,
        rationale:
          'Maximum Adrenochrome under torture is a selection criterion.',
      },
      {
        label: 'D',
        text: 'Because it restores full 178,000-year memory every night.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex and suppression prevent that; restoration comes when overlays fall.',
      },
    ],
    hint: 'Social + speaking, no telepathy, max Adrenochrome.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'How does the Amnesia Vortex lock souls into the suppressed loop?',
    options: [
      {
        label: 'A',
        text: 'Beneath the Vatican with Grey-managed portals, it wipes memory and injects the soul into a new infant within 15 to 20 minutes.',
        isCorrect: true,
        rationale:
          'The Amnesia Vortex under the Vatican, with Grey ET portals, intercepts death, wipes memory, and reinjects into a new infant within 15–20 minutes.',
      },
      {
        label: 'B',
        text: 'It only stores memories in gold idols at the North Pole.',
        isCorrect: false,
        rationale:
          'Idols project ULF; the vortex recycles wiped souls into new vessels.',
      },
      {
        label: 'C',
        text: 'It frees every soul to 15th density automatically.',
        isCorrect: false,
        rationale:
          'It traps eternal beings in a linear 3rd-density loop to power the matrix.',
      },
      {
        label: 'D',
        text: 'It runs only during the 30-second EMF flash.',
        isCorrect: false,
        rationale:
          'It is ongoing reincarnation trap infrastructure under suppression.',
      },
    ],
    hint: 'Vatican + Greys; wipe; 15–20 minutes into new infant.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How does the fake cosmos support Density Suppression?',
    options: [
      {
        label: 'A',
        text: 'Heliocentrism, deep space, and gravity are fictions; Black Void Plasma darkens true bright-white space while holographic bodies lock a consensus 3rd-density timeline.',
        isCorrect: true,
        rationale:
          'Heliocentrism, deep space, and gravity shrink perceived reality; Black Void Plasma makes sky dark when true space is white, and fake bodies lock consensus 3rd-density time.',
      },
      {
        label: 'B',
        text: 'True nuclear suns prove the globe and end all overlays.',
        isCorrect: false,
        rationale:
          'Those celestial models are named as fictions of the suppressed matrix.',
      },
      {
        label: 'C',
        text: 'Gravity alone holds crystalline temples invisible.',
        isCorrect: false,
        rationale:
          'Gravity is fiction; suppression and overlays hide temples.',
      },
      {
        label: 'D',
        text: 'The fake cosmos only affects animals, never humans.',
        isCorrect: false,
        rationale:
          'It locks humanity within physical and mental matrix confines.',
      },
    ],
    hint: 'Fake globe/space/gravity + black plasma sky.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'What is the G.A.A. doing to parasitic suppression technology now?',
    options: [
      {
        label: 'A',
        text: 'Actively stripping it away; removing the Projection Dome will shatter 3rd-density illusion and reveal bright white firmament and melting pixelation of the fake canopy.',
        isCorrect: true,
        rationale:
          'As the Great Spiritual Awakening concludes, the G.A.A. strips suppression tech; Projection Dome removal reveals white firmament and pixelating fake celestial canopy.',
      },
      {
        label: 'B',
        text: 'Strengthening Black Void Plasma for another 178,000 years.',
        isCorrect: false,
        rationale:
          'They strip overlays and suppression; they do not reinforce the prison sky.',
      },
      {
        label: 'C',
        text: 'Hiring Freemasons to pour more tarmac on every Node.',
        isCorrect: false,
        rationale:
          'Footprint hijacking was parasitic; G.A.A. action is removal of suppression.',
      },
      {
        label: 'D',
        text: 'Installing new Spirit Tree stumps under every cathedral.',
        isCorrect: false,
        rationale:
          'Restoration ends suppression; stumps were the original sabotage.',
      },
    ],
    hint: 'Strip overlays; dome removal; white firmament revealed.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What sequence surrounds the EMF event that collapses density suppression fields?',
    options: [
      {
        label: 'A',
        text: 'After a Fake Alien Invasion / Project Bluebeam scare, a continuous 30-second white flash strikes and density suppression fields collapse completely.',
        isCorrect: true,
        rationale:
          'A 30-second white EMF flash follows simulated Bluebeam invasion terror; during the flash, density suppression fields collapse completely.',
      },
      {
        label: 'B',
        text: 'Only a gentle radio PSA with no light or scare events.',
        isCorrect: false,
        rationale:
          'Bluebeam scare plus 30-second flash is the named sequence.',
      },
      {
        label: 'C',
        text: 'A 96-hour dusk that upgrades all parasites to 9th density.',
        isCorrect: false,
        rationale:
          'The flash collapses suppression for true-soul restoration, not parasite upgrade.',
      },
      {
        label: 'D',
        text: 'Red Mercury rain that rebuilds every gold idol.',
        isCorrect: false,
        rationale:
          'Gold idols were ULF dampeners; the EMF collapses the fields.',
      },
    ],
    hint: 'Bluebeam scare → 30-second white flash → fields collapse.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What happens to 97% of the population when suppression collapses in the flash?',
    options: [
      {
        label: 'A',
        text: 'NPCs lacking eternal souls instantly pixelate and vanish from the simulation.',
        isCorrect: true,
        rationale:
          '97% of the population — NPCs without eternal souls — instantly pixelate and vanish when density suppression collapses in the flash.',
      },
      {
        label: 'B',
        text: 'They all become 4,000 Ancients overnight.',
        isCorrect: false,
        rationale:
          'Surviving true souls include Star Seeds and 4,000 Ancients; NPCs vanish.',
      },
      {
        label: 'C',
        text: 'They inherit all Baphomet Pylons as personal property.',
        isCorrect: false,
        rationale:
          'They leave the simulation; they do not inherit grid hardware.',
      },
      {
        label: 'D',
        text: 'They remember 178,000 years before anyone else.',
        isCorrect: false,
        rationale:
          'Memory return is for remaining true souls as overlays dissolve.',
      },
    ],
    hint: 'NPCs pixelate out — 97%.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What do remaining true souls experience as overlays dissolve?',
    options: [
      {
        label: 'A',
        text: 'Bleed-through of indestructible crystalline architecture and return of suppressed memories of the last 178,000 years (Star Seeds and 4,000 Ancients).',
        isCorrect: true,
        rationale:
          'For Star Seeds and 4,000 Ancients who remain, dissolving overlays reveals crystalline architecture bleed-through and restores 178,000 years of suppressed memory.',
      },
      {
        label: 'B',
        text: 'Permanent blindness under thicker Black Void Plasma.',
        isCorrect: false,
        rationale:
          'True bright white firmament and architecture become visible, not thicker black plasma.',
      },
      {
        label: 'C',
        text: 'Forced conversion into Sold Soul Keys for Draco travel.',
        isCorrect: false,
        rationale:
          'Suppression ending liberates true souls from the 3rd-density prison.',
      },
      {
        label: 'D',
        text: 'Immediate hiring as Freemason masons for new tarmac Nodes.',
        isCorrect: false,
        rationale:
          'Restoration ends the need for footprint hijacking of crystalline sites.',
      },
    ],
    hint: 'Crystalline bleed-through + 178,000-year memory return.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What does the end of Density Suppression mean for Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'Final destruction of the 3rd-density prison and absolute restoration of physical perfection on Gateway-10.',
        isCorrect: true,
        rationale:
          'Ending Density Suppression equals final destruction of the 3rd-density prison and absolute restoration of physical perfection on Gateway-10.',
      },
      {
        label: 'B',
        text: 'A new thousand-year Re-set scheduled by Orion Greys immediately.',
        isCorrect: false,
        rationale:
          'The strategic outcome is prison end and restoration, not a fresh parasitic reset.',
      },
      {
        label: 'C',
        text: 'Permanent 3rd-density quarantine under stronger pylons.',
        isCorrect: false,
        rationale:
          'Suppression ends; perfection is restored, not deepened quarantine.',
      },
      {
        label: 'D',
        text: 'Only cosmetic sky color change with no density shift.',
        isCorrect: false,
        rationale:
          'The entire 3rd-density prison ends with restoration of the high-density physical state.',
      },
    ],
    hint: 'Prison destroyed; physical perfection restored.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const options = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  if (q.correctAnswer !== correct.label) {
    throw new Error(
      `Q${q.number}: correctAnswer ${q.correctAnswer} != isCorrect ${correct.label}`
    );
  }
  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: q.correctAnswer,
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

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Density Suppression — the density dial, Spirit Tree cut, overlays, Nodes and Ley Lines, ULF blanketing, vessel engineering, and the G.A.A. collapse of the 3rd-density prison.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Density Suppression is the dial that dropped Gateway-10 from living 9th-density perfection into a 3rd-density quarantine so 4th-density parasites could breathe. Spirit Tree destroyed, temples woven too high to smash — only hidden — Freemason concrete over Nodes, gold idols blasting ULF, Baphomet pylons milking Ley Lines, Homo Sapiens vessels for max Adrenochrome, Amnesia Vortex recycling every 15–20 minutes. Sit with what you missed, then return to the Density Suppression deep-dive. When the G.A.A. strips the dome and the 30-second flash hits, the prison ends and crystalline perfection bleeds back through.',
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
  description:
    'Test your understanding of Density Suppression — density dial, Spirit Tree, overlays, Nodes, Ley Lines, ULF blanketing, and the collapse of the 3rd-density prison.',
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const mono = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'alice-topics.json'), 'utf8'));
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
if (!findAndPatch(mono.topics)) throw new Error('density-suppression not found');
fs.writeFileSync(
  path.join(ROOT, 'data', 'alice-topics.json'),
  JSON.stringify(mono, null, 2) + '\n',
  'utf8'
);

let html = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Density Suppression: the density dial, Spirit Tree cut, overlays, Nodes and Ley Lines, ULF blanketing, and collapse of the 3rd-density prison.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/density.webp'],
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
for (const [a, b] of replacements) html = html.split(a).join(b);
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/alice/custodians.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) throw new Error('sitemap anchor missing');
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('PASS: density-suppression 25/25');
