/**
 * Hand-polish severe "longest = correct" Alice quiz cases.
 * Tightens wall-of-text corrects and rewrites wrongs as full parallel claims
 * (no stock / formula filler tails).
 *
 * Run: node scripts/polish-severe-quiz-lengths.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'data', 'quizzes', 'alice');

/**
 * Map: `${topicId}::${questionNumber}` → { correct, wrongs: [3 strings] }
 * wrongs replace the three non-correct options in current label order (A→D skipping correct).
 */
const PATCHES = {
  // ── star-seeds ──────────────────────────────────────────────
  'star-seeds::17': {
    correct:
      'Star Seeds were vulnerable to forgetting their mission; Ancients carry a Soul Codex that interfaces the lattice without conscious memory and restabilizes planetary frequencies each epoch.',
    wrongs: [
      'NPCs requested 4,000 managers to help them ascend as a bloc after the Flash, with Ancients serving only as NPC career coaches.',
      'Ancients needed Finance lessons from already-awake Star Seeds in every capital, so Codex work was secondary to banking class.',
      'Micro Suns banned all Soul Codex activity and wanted zero lattice interaction, inserting Ancients only as silent observers.',
    ],
  },
  'star-seeds::18': {
    correct:
      'Artificial simulation layers strip away; surviving Tarans and Star Seeds recover 178,000 years of memory and reunite with Soul Family outside the ice wall.',
    wrongs: [
      'Everyone including NPCs upgrades to 12th density automatically with no memory recovery required at all.',
      'Star Seeds are deleted and only Greys remain as permanent caretakers of a sealed simulation.',
      'The Final Reunion is canceled so Fake Linear Time continues without any soul-family contact.',
    ],
  },

  // ── freemasonry ─────────────────────────────────────────────
  'freemasonry::8': {
    correct:
      'A symbolic hand gesture in post-reset portraits by well-dressed men, marking Masonic allegiance and an active role in the inverted control hierarchy.',
    wrongs: [
      'A random fashion pose with no secret society meaning and no link to reset-era power structures.',
      'A G.A.A. signal used only by White Hats to identify each other in public photographs.',
      'A medical brace for injured arms worn openly by non-Masonic factory workers only.',
    ],
  },
  'freemasonry::9': {
    correct:
      'Physical evidence of high-tech civilizations before the current reset that contradicts the fabricated Masonic linear-history timeline.',
    wrongs: [
      'Ordinary modern tools that prove the official Industrial Revolution story is complete and final.',
      'Souvenirs Freemasons freely display in every public museum to celebrate Tartarian free energy.',
      'Natural rocks with no technological history and no threat to any inverted narrative.',
    ],
  },
  'freemasonry::14': {
    correct:
      'Preserve the healthiest, most intelligent adult NPCs, shelter them briefly, then deploy them to re-educate Orphan Train clones with inverted history.',
    wrongs: [
      'Send every NPC into museum basements to free all Oopas and publish Tartarian blueprints openly.',
      'Kill every skilled NPC so no re-education workforce remains after the slaughter ends.',
      'Train NPCs only in Tuning Fork free energy so locomotives run on aether after the reset.',
    ],
  },
  'freemasonry::17': {
    correct:
      'Successors to the Druids from Anuk royal bloodlines, holding old-world tuning-fork and harmonic knowledge used to build over Nodes after Density Suppression.',
    wrongs: [
      'A group that only runs Orphan Trains with no architectural role and no Anuk or Druid lineage at all.',
      'A society that began only in 1887 with no link to Druids, Anuk bloodlines, or resonant harmonics.',
      'Builders who reject all harmonics and deliberately avoid Nodes, Ley Lines, and temple footings.',
    ],
  },
  'freemasonry::21': {
    correct:
      'Post-reset tycoons founded thousands of public libraries that wrapped fake history and science in prestige so monopolized narrative looked like charity.',
    wrongs: [
      'They burned every library so no one could read and knowledge stayed purely oral forever.',
      'They stocked only Tartarian free-energy manuals and flat-earth maps for public awakening.',
      'Philanthropy was random kindness with no narrative control and no post-reset knowledge monopoly.',
    ],
  },
  'freemasonry::22': {
    correct:
      'To eradicate 15–22 million fighting-age people — the last generation taught flat earth in unregulated schooling — completing the post-Reset memory purge.',
    wrongs: [
      'To restore flat-earth curricula worldwide and rehire every home-school teacher of the Old World.',
      'To celebrate Tartarian free energy with a peaceful world fair and no demographic targeting.',
      'To train soldiers only in herbal medicine so Big Pharma could never form after the Reset.',
    ],
  },
  'freemasonry::23': {
    correct:
      'They supervised Tartaria’s destruction cover and the Industrial Revolution downgrade, including removal and smelting of free-energy infrastructure into coal systems.',
    wrongs: [
      'They rebuilt every Tuning Fork grid openly and banned coal as soon as Tartaria fell.',
      'They had no role in infrastructure; only local carpenters redesigned cities after mud-floods.',
      'They protected Atmospheric Condensers and kept Ley-line power free for every household.',
    ],
  },

  // ── parasitic-takeover ──────────────────────────────────────
  'parasitic-takeover::3': {
    correct:
      'An orchestrated rescue mission guided by the G.A.A., White Hats, and higher creator forces to free Gateway-10 from the multi-millennial parasitic occupation.',
    wrongs: [
      'A random mood shift with no G.A.A. guidance and no organized response to the occupation.',
      'A Custodian loyalty program that deepens harvest logistics and rewards denser control.',
      'An NPC entertainment festival that leaves the prison architecture fully intact forever.',
    ],
  },
  'parasitic-takeover::6': {
    correct:
      'Forcibly lower ambient vibration from 9th density to 3rd density so high-frequency architecture fades and low-frequency parasites can occupy the realm.',
    wrongs: [
      'Raise the realm to 12th density so parasites dissolve and free energy floods every city.',
      'Only dim streetlights at night with no effect on crystalline temples or ambient density.',
      'Protect Spirit Tree output so Gateway-10 stays at full original frequency permanently.',
    ],
  },
  'parasitic-takeover::18': {
    correct:
      'The soul is drawn into the false bright light of the Sun portal, processed under the Vatican, stripped of memory, and forced into a new body for continued harvest.',
    wrongs: [
      'Souls freely choose any lifetime with full memory and no Vatican or Grey escort at all.',
      'G.A.A. reunites Twin Flames immediately after death with no amnesia and no recycle loop.',
      'Death ends consciousness completely; no portal, no trap, and no reincarnation logistics exist.',
    ],
  },
  'parasitic-takeover::20': {
    correct:
      'A holographic cover over a negative ET command station manned by Greys and breakaway blondes, used to harvest Loosh, watch Black Sun banks, and broadcast lunar madness frequencies.',
    wrongs: [
      'A G.A.A. hospital that only heals children and never phases out of the human visual field.',
      'A pure romantic light for poetry with no Grey staff, no station, and no Mt Meru storage role.',
      'A natural satellite with no holography, no loosh harvest, and no frequency-broadcast function.',
    ],
  },

  // ── orphan-trains ───────────────────────────────────────────
  'orphan-trains::2': {
    correct:
      'They were not philanthropy for urban poverty but an orchestrated system to erase Tartaria knowledge, reboot awareness into ignorance, and restock parasitic harvest supply.',
    wrongs: [
      'They were a natural, kind response to city poverty with no link to resets or clone logistics.',
      'They restored full Tartarian memory to every child and banned all fabricated school history.',
      'They only moved tourists between resorts and never touched population or harvest systems.',
    ],
  },
  'orphan-trains::15': {
    correct:
      'Pre-selected Freemason survivors hidden in Arks were deployed to indoctrinate parentless clones into fabricated history, including false Evolution via natural selection.',
    wrongs: [
      'Random street vendors with no Freemason link taught only trade skills and no history at all.',
      'No adults survive any Re-set, so clones teach themselves without any indoctrination apparatus.',
      'G.A.A. Micro Suns teach pure Tartarian free-energy science and true flat-earth cosmology only.',
    ],
  },
  'orphan-trains::25': {
    correct:
      'Absolute blank-slate control, then education, finance, and religion maintain mass amnesia and compliance until the next planned harvest cycle.',
    wrongs: [
      'Permanent liberation of every clone into 12th density with no further harvest cycles planned.',
      'Open teaching of Re-set mechanics so clones refuse all future sacrifice systems immediately.',
      'Only one generation of trains with no educational, financial, or religious amnesia machinery afterward.',
    ],
  },

  // ── free-energy-architecture ────────────────────────────────
  'free-energy-architecture::7': {
    correct:
      'Advanced healing temples mislabeled as churches and monuments, sited on Nodes to draw Lattice energy for physical and spiritual restoration of the population.',
    wrongs: [
      'Ordinary stone churches with no Node siting and no free-energy or healing function at all.',
      'Coal warehouses Freemasons used only to store Industrial Revolution fuel and paper money.',
      'Empty tourist ruins built after 1900 with no link to Ley Lines or Tartarian technology.',
    ],
  },
  'free-energy-architecture::8': {
    correct:
      'Harmonic tools that sculpted and levitated stone with sound and light frequencies, temporarily rendering rock workable without chisels or slave labor.',
    wrongs: [
      'Dinner utensils for royal banquets with no construction or frequency role whatsoever.',
      'Weapons that only shattered crystalline temples so coal grids could replace free energy.',
      'Museum toys that never moved stone and never interfaced with Lattice Membrane frequencies.',
    ],
  },
  'free-energy-architecture::10': {
    correct:
      'Parasitic tech that lowers ambient frequency (e.g. 9th to 3rd density), fading high-frequency free-energy architecture from ordinary human perception.',
    wrongs: [
      'A natural aging process that gently brightens crystalline temples for everyone to see.',
      'A G.A.A. upgrade that raises density so free energy becomes louder and more available.',
      'Only a fashion term for Gothic spires with no effect on frequency or visibility of tech.',
    ],
  },
  'free-energy-architecture::14': {
    correct:
      'They were sung and woven from higher light with sustained intent, or assembled with Tuning Forks that changed stone vibration instead of hammer-and-chisel labor.',
    wrongs: [
      'Slave armies with bronze chisels and no harmonic technology built every Tartarian wall.',
      'Steam cranes from 1850 alone raised every dome with coal power and iron cables only.',
      'Buildings arrived pre-fab from the Moon station with no terrestrial construction process.',
    ],
  },
  'free-energy-architecture::16': {
    correct:
      'Edward Leedskalnin moved about 1,100 tons of limestone alone in the early 1900s using simple copper, bottles, and songs — demonstrating retained harmonic stone knowledge.',
    wrongs: [
      'He used only diesel cranes and a full modern crew, proving free-energy stone myth is false.',
      'He never moved stone; Coral Castle is a Hollywood set with foam blocks and painted plaster.',
      'He was funded by Standard Oil to advertise coal power as the only real construction force.',
    ],
  },
  'free-energy-architecture::23': {
    correct:
      'They siphon backed-up Ley-line energy, redirect the planet’s natural positive flow, and extract Loosh from stressed populations clustered around Nodes — not mere power lines.',
    wrongs: [
      'They only light homes with soft green Radium for free and never harvest population stress.',
      'They are harmless replicas of Taj Mahal free-energy centers that amplify positive aether only.',
      'They rebuild Tuning Fork putty after every Mud-flood and restore full Lattice power to cities.',
    ],
  },

  // ── resets-hidden-history ───────────────────────────────────
  'resets-hidden-history::1': {
    correct:
      'Resets systematically erased true chronology and historical memory through cyclic destruction of advanced civilizations, burying Tartaria under mud, myth, and inverted timelines.',
    wrongs: [
      'Resets gently preserved all Tartarian records in public schools for continuous open study.',
      'No resets ever occurred; history is a clean uninterrupted line from caves to smartphones.',
      'Resets only rearranged furniture in museums and never touched populations or free-energy grids.',
    ],
  },
  'resets-hidden-history::11': {
    correct:
      'Evolution via natural selection is fabricated; true species change happens simultaneously across a species in bright flashes of density, not slow random mutation over eons.',
    wrongs: [
      'Darwinian natural selection is the complete true engine of all human and animal change.',
      'Species never change at all; every form has been fixed since the first day of creation.',
      'Only lab cloning by Greys creates new species; no density flash or simultaneous uplift exists.',
    ],
  },
  'resets-hidden-history::17': {
    correct:
      'After the last Reset (America ~1860, UK ~1900), WW1 killed 15–22 million aged 15–50 who still held vestigial Old World, flat-earth, and herbal knowledge threatening the new grid.',
    wrongs: [
      'WW1 was a pure accident with no demographic targeting and no link to Old World memory holders.',
      'WW1 restored Tartarian free energy and published flat-earth maps in every school worldwide.',
      'WW1 only trained soldiers in herbal medicine so Big Pharma would never gain institutional power.',
    ],
  },
  'resets-hidden-history::21': {
    correct:
      'An orchestrated sacrifice using the swapped Olympic vessel to eliminate opposition to the Federal Reserve and other post-reset financial control structures.',
    wrongs: [
      'A random iceberg accident with no elite targeting and no link to banking legislation at all.',
      'A G.A.A. rescue drill that saved every passenger and exposed the Federal Reserve publicly.',
      'A weather balloon test that never sank and never removed any political or financial opposition.',
    ],
  },

  // ── negative-entities ───────────────────────────────────────
  'negative-entities::16': {
    correct:
      'Parasite HQ: luxury slaughterhouses, Adrenochrome warehouses, portal hubs, and dedicated secure levels for Custodians, Greys, Anuk, and allied factions under the Vatican.',
    wrongs: [
      'Only tourist gift shops and choir practice rooms with no portals and no harvest logistics.',
      'G.A.A. healing wards that rehabilitate parasites into 12th-density caretakers of pure light.',
      'Empty natural caves with no architecture, no Adrenochrome, and no multi-faction command center.',
    ],
  },
  'negative-entities::17': {
    correct:
      'An artificial negative ET command and frequency-control station under a holographic shell, manned by Greys and breakaway personnel to broadcast disruptive lunar frequencies.',
    wrongs: [
      'A pure natural rock with no crew, no holography, and no frequency role in human psychology.',
      'A G.A.A. lighthouse that only guides Twin Flames home and never phases out of view.',
      'A poetry symbol invented by Victorians with no hardware and no link to loosh or control.',
    ],
  },
  'negative-entities::18': {
    correct:
      'Sub-Hz frequency blocks pure harmonic intention, so they cannot weave true souls; they only clone vessels, recycle captives, and counterfeit life inside the trap.',
    wrongs: [
      'They create true 12th-density souls daily and gift them free will outside any harvest system.',
      'They refuse all cloning and only rescue souls from the Amnesia Vortex into full memory lives.',
      'They compose original Spirit Trees and rebuild Mt Meru power for the entire open realm.',
    ],
  },
  'negative-entities::19': {
    correct:
      'Greys stage hauntings and Orbs to sell a false ghost narrative, locking fear and purgatory illusion so consciousness stays in the 3rd-density reincarnation trap.',
    wrongs: [
      'They openly teach escape from reincarnation and never use fear or false ghost narratives.',
      'They delete all ghost stories so humans never think about death or afterlife at all.',
      'They only run radio weather alerts with no Orbs, no hauntings, and no purgatory illusion.',
    ],
  },
  'negative-entities::21': {
    correct:
      'Traumatized Reset witnesses were herded into repurposed asylums as Loosh batteries, while Orphan Trains restocked blank-slate populations for the next harvest interval.',
    wrongs: [
      'Asylums healed witnesses with free energy and released them to teach Tartarian history openly.',
      'Orphan Trains only moved tourists; asylums were libraries of free-energy engineering manuals.',
      'Both systems were abolished immediately so no loosh harvest and no clone logistics remained.',
    ],
  },

  // ── frequency-fences ────────────────────────────────────────
  'frequency-fences::3': {
    correct:
      'Memory wipe at death, vibratory suppression of the environment, chemical and biological targeting of humans, and narrative fencing so awakening stays rare and punished.',
    wrongs: [
      'Only soft music in elevators with no memory wipe, no chem targeting, and no narrative control.',
      'A single library fine system with no density tech and no effect on soul or body frequency.',
      'Open free-energy education and full memory retention as official global policy after death.',
    ],
  },
  'frequency-fences::4': {
    correct:
      'Sun-portal tech managed through Vatican subterranean levels that pulls a soul into bright amnesia light, strips identity, and queues it for forced reincarnation.',
    wrongs: [
      'A gentle review booth where souls keep full memory and freely choose their next experience.',
      'A G.A.A. reunion lounge that pairs Twin Flames before any amnesia can occur.',
      'A weather phenomenon on Earth with no soul processing and no Vatican portal connection.',
    ],
  },
  'frequency-fences::5': {
    correct:
      'Lowering a realm’s vibratory state (e.g. 9th to 3rd density) so low-frequency parasites can interact with matter while high-frequency architecture fades from view.',
    wrongs: [
      'Raising density so crystalline temples become brighter and parasites cannot land anywhere.',
      'A marketing slogan for Gothic tourism with no real effect on frequency or visibility.',
      'A natural sunset cycle that briefly dims colors without changing ambient density at all.',
    ],
  },
  'frequency-fences::6': {
    correct:
      'Projected electromagnetic frequencies that hide unmovable ancient architecture and fake the sky, stars, and distances of the inverted simulation.',
    wrongs: [
      'Paint layers on museum models with no electromagnetic role and no sky-projection function.',
      'Natural fog that only appears in valleys and never conceals crystalline temples or Nodes.',
      'G.A.A. light shows that reveal Tartaria nightly and invite public exploration of the lattice.',
    ],
  },
  'frequency-fences::14': {
    correct:
      'Omicron, Alpha Draco, and Anunnaki run at sub-hertz lows and are harmed by high ambient frequency, so they must dim the realm to occupy Gateway-10 safely.',
    wrongs: [
      'Parasites thrive at 12th density and installed Density Suppression only as an art project.',
      'High frequency strengthens parasites, so they raise the realm whenever they arrive.',
      'Density Suppression is unrelated to parasite biology and only affects radio commercials.',
    ],
  },
  'frequency-fences::17': {
    correct:
      'Vaping delivers heavy metals and endocrine disruptors that calcify the pineal, dulling intuition and sealing a primary biological frequency fence on awareness.',
    wrongs: [
      'Vaping detoxifies the pineal with pure aether vapor and restores full third-eye vision.',
      'Only printed textbooks affect the pineal; inhaled metals have no neurological impact at all.',
      'Vaping was designed by White Hats to dissolve calcification and end all density fences.',
    ],
  },
  'frequency-fences::18': {
    correct:
      'NPCs build a social Mind Camp of conformity where genuine thought is ridiculed, so the small true-soul minority is ringed by agents who echo the mandated narrative.',
    wrongs: [
      'NPCs teach free astral travel nightly and reward every break from consensus thinking.',
      'NPCs are only 3% of the population and mentor the 97% true souls toward full awakening.',
      'NPCs only manage Vatican Sun portal hardware and never police conversation or belief.',
    ],
  },
  'frequency-fences::21': {
    correct:
      'It suppresses natural free-energy Ley Lines and Nodes that powered Tartaria, installing fake scarcity so humanity depends on metered energy, debt, and forced labor.',
    wrongs: [
      'It dissolves the Projection Dome every morning so free aether powers every household openly.',
      'It only edits Heliocentrism textbooks and has no effect on energy grids or Ley Lines.',
      'It gifts unlimited free Ley Line power to every home as official public infrastructure.',
    ],
  },
  'frequency-fences::25': {
    correct:
      'Sever the 3 Strings, detox heavy metals to repair the pineal, and build inner frameworks that can hold Scare Events without psychological collapse.',
    wrongs: [
      'Double down on Religion, Finance, and Perceived Knowledge until the Flash finishes safely.',
      'Ignore detox and wait for NPCs to explain the sky pixelation in university lectures.',
      'Join 33rd Degree ranks to reform the cage from inside while keeping all three strings intact.',
    ],
  },

  // ── grey-ets ────────────────────────────────────────────────
  'grey-ets::5': {
    correct:
      'The strongest Custodian-made parasites: intellectual warriors who outsmarted their makers, broke free, and supplied Black Void Plasma that blacks out the night sky.',
    wrongs: [
      'G.A.A. healers who rebuild Spirit Trees each century and never produce Black Void Plasma.',
      'Replica Souls used only to power NPCs, with no plasma tech and no independence from Custodians.',
      'A Zeta Reticuli tourist board that invents Hill maps and has no role in sky holography.',
    ],
  },
  'grey-ets::17': {
    correct:
      'Maitrax replaced the Spirit Tree with a petrified stump, instantly damping Gateway-10 frequencies so 4th-density parasites could survive and occupy the plain.',
    wrongs: [
      'They planted more Spirit Trees until Gateway-10 overflowed with free 12th-density power.',
      'They ignored energy centers completely and only rewrote school textbooks about distant stars.',
      'They politely asked the Spirit Tree to dim while leaving full power architecture intact forever.',
    ],
  },
  'grey-ets::21': {
    correct:
      'Joint HQ for parasitic factions — Custodians, Anuk, Greys, and others each hold a subterranean level among thirteen used for slaughter, Adrenochrome, and portal ops.',
    wrongs: [
      'A Twin Flame matchmaking center run by positive Greys with no subterranean harvest levels.',
      'Only a library of Project Serpo novels with no portals and no multi-faction command structure.',
      'A G.A.A. spa that bans all Greys and permanently seals every Vatican portal entrance.',
    ],
  },

  // ── emf / false-history / world-war-i ───────────────────────
  'emf-white-flash::25': {
    correct:
      'It neutralizes Religion, Finance, and Perceived Knowledge as control strings, erases 97% herd pressure, and opens a path for true souls to process the realm’s uninstallation.',
    wrongs: [
      'It only reboots phones overnight and leaves all three control strings fully operational.',
      'It upgrades every NPC into organic 12th-density status and cancels any need for soul work.',
      'It strengthens Vatican portals so amnesia and harvest logistics run faster after the event.',
    ],
  },
  'false-history::18': {
    correct:
      '5,000-bed Loosh batteries housing shell-shocked catatonic Reset witnesses so demons hosting sold-soul elites could feed on concentrated trauma between harvest cycles.',
    wrongs: [
      'Vacation resorts that taught free-energy engineering to orphans for one peaceful summer.',
      'Libraries stocked only with Tartarian blueprints and open flat-earth astronomy courses.',
      'Temporary clinics that healed witnesses and released them to restore Old World memory publicly.',
    ],
  },
  'false-history::21': {
    correct:
      'Fallen 12th-density caretakers betrayed Source, allied with Anuk and other parasites, seized Gateway-10, and inverted it into a harvest prison served by false history.',
    wrongs: [
      'Custodians remained loyal caretakers and only wrote fairy tales with no realm inversion.',
      'The Council of 12 ordered a temporary school curriculum change with no density war involved.',
      'False history began as a marketing error by book printers with no parasitic alliance behind it.',
    ],
  },
  'world-war-i::2': {
    correct:
      'Immediately after the latest planetary Reset, engineered to wipe surviving young adults who still carried Old World memory before the new inverted society locked in.',
    wrongs: [
      'Centuries before any Reset, as a random feud with no memory-purge or demographic targeting.',
      'As a G.A.A. exercise that spared all memory-holders and published Tartarian history afterward.',
      'Only after full free-energy restoration, to celebrate peace with no slaughter of the young.',
    ],
  },
  'world-war-i::7': {
    correct:
      'It removed people with extensive herbal and natural-medicine knowledge so the new control grid could install a sickened population dependent on emerging Big Pharma.',
    wrongs: [
      'It trained every soldier as a master herbalist so Big Pharma could never form afterward.',
      'It banned all pharmaceuticals and restored Tartarian plant-medicine schools worldwide.',
      'It had no medical angle; trenches were only about border maps with no knowledge purge.',
    ],
  },
  'world-war-i::9': {
    correct:
      'Vast repurposed Old World complexes used right after the Reset to imprison shell-shocked adult witnesses as interim Loosh batteries while orphan crops matured.',
    wrongs: [
      'Brand-new hotels built for tourists with no prisoners and no link to Reset trauma harvest.',
      'Schools that taught flat earth and free energy to every surviving adult without confinement.',
      'Empty ruins ignored by Freemasons and never used for containment or loosh extraction.',
    ],
  },
  'world-war-i::10': {
    correct:
      'Adults who witnessed reptilian and parasitic slaughter were driven catatonic, swept off streets, and locked in asylums so their testimony could not seed public memory.',
    wrongs: [
      'Witnesses were given microphones and national stages to describe the Reset in full detail.',
      'All adult witnesses were healed overnight and hired as official Tartarian history teachers.',
      'No adults witnessed anything; only children saw events and immediately forgot without force.',
    ],
  },
  'world-war-i::17': {
    correct:
      'Atmospheric Condensers that powered locomotives from Lattice electromagnetic energy were removed or destroyed so rail was forced onto coal and metered fuel dependence.',
    wrongs: [
      'Condensers were upgraded and given free to every railway as permanent public infrastructure.',
      'Coal was banned and every locomotive was tuned back to full aether extraction after WW1.',
      'Rail never used free energy; condensers are a myth invented by modern conspiracy writers.',
    ],
  },
  'world-war-i::19': {
    correct:
      '33rd-degree figures like Carnegie used library philanthropy to install fabricated history and science at scale while the post-cull population was still a blank slate.',
    wrongs: [
      'Carnegie burned every library so the blank-slate population could never be re-educated at all.',
      'Libraries stocked only free-energy manuals and exposed Masonic blood-oaths in every town.',
      'Philanthropy was pure charity with no narrative payload and no link to post-cull control.',
    ],
  },

  // ── cosmology / giants / fake-alien / religion ──────────────
  'cosmology::23': {
    correct:
      'Belief in unreachable outer space blocks exploration of horizontal reality beyond the Antarctic ice wall and keeps consciousness trapped in a globe-shaped psychological cage.',
    wrongs: [
      'Outer-space belief inspires everyone to sail past the ice wall and map the full enclosed plain.',
      'Cosmology has no psychological effect; only bank accounts shape what people dare to explore.',
      'The globe model was designed by White Hats to free minds from flat-earth superstition only.',
    ],
  },
  'giant-skeletons::2': {
    correct:
      'A globally orchestrated catastrophic termination and harvest of a civilization that wipes knowledge, infrastructure, and memory so a blank-slate population can be reinstalled.',
    wrongs: [
      'A gentle cultural fashion change with no deaths, no harvest, and no loss of free-energy knowledge.',
      'A natural volcano season that randomly spares all libraries and leaves Tartaria fully documented.',
      'A G.A.A. fireworks show that upgrades every NPC into organic soul status without any culling.',
    ],
  },
  'giant-skeletons::13': {
    correct:
      'Rail lines sliced through lands the repopulated masses did not know were ancient burial mounds, exposing giant remains Freemasons then vaulted and erased from public record.',
    wrongs: [
      'Railroads carefully avoided every mound and published giant skeletons in every school textbook.',
      'Giants were planted by tourists as hoaxes and never appeared during any railroad cut or survey.',
      'Rail expansion restored burial mounds and returned all giant bones to open ceremonial display.',
    ],
  },
  'giant-skeletons::16': {
    correct:
      'Citizen calls police → universities notified → Smithsonian or London peers alerted → recovery teams seize remains within hours and bury them in restricted vaults.',
    wrongs: [
      'Citizen keeps the bones at home and hosts weekly public lectures with no institutional seizure.',
      'Universities refuse the call and demand the find stay on the front page of every newspaper.',
      'Smithsonian immediately displays the giant in a free permanent exhibit with full provenance.',
    ],
  },
  'giant-skeletons::20': {
    correct:
      'Egyptian and Anuk names on Grand Canyon landmarks mark Zep Tepi headquarters, plus early 20th-century finds of advanced remains that were seized and suppressed.',
    wrongs: [
      'The canyon is only a tourist ditch with no Anuk history and no suppressed archaeological record.',
      'All Grand Canyon finds are freely displayed at the Smithsonian with full Anuk translation plates.',
      'Zep Tepi never touched Earth; canyon names are random modern marketing with no ancient link.',
    ],
  },
  'fake-alien-invasion::23': {
    correct:
      'It shatters Amnesia Vortex programming so survivors drop false science (globe in dark space) and can process the simulation’s collapse without total mental failure.',
    wrongs: [
      'It reinstalls stronger globe belief and makes every survivor double down on NASA cosmology.',
      'It has no psychological effect; people treat Bluebeam as ordinary weather and change nothing.',
      'It only entertains NPCs while true souls sleep through the event with zero paradigm shift.',
    ],
  },
  'fake-alien-invasion::24': {
    correct:
      'Unparalleled terror encodes the parasitic infiltration into collective soul memory of Tarans so that species never again tolerates a silent multi-millennial occupation.',
    wrongs: [
      'Terror is avoided entirely; the invasion is a gentle parade that teaches nothing about parasites.',
      'Only NPCs remember the event; true souls are wiped again and learn nothing for future cycles.',
      'The fail-safe installs deeper amnesia so occupation can restart with zero collective memory.',
    ],
  },
  'religion-false-gods::25': {
    correct:
      'Immediate total uninstallation of religious belief — pause all devotion to external deities and sever the first String so cognition is not surrendered before Scare Events hit.',
    wrongs: [
      'Double daily worship of every mainstream deity until the EMF Flash finishes without preparation.',
      'Keep Religion intact and only tweak Finance slightly so the ego shield stays comfortable.',
      'Convert Scare Events into new holy festivals that deepen surrender of cognitive autonomy.',
    ],
  },

  // ── tartaria / control / evidence / spiritual / sun-moon ────
  'tartaria::6': {
    correct:
      'A tech process that lowers local vibration so higher-density Tartarian sacred architecture fades from view while low-frequency occupation hardware remains visible and “normal.”',
    wrongs: [
      'A restoration tool that brightens every Tartarian temple for public tourism and free study.',
      'A purely cultural renaming of buildings with no frequency change and no hidden architecture.',
      'A G.A.A. program that raises density until parasites cannot stand on the open plain at all.',
    ],
  },
  'tartaria::16': {
    correct:
      'Harmonic tonal architecture — advanced tuning forks and sustained intent altered the vibrational state of matter so stone could be shaped and set without brute-force labor.',
    wrongs: [
      'Only whip-driven slave crews with iron chisels built every dome, spire, and free-energy tower.',
      '3D printers from 2010 were sent back in time by Greys to fabricate all Tartarian facades.',
      'Buildings grew like plants from seeds with no human or harmonic agency involved at all.',
    ],
  },
  'control-mechanisms::22': {
    correct:
      'A fabricated historical buffer that “explains” the drop from resplendent free-energy Tartaria to the austere Industrial Revolution without admitting engineered Reset and inversion.',
    wrongs: [
      'A precise eyewitness chronicle of continuous progress with no resets and no free-energy past.',
      'A G.A.A. textbook chapter that fully discloses Mud-floods, giants, and Atmospheric Condensers.',
      'A weather diary about rainy decades with no link to civilization downgrade or narrative cover.',
    ],
  },
  'evidence-of-resets::5': {
    correct:
      'A global advanced civilization of excellence — free energy, harmonic architecture, and high culture — wiped and inverted so later populations inherit only fragments and faked timelines.',
    wrongs: [
      'A small medieval village network with no free energy and no architecture beyond wood huts.',
      'A future utopia that has not happened yet and leaves no stones, condensers, or star-fort maps.',
      'A Smithsonian brand name for coal museums that never described a real pre-reset civilization.',
    ],
  },
  'spiritual-awakening::25': {
    correct:
      'Unification with true cosmic Soul Families beyond the ice wall — instantaneous manifestation, telepathy, and exit from the forced reincarnation farm of the inverted realm.',
    wrongs: [
      'Permanent employment as NPC managers inside a stronger Projection Dome with no soul family.',
      'Reset of amnesia so survivors forget the awakening and re-enter harvest without resistance.',
      'Promotion into Grey ranks to help run Vatican portals for the next 178,000-year cycle.',
    ],
  },
  'sun-and-moon::20': {
    correct:
      'By forcing souls through the Sun’s Amnesia Vortex right after death, blocking natural non-linear time of higher densities and locking experience into Fake Linear Time loops.',
    wrongs: [
      'By teaching free non-linear time travel in every school so no soul ever loses memory at death.',
      'By shutting the Sun portal permanently so reincarnation and amnesia logistics cannot run.',
      'By only powering streetlamps at night with no effect on soul transit or perceived time.',
    ],
  },

  // ── finance / simulation / flat-earth / sol / custodians ────
  'finance-fake-money::14': {
    correct:
      'Gold Rushes targeted grandchildren of cloned orphans from the latest Re-set (America ~mid-1800s), locking a blank-slate generation into mineral frenzy and fake wealth religion.',
    wrongs: [
      'Gold Rushes targeted only ancient Tartarian kings who already knew free-energy economics.',
      'They were canceled charity events that redistributed free energy devices instead of gold myth.',
      'They happened before any Re-set and only involved tourists collecting painted stage props.',
    ],
  },
  'finance-fake-money::17': {
    correct:
      'Carnegie turned steel fortune into thousands of libraries that spread fabricated history and science, converting financial empire into narrative control disguised as philanthropy.',
    wrongs: [
      'He secretly funded EMF Flash tech for the G.A.A. and stocked only free-energy engineering texts.',
      'He refused all libraries and kept every steel dollar for private yachts with no public influence.',
      'His libraries taught flat earth, Mud-floods, and Anuk history as mandatory public curriculum.',
    ],
  },
  'finance-fake-money::21': {
    correct:
      'With Religion and Perceived Knowledge it forms a shield: deities take cognition, intellect defends faked history, and money locks attention so the ego never faces the Lie.',
    wrongs: [
      'Finance alone matters; Religion and Perceived Knowledge have no role in ego defense at all.',
      'The three dissolve each other automatically so every sleeper awakens without personal work.',
      'Only sports fandom shields the ego; money, gods, and schooling are irrelevant to control.',
    ],
  },
  'simulation-reality::21': {
    correct:
      'Through thousand-year Re-sets that liquidate populations via Mud-floods and energy weapons, then reinstall blank-slate humans under inverted history before memory can stabilize.',
    wrongs: [
      'Through open continuous history with no culls, no mud-floods, and full Tartarian archives online.',
      'Through monthly birthday parties for NPCs that never touch infrastructure or soul memory.',
      'Through G.A.A. protection that has prevented every reset attempt for the last 178,000 years.',
    ],
  },
  'flat-earth::20': {
    correct:
      'As a primary psychological cage inside the 3rd-density Simulation, enforced by schools, science, and media so horizontal reality and the ice wall stay unthinkable.',
    wrongs: [
      'As a harmless bedtime story that no institution enforces and no mind treats as mandatory fact.',
      'As a White Hat teaching tool that quickly leads everyone past the ice wall into free realms.',
      'As a temporary joke meme with no educational system and no link to simulation control design.',
    ],
  },
  'sol-soul-portal::20': {
    correct:
      'By selling “solar systems” as physical star-and-planet machines, controllers hide that a Sol-System is soul-farm architecture and keep minds trapped in globe-orbit cosmology.',
    wrongs: [
      'By openly teaching that Sol means soul farm, so every child rejects globe cosmology at once.',
      'By removing the word Sol from all languages so no linguistic deception remains possible.',
      'By only describing weather patterns with no cosmological or soul-architecture implications.',
    ],
  },
  'custodians::17': {
    correct:
      'Parasitic factions distrusted each other, so thirteen subterranean levels under the Vatican housed separate HQ tiers for Custodians, Omicron, Alpha Draco, Greys, and Anuk.',
    wrongs: [
      'They preferred open beach resorts and never built subterranean levels under any religious city.',
      'One shared picnic table held all factions because trust was total and no security tiers existed.',
      'G.A.A. assigned the Vatican as a peace embassy where parasites surrendered all harvest tools.',
    ],
  },

  // ── npc / density / firmament / recycled / oopa / inversion / loosh ─
  'npc-population::15': {
    correct:
      'No deep self-awareness or internal monologue; conversation stays glued to consensus topics, pop culture, and safe opinions that never threaten the control narrative.',
    wrongs: [
      'Constant profound self-inquiry and long internal monologues about density, resets, and soul law.',
      'Rigid focus only on free-energy physics and ice-wall geography in every casual chat.',
      'Total silence in all social settings because NPCs cannot form words without a Grey handler.',
    ],
  },
  'density-suppression::3': {
    correct:
      'Parasitic takeover and energetic reversal of Gateway-10 from a harmonious 9th-density environment into a negative 3rd-density harvest prison under inverted law.',
    wrongs: [
      'A gentle upgrade from 3rd to 12th density sponsored by Custodians for human comfort.',
      'A renaming ceremony only; frequency, law, and architecture of the realm never changed.',
      'A White Hat project that removed all parasites and restored full Spirit Tree output immediately.',
    ],
  },
  'density-suppression::13': {
    correct:
      'Freemasons laid heavy 3rd-density stone and concrete exactly over original crystalline footings and Nodes, sealing high-frequency temples under inverted buildings.',
    wrongs: [
      'They excavated every footing for public display and banned concrete over any Node worldwide.',
      'They built only glass pavilions that amplified crystalline energy for open free-energy use.',
      'They ignored Nodes completely and never coordinated architecture with density suppression tech.',
    ],
  },
  'firmament::20': {
    correct:
      'Hostile ETs breached the membrane in craft, but ambient frequencies were too high for 4th-density bodies, so they could not disembark until Density Suppression dimmed the realm.',
    wrongs: [
      'They walked in on foot through open gates with no craft and no need for any frequency dimming.',
      'They thrived at full 9th density and installed brighter frequencies to celebrate arrival.',
      'The Firmament never blocked anyone; all densities always mixed freely on the open plain.',
    ],
  },
  'recycled-souls::8': {
    correct:
      'Annihilate the surface population, harvest stem cells from sacrificed children, grow orphan clones underground, then distribute them by Orphan Train into a blank-slate landscape.',
    wrongs: [
      'Invite the old population back with full memory and hand them free-energy keys to every city.',
      'Grow no clones; leave the land empty forever with no trains and no re-education apparatus.',
      'Rescue every child into G.A.A. fleets and permanently ban stem-cell harvest after each purge.',
    ],
  },
  'oopa-artifacts::23': {
    correct:
      'Majestic Tartarian buildings repurposed as asylums for shell-shocked survivors who saw the slaughter, holding them as Loosh batteries until the new orphan population matured.',
    wrongs: [
      'Purpose-built modern hotels that never held prisoners and never linked to Reset trauma harvest.',
      'Schools that taught survivors true Tartarian history and released them within one week unharmed.',
      'Empty monuments left untouched, with no inmates and no role in interim demonic energy supply.',
    ],
  },
  'inversion-tactics::14': {
    correct:
      'Heavy metals and endocrine disruptors (e.g. via promoted vaping) calcify the pineal, dulling intuition and sealing biological inversion of human perception and spiritual reception.',
    wrongs: [
      'Vaping dissolves pineal calcification with pure minerals and restores full multidimensional sight.',
      'Only prayer beads affect the pineal; metals and nanoparticles have zero endocrine or neural role.',
      'Biosphere inversion targets only soil pH and never touches human glands or intuition channels.',
    ],
  },
  'loosh-harvesting::23': {
    correct:
      'EBS exposes trusted politicians, royalty, religious figures, and celebrities in child sacrifice and control crimes, forcing psychological rupture of the 3 Strings before physical events peak.',
    wrongs: [
      'EBS only airs cooking shows and sports so the population stays calm and fully string-tethered.',
      'EBS praises every elite as innocent and bans any mention of sacrifice, finance fraud, or religion.',
      'EBS is canceled by parasites so no psychological correction and no string-break ever occurs.',
    ],
  },
};

function applyPatch(quiz, qNum, patch) {
  const q = (quiz.questions || []).find((x) => x.number === qNum);
  if (!q) throw new Error(`${quiz.id} Q${qNum}: missing question`);
  const correct = q.options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`${quiz.id} Q${qNum}: no correct`);

  correct.text = patch.correct.trim();
  if (!/[.!?…]$/.test(correct.text) && correct.text.length > 12) {
    correct.text += '.';
  }

  const wrongs = q.options.filter((o) => !o.isCorrect);
  if (wrongs.length !== patch.wrongs.length) {
    throw new Error(
      `${quiz.id} Q${qNum}: wrong count ${wrongs.length} != ${patch.wrongs.length}`
    );
  }
  wrongs.forEach((o, i) => {
    let t = patch.wrongs[i].trim();
    if (!/[.!?…]$/.test(t) && t.length > 12) t += '.';
    o.text = t;
  });
}

function spreadStats(quiz, qNum) {
  const q = quiz.questions.find((x) => x.number === qNum);
  const cor = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  const oMax = Math.max(...wrongs.map((o) => o.text.length));
  const oMin = Math.min(...wrongs.map((o) => o.text.length));
  return {
    c: cor.text.length,
    oMax,
    oMin,
    spread: cor.text.length - oMax,
    ul:
      cor.text.length === Math.max(...q.options.map((o) => o.text.length)) &&
      q.options.filter((o) => o.text.length === cor.text.length).length === 1,
  };
}

function main() {
  const byFile = {};
  for (const key of Object.keys(PATCHES)) {
    const [id, qStr] = key.split('::');
    if (!byFile[id]) byFile[id] = [];
    byFile[id].push({ q: parseInt(qStr, 10), patch: PATCHES[key] });
  }

  let applied = 0;
  let stillSevere = 0;
  const remaining = [];

  for (const [id, items] of Object.entries(byFile)) {
    const filePath = path.join(DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn('Missing file', filePath);
      continue;
    }
    const quiz = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const { q, patch } of items) {
      applyPatch(quiz, q, patch);
      applied++;
      const st = spreadStats(quiz, q);
      if (st.ul && st.spread >= 50) {
        stillSevere++;
        remaining.push({ id, q, ...st });
      }
      console.log(
        `${id} Q${q}: c=${st.c} oMax=${st.oMax} spread=${st.spread}${st.ul ? ' UL' : ''}`
      );
    }
    fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
  }

  console.log('\n=== POLISH SUMMARY ===');
  console.log('Patches applied:', applied);
  console.log('Expected keys:', Object.keys(PATCHES).length);
  console.log('Still severe (UL spread>=50):', stillSevere);
  if (remaining.length) {
    remaining.forEach((r) => console.log(' ', r.id, 'Q' + r.q, r));
  }

  // Full Alice re-scan
  let ul = 0;
  let total = 0;
  let severe = 0;
  let cLens = [];
  let wLens = [];
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
    const quiz = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    for (const q of quiz.questions || []) {
      total++;
      const opts = q.options || [];
      const cor = opts.find((o) => o.isCorrect);
      if (!cor) continue;
      const max = Math.max(...opts.map((o) => o.text.length));
      const oMax = Math.max(
        ...opts.filter((o) => !o.isCorrect).map((o) => o.text.length),
        0
      );
      if (cor.text.length === max && opts.filter((o) => o.text.length === max).length === 1) {
        ul++;
        if (cor.text.length - oMax >= 50) severe++;
      }
      for (const o of opts) {
        if (o.isCorrect) cLens.push(o.text.length);
        else wLens.push(o.text.length);
      }
    }
  }
  const med = (a) => {
    a = [...a].sort((x, y) => x - y);
    return a[Math.floor(a.length / 2)];
  };
  console.log('\n=== FULL ALICE ===');
  console.log(`UL: ${ul}/${total} (${((100 * ul) / total).toFixed(1)}%)`);
  console.log(`Severe UL spread>=50: ${severe}`);
  console.log(`Correct med/mean: ${med(cLens)} / ${Math.round(cLens.reduce((s, x) => s + x, 0) / cLens.length)}`);
  console.log(`Wrong med/mean: ${med(wLens)} / ${Math.round(wLens.reduce((s, x) => s + x, 0) / wLens.length)}`);
}

main();
