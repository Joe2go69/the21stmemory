/**
 * Installs Phase One-Three quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/phase-one-three.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run:
 *   node scripts/install-phase-one-three-quiz.js
 *   node scripts/rebalance-quiz-length.js data/quizzes/breakdown/phase-one-three.json
 *   node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'phase-one-three';
const TOPIC_TITLE = 'Phase One-Three';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/phase-one-three.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

/** Support phrases grounded only in phase-one-three.json report. */
const supportPhrases = {
  1: ['great purge', 'top-down', 'parasitic control'],
  2: ['covid', 'lockdown', 'apex'],
  3: ['global leadership', 'cultural influencers', 'illicit economies'],
  4: ['clones', 'stand-in', 'a.i'],
  5: ['whitehats', 'military', 'mass awakening'],
  6: ['dumbs', 'underground', 'supply lines'],
  7: ['resonating souls', 'high frequency', 'anchor truth'],
  8: ['royalty', 'vatican', 'arrested'],
  9: ['stock market', 'trafficking', 'adrenochrome'],
  10: ['phase one', 'world leader', 'media mogul'],
  11: ['silent arrests', 'lockdown', 'mass panic'],
  12: ['child predators', 'satanic operators'],
  13: ['phase two', 'infrastructure sweep', 'ceos'],
  14: ['entertainment', 'sports icons', 'cultural influencers'],
  15: ['hypnotic influence', 'politics', 'frequency vibration'],
  16: ['phase three', '3rd realm', 'shipping routes'],
  17: ['organ harvesting', 'adrenochrome', 'trafficking'],
  18: ['illicit cargoes', 'tunnel networks', 'lifeblood'],
  19: ['covert groundwork', 'time window', 'societal collapse'],
  20: ['phase four', 'narrative maintenance', 'business as usual'],
  21: ['phase five', 'phase six', 'e.b.s'],
  22: ['visually intact', 'power is reduced to zero'],
  23: ['catastrophic trauma', 'chaos', 'methodical'],
  24: ['3d overlay', 'restored realm', 'frequency'],
  25: ['stand-ins', 'sleepers', 'manageable state']
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

/**
 * Each question: { question, hint, options: [correct, wrong, wrong, wrong] }
 * with { text, rationale }. finalizeOptions shuffles labels.
 */
const RAW = [
  {
    question: 'What is The Great Purge?',
    hint: 'Think top-down eradication of the structures that governed the physical realm.',
    options: [
      {
        text: 'A systematic, top-down eradication of parasitic control structures that previously governed the physical realm, working from the pyramid apex downward.',
        rationale:
          'The Great Purge methodically removes parasitic controllers from power, starting at the top of the global pyramid and working downwards.'
      },
      {
        text: 'A bottom-up street revolt that begins with local vendors and never touches royalty, banking heads, or media moguls.',
        rationale:
          'The operation targets the apex of the planetary control pyramid first, not a random bottom-up street revolt.'
      },
      {
        text: 'An overnight weather program that dissolves every city on day one with no multi-phase sequence or stand-in replacements.',
        rationale:
          'Phases One through Three are sequenced covert strikes that preserve stability with clones and stand-ins, not instant city-wide dissolution.'
      },
      {
        text: 'A pure finance rebrand that leaves world leaders, cultural influencers, and underground economies fully intact.',
        rationale:
          'The purge neutralizes leadership, severs cultural influence, and guts underground illicit economies — it is not a cosmetic finance rebrand.'
      }
    ]
  },
  {
    question: 'Under what cover were Phases One through Three primarily executed?',
    hint: 'Recall the global operations that masked silent arrests and stand-in substitutions.',
    options: [
      {
        text: 'The COVID lockdown operations, which provided cover for silent arrests and seamless elite replacements.',
        rationale:
          'The sequence was executed primarily under the cover of the COVID lockdown operations while targets were neutralized and replaced.'
      },
      {
        text: 'Open televised tribunals held in every capital so the public could watch every arrest in real time from day one.',
        rationale:
          'Early phases were covert; silent arrests and optics replacements avoided mass panic rather than open day-one tribunals.'
      },
      {
        text: 'A voluntary corporate retreat series where CEOs resigned on camera with full public confession scripts.',
        rationale:
          'Corporate CEOs were stripped of real-world power in a Whitehat takeover and replaced for optics, not voluntary public confessions.'
      },
      {
        text: 'A single-day Emergency Broadcast System reveal that skipped all prior covert groundwork phases.',
        rationale:
          'E.B.S. revelation is Phase Seven; Phases One through Three are the covert groundwork that comes first.'
      }
    ]
  },
  {
    question: 'What three domains do Phases One through Three strike as the critical initial wave?',
    hint: 'Leadership apex, cultural influence, and subterranean illicit economies.',
    options: [
      {
        text: 'Global leadership, cultural influencers, and subterranean illicit economies that fund parasitic power.',
        rationale:
          'Phases One through Three are the critical initial strikes against global leadership, cultural influencers, and subterranean illicit economies.'
      },
      {
        text: 'Only surface fashion brands, local weather stations, and civilian sports leagues with no elite targeting.',
        rationale:
          'The strikes hit the control pyramid apex, cultural hypnotic influence, and underground economies — not minor surface brands alone.'
      },
      {
        text: 'Outer-space colonies, lunar bases, and distant planetary outposts with no Earth-side pyramid work.',
        rationale:
          'This topic centers on the planetary control pyramid, lockdown operations, DUMBS, and Earth-side infrastructure — not outer-space colonies.'
      },
      {
        text: 'Sleepers, resonating souls, and Whitehats as three populations to be arrested together on day one.',
        rationale:
          'Whitehats execute the purge; resonating souls anchor light; sleepers are held manageable — none of those are the three strike domains.'
      }
    ]
  },
  {
    question: 'What are Clones in this operation?',
    hint: 'Biological copies and related mimic tools used after neutralization.',
    options: [
      {
        text: 'Biological copies deployed with stand-in actors, masks, holographical projections, and A.I. Driven Composites to replace neutralized leaders for public optics.',
        rationale:
          'Clones are biological copies used with stand-ins, masks, holographics, and A.I. composites so neutralized leaders still appear for public optics.'
      },
      {
        text: 'Permanent free-will world leaders who keep full original power and never follow scripted optics after replacement.',
        rationale:
          'Clones and stand-ins preserve optics while real-world power is stripped — they are not permanent free-will rulers with original power.'
      },
      {
        text: 'Only cartoon mascots with no biological, holographic, or A.I. composite technology involved in elite replacement.',
        rationale:
          'The toolkit explicitly includes biological copies, stand-in actors with masks, holographical projections, and A.I. Driven Composites.'
      },
      {
        text: 'Underground tunnel workers who dismantle DUMBS by hand without any role in leadership optics.',
        rationale:
          'DUMBS dismantling is a Phase Three military action; clones replace neutralized leaders for public optics.'
      }
    ]
  },
  {
    question: 'Who are the Whitehats?',
    hint: 'Allied forces that execute the purge and control the awakening timeline.',
    options: [
      {
        text: 'Allied military and multidimensional operational forces that execute the purge, strip elite real-world power, and control the mass awakening timeline.',
        rationale:
          'Whitehats are allied military and multidimensional forces responsible for the purge, stripping elite power, and managing the mass awakening timeline.'
      },
      {
        text: 'Parasitic banking heads who expand trafficking pipelines while posing as reformers under a new brand.',
        rationale:
          'Whitehats strip real-world power from the elite and dismantle parasitic lifeblood; they are not the banking parasites.'
      },
      {
        text: 'Unawakened sleepers who only watch television and never touch any operational timeline or infrastructure.',
        rationale:
          'Sleepers are held in a manageable state by narrative maintenance; Whitehats run the operational purge.'
      },
      {
        text: 'Entertainment royalty who keep hypnotic influence over politics and tastes after the infrastructure sweep.',
        rationale:
          'Entertainment royalty and cultural influencers are Phase Two targets stripped of real-world power, not the Whitehat alliance.'
      }
    ]
  },
  {
    question: 'What are DUMBS?',
    hint: 'Expand the acronym and its role in the illicit supply network.',
    options: [
      {
        text: 'Deep Underground Military Bases — subterranean tunnel systems and underground cities dismantled to sever the parasites illicit supply lines.',
        rationale:
          'DUMBS are Deep Underground Military Bases and underground cities dismantled by military forces to sever illicit supply lines.'
      },
      {
        text: 'Surface shopping districts rebranded as free-energy markets with no subterranean parasite function at all.',
        rationale:
          'DUMBS are subterranean bases and tunnel systems used for illicit supply — not surface shopping rebrands.'
      },
      {
        text: 'Public stock exchanges where adrenochrome and trafficking revenue is listed openly for ordinary investors.',
        rationale:
          'The stock market was backed by the underground economy in secret; DUMBS are the underground bases and tunnels themselves.'
      },
      {
        text: 'Broadcast studios that air only Phase Seven E.B.S. material and never house tunnel networks.',
        rationale:
          'DUMBS are deep underground military bases and tunnel networks targeted in Phase Three, not E.B.S. broadcast studios.'
      }
    ]
  },
  {
    question: 'Who are Resonating Souls in this architecture?',
    hint: 'High-frequency beings during the collapse of parasitic systems.',
    options: [
      {
        text: 'Awakened beings holding high frequency vibration who anchor truth and light during the collapse of parasitic systems.',
        rationale:
          'Resonating Souls are awakened beings of high frequency vibration who anchor truth and light as parasitic systems collapse.'
      },
      {
        text: 'Unawakened sleepers kept manageable by business-as-usual optics and controlled stand-in messaging alone.',
        rationale:
          'Sleepers are held manageable by narrative maintenance; Resonating Souls are the awakened anchors of truth and light.'
      },
      {
        text: 'Neutralized world leaders permanently restored to full pyramid power after the silent lockdown arrests.',
        rationale:
          'Neutralized leaders are replaced by clones and stand-ins with real power stripped; they are not Resonating Souls.'
      },
      {
        text: 'Only sports icons whose hypnotic influence over tastes is strengthened after the infrastructure sweep.',
        rationale:
          'Sports icons are Phase Two targets stripped of real-world power so hypnotic influence is severed, not amplified.'
      }
    ]
  },
  {
    question: 'Which highest echelons of global leadership have already been arrested or removed?',
    hint: 'Royalty, governments, military, and religious hierarchy at the apex.',
    options: [
      {
        text: 'Royalty, prime ministers, military brass, and Vatican hierarchy — already arrested or removed and replaced for optics.',
        rationale:
          'The highest echelons — including royalty, prime ministers, military brass, and Vatican hierarchy — have already been arrested or removed.'
      },
      {
        text: 'Only mid-level city clerks with no reach into royalty, military brass, or Vatican hierarchy at all.',
        rationale:
          'The takedown reaches the highest echelons of global leadership, not merely mid-level clerks.'
      },
      {
        text: 'Every resonating soul worldwide, so that only sleepers remain to manage the awakening timeline.',
        rationale:
          'Resonating souls anchor truth and light; the arrests target parasitic leadership echelons, not awakened anchors.'
      },
      {
        text: 'No one of consequence — all royalty and prime ministers remain in full original power without stand-ins.',
        rationale:
          'Those highest echelons have already been arrested or removed and replaced with mimic technology, clones, and stand-ins.'
      }
    ]
  },
  {
    question: 'What underground parasitic economy heavily backed the world stock market foundation?',
    hint: 'Trafficking, harvesting, and smuggling pipelines as financial and biological lifeblood.',
    options: [
      {
        text: 'Human trafficking, adrenochrome harvesting, and drug smuggling pipelines that formed the market financial and biological lifeblood.',
        rationale:
          'The world stock market foundation was heavily backed by human trafficking, adrenochrome harvesting, and drug smuggling pipelines.'
      },
      {
        text: 'Only open agricultural futures with no link to trafficking, adrenochrome, or underground drug pipelines.',
        rationale:
          'The backing named is the underground parasitic economy of trafficking, adrenochrome, and drug smuggling — not clean agriculture alone.'
      },
      {
        text: 'Volunteer community co-ops that published every ledger entry for public audit during lockdowns.',
        rationale:
          'The underground economy was illicit and parasitic; allied special forces seized and neutralized that lifeblood covertly.'
      },
      {
        text: 'Phase Seven E.B.S. advertising revenue collected after the false reality was already shattered on air.',
        rationale:
          'Stock-market backing by the underground economy is revealed as already in place; Phase Three seizes that lifeblood before E.B.S.'
      }
    ]
  },
  {
    question: 'What is the focus of Phase One: Target the Most Dangerous Parasites?',
    hint: 'Those who controlled resources, narrative, and enforcement at the top.',
    options: [
      {
        text: 'Neutralizing those who controlled global resources, the narrative, and enforcement — including world leaders, high police officials, banking heads, and media moguls.',
        rationale:
          'Phase One neutralized controllers of resources, narrative, and enforcement: world leaders, high police officials, banking heads, and media moguls.'
      },
      {
        text: 'Replacing only sports icons and entertainment royalty while leaving banking heads and media moguls untouched.',
        rationale:
          'Sports icons and entertainment royalty are Phase Two targets; Phase One hits world leaders, police, banking, and media apex.'
      },
      {
        text: 'Taking over global shipping routes and dismantling DUMBS before any leadership arrests occur.',
        rationale:
          'Shipping routes and DUMBS dismantling belong to Phase Three; Phase One targets the most dangerous leadership parasites first.'
      },
      {
        text: 'Broadcasting the full E.B.S. revelation so sleepers instantly see every satanic operator on day one.',
        rationale:
          'Phase One uses silent arrests and stand-ins to avoid mass panic; E.B.S. shatter is Phase Seven after covert groundwork.'
      }
    ]
  },
  {
    question: 'How were Phase One targets removed without triggering mass panic?',
    hint: 'Silent method during lockdowns plus instant substitution.',
    options: [
      {
        text: 'Silent arrests during lockdown operations with instant substitution by artificial and biological stand-ins.',
        rationale:
          'The method relied on silent arrests during lockdown operations, instantly substituting targets with artificial and biological stand-ins.'
      },
      {
        text: 'Live stadium trials where every banking head confessed on giant screens before any replacement optics.',
        rationale:
          'Silent arrests and immediate stand-in substitution prevented mass panic; there were no live stadium confessions in Phase One.'
      },
      {
        text: 'Public resignation letters only, with no arrests and no artificial or biological stand-in technology used.',
        rationale:
          'Targets were removed via silent arrests and replaced with artificial and biological stand-ins, not mere public resignation letters.'
      },
      {
        text: 'Full military street lockdowns of Phase Six enacted before any elite neutralization at the pyramid apex.',
        rationale:
          'Phase Six military street presence comes later; Phase One silent arrests under lockdown cover come first.'
      }
    ]
  },
  {
    question: 'Which operators did Phase One specifically remove without mass panic?',
    hint: 'Predators and satanic operators at the dangerous apex.',
    options: [
      {
        text: 'Child predators and satanic operators among the neutralized leadership targets replaced for optics.',
        rationale:
          'Silent substitution removed child predators and satanic operators without triggering mass panic.'
      },
      {
        text: 'Only sports referees with no connection to leadership predation or satanic operator networks.',
        rationale:
          'Phase One targets the most dangerous parasites in leadership and enforcement, including child predators and satanic operators.'
      },
      {
        text: 'Resonating souls who anchor truth, so that only sleepers remain to raise frequency vibration.',
        rationale:
          'Resonating souls are freed to think and raise frequency; Phase One removes predatory parasitic operators, not resonating souls.'
      },
      {
        text: 'Nobody — child predators and satanic operators were left in full public power for optics honesty.',
        rationale:
          'Those operators were removed via silent arrests and stand-in substitution so the public did not panic before the correct phase.'
      }
    ]
  },
  {
    question: 'What is Phase Two called, and what does the name signal?',
    hint: 'The second phase name points at influence infrastructure, not only tunnels.',
    options: [
      {
        text: 'Infrastructure Sweep — the Whitehat takeover that strips cultural and corporate influence infrastructure of real-world power.',
        rationale:
          'Phase Two is the Infrastructure Sweep: a massive Whitehat takeover stripping CEOs, entertainment royalty, sports icons, and cultural influencers of real power.'
      },
      {
        text: '3rd Realm Collapse — the shipping-route and DUMBS dismantling that hits underground economies first.',
        rationale:
          '3rd Realm Collapse is Phase Three; Phase Two is the Infrastructure Sweep of cultural and corporate influence.'
      },
      {
        text: 'Narrative Maintenance — the later phase where stand-ins keep business as usual for sleepers only.',
        rationale:
          'Narrative Maintenance is Phase Four after Phases One through Three; Phase Two is Infrastructure Sweep.'
      },
      {
        text: 'Target the Most Dangerous Parasites — the leadership and media apex arrests of the first phase only.',
        rationale:
          'Target the Most Dangerous Parasites is Phase One; Phase Two is Infrastructure Sweep of cultural influencers and CEOs.'
      }
    ]
  },
  {
    question: 'Which groups did Phase Two specifically target?',
    hint: 'Corporate, entertainment, sports, and cultural influence layers.',
    options: [
      {
        text: 'Corporate CEOs, entertainment royalty, sports icons, and cultural influencers stripped of real-world power for optics-only roles.',
        rationale:
          'Phase Two targeted corporate CEOs, entertainment royalty, sports icons, and cultural influencers — replaced strictly for optics.'
      },
      {
        text: 'Only Vatican hierarchy and prime ministers, leaving all CEOs and sports icons in full original power.',
        rationale:
          'Vatican hierarchy and prime ministers are named in the highest-echelon arrests; Phase Two specifically hits CEOs, entertainment, sports, and cultural influencers.'
      },
      {
        text: 'Deep tunnel crews alone, with no action against entertainment royalty or corporate executive power.',
        rationale:
          'Tunnel and DUMBS work is Phase Three; Phase Two is the cultural and corporate infrastructure sweep.'
      },
      {
        text: 'Every sleeper household, forcing mass panic before any Whitehat takeover of influencer layers.',
        rationale:
          'Phase Two severs hypnotic influence so people can think freely; it does not panic every sleeper household as the primary target list.'
      }
    ]
  },
  {
    question: 'What operational purpose did Phase Two serve for the population?',
    hint: 'Break hypnotic influence so frequency can rise.',
    options: [
      {
        text: 'Sever the parasites hypnotic influence over politics, tastes, and thinking so resonating souls can think freely and raise frequency vibration consciousness.',
        rationale:
          'Phase Two severs parasitic hypnotic influence over politics, tastes, and thinking, freeing resonating souls to raise frequency vibration consciousness.'
      },
      {
        text: 'Increase hypnotic media power so sleepers never question politics, tastes, or thinking again.',
        rationale:
          'The purpose is the opposite: sever hypnotic influence so people can think for themselves and raise frequency.'
      },
      {
        text: 'Publish every DUMBS map on day one so underground cargo routes become public tourist attractions.',
        rationale:
          'DUMBS dismantling is Phase Three military work; Phase Two focuses on cultural and corporate influence infrastructure.'
      },
      {
        text: 'Restore full original power to media moguls after a brief optics-only suspension of their brands.',
        rationale:
          'Targets were stripped of real-world power and kept only for optics; hypnotic influence is severed, not restored.'
      }
    ]
  },
  {
    question: 'What is Phase Three: 3rd Realm Collapse aimed at?',
    hint: 'The underground economy funding parasite power.',
    options: [
      {
        text: 'The underground economy funding parasite power — shipping routes, illicit cargoes, DUMBS, and tunnel networks that moved the lifeblood supply.',
        rationale:
          'Phase Three aimed directly at the underground economy funding parasite power via shipping routes, illicit cargoes, DUMBS, and tunnels.'
      },
      {
        text: 'Only surface fashion influencers with no action on shipping routes, DUMBS, or illicit cargoes.',
        rationale:
          'Surface cultural influencers are Phase Two; Phase Three hits the underground economy and subterranean infrastructure.'
      },
      {
        text: 'Replacing royalty with clones while leaving trafficking pipelines and adrenochrome production running.',
        rationale:
          'Leadership replacement is earlier work; Phase Three seizes illicit cargoes and dismantles trafficking and adrenochrome production.'
      },
      {
        text: 'A pure narrative speech series with no military takeover of global shipping or tunnel dismantling.',
        rationale:
          'Military and allied special forces took over shipping routes, seized cargoes, and dismantled DUMBS — not speeches alone.'
      }
    ]
  },
  {
    question: 'Which underground pipelines and productions did Phase Three target?',
    hint: 'Human supply and harvesting systems funding parasite power.',
    options: [
      {
        text: 'Human and child trafficking pipelines, organ harvesting, and adrenochrome production that supplied parasite lifeblood.',
        rationale:
          'Phase Three targeted human and child trafficking pipelines, organ harvesting, and adrenochrome production to remove that lifeblood.'
      },
      {
        text: 'Only legal pharmacy chains that published transparent inventories with no trafficking or harvesting link.',
        rationale:
          'The targets are illicit trafficking, organ harvesting, and adrenochrome production funding parasitic power.'
      },
      {
        text: 'Entertainment award shows alone, without seizing cargoes or dismantling underground production sites.',
        rationale:
          'Entertainment royalty is Phase Two; Phase Three seizes illicit cargoes and dismantles underground production networks.'
      },
      {
        text: 'Resonating-soul meditation circles that raise frequency without any link to trafficking economies.',
        rationale:
          'Resonating souls anchor truth and light; Phase Three dismantles parasitic trafficking and harvesting economies.'
      }
    ]
  },
  {
    question: 'What did military and allied special forces do in Phase Three operations?',
    hint: 'Shipping control, cargo seizure, and subterranean dismantling.',
    options: [
      {
        text: 'Took over global shipping routes, seized illicit cargoes, and dismantled DUMBS and tunnel networks to cut money and human supply.',
        rationale:
          'Military and allied special forces took over global shipping routes, seized illicit cargoes, and dismantled DUMBS and tunnel networks.'
      },
      {
        text: 'Handed shipping routes back to banking heads so trafficking cargoes could resume under new logos.',
        rationale:
          'Forces seized illicit cargoes and severed supply lines; they did not restore trafficking pipelines to banking heads.'
      },
      {
        text: 'Only filmed documentary trailers about tunnels without seizing cargoes or dismantling any base.',
        rationale:
          'The operation was physical takeover and dismantling — shipping routes, cargo seizure, and DUMBS destruction.'
      },
      {
        text: 'Installed new media moguls with full narrative control before any underground economy action.',
        rationale:
          'Media moguls were Phase One targets already removed; Phase Three hits underground economy and DUMBS networks.'
      }
    ]
  },
  {
    question: 'Why did Whitehats complete Phases One through Three as covert groundwork first?',
    hint: 'Buy a time window without full-scale societal collapse.',
    options: [
      {
        text: 'To neutralize physical threats and sever financial lifeblood first, buying a time window to dismantle world infrastructure without full-scale societal collapse.',
        rationale:
          'By neutralizing threats and severing financial lifeblood first, Whitehats bought the time window to dismantle infrastructure without full-scale societal collapse.'
      },
      {
        text: 'To maximize public trauma on day one by revealing every satanic operator before any power was stripped.',
        rationale:
          'Covert execution preserves stability; early full exposure without methodical dismantling would cause catastrophic trauma and chaos.'
      },
      {
        text: 'To skip straight to Phase Seven E.B.S. without any leadership replacement or underground seizure work.',
        rationale:
          'Phases One through Three are required covert groundwork before later public-facing phases including E.B.S.'
      },
      {
        text: 'To restore full original power to royalty and banking heads once optics stand-ins finished training.',
        rationale:
          'Real-world power is stripped to zero while optics remain; the goal is gutting the network, not restoring parasite power.'
      }
    ]
  },
  {
    question: 'What is Phase Four: Narrative Maintenance, and how do Phases One through Three enable it?',
    hint: 'Business-as-usual illusion held by controlled stand-ins for sleepers.',
    options: [
      {
        text: 'Controlled stand-ins keep the illusion of business as usual to hold sleepers in a manageable state — possible only after the first three covert phases gut real power.',
        rationale:
          'Phases One through Three create the controlled environment for Phase Four Narrative Maintenance, where stand-ins keep business as usual for sleepers.'
      },
      {
        text: 'Immediate E.B.S. shatter of false reality with no stand-ins and no business-as-usual period for sleepers.',
        rationale:
          'E.B.S. is Phase Seven; Phase Four uses controlled stand-ins for business-as-usual optics after covert gutting.'
      },
      {
        text: 'Open DUMBS tourism that invites sleepers underground before any leadership neutralization occurs.',
        rationale:
          'Narrative Maintenance is optics management on the surface after Phases One through Three, not DUMBS tourism.'
      },
      {
        text: 'A return of full trafficking pipelines so the stock market can rebuild on the same illicit lifeblood.',
        rationale:
          'Phase Three removes that lifeblood; Phase Four maintains visual normalcy while actual parasitic power stays gutted.'
      }
    ]
  },
  {
    question: 'After Phase Four, what later Great Purge steps does this topic sequence into?',
    hint: 'Trigger events, military street presence, then E.B.S. revelation.',
    options: [
      {
        text: 'Phase Five orchestrated geopolitical trigger events, Phase Six military street presence and lockdowns, then Phase Seven E.B.S. revelation that shatters false reality in a single blow.',
        rationale:
          'After Narrative Maintenance comes Phase Five trigger events, Phase Six military street presence and lockdowns, and Phase Seven E.B.S. revelation.'
      },
      {
        text: 'Only a permanent freeze at Phase One with no later trigger events, street presence, or E.B.S. reveal.',
        rationale:
          'Phases One through Three set up the later public-facing sequence through Phase Seven E.B.S., not a permanent freeze at Phase One.'
      },
      {
        text: 'An immediate restored-realm celebration that skips geopolitical triggers and military lockdown phases entirely.',
        rationale:
          'The path includes Phase Five triggers, Phase Six military presence, and Phase Seven E.B.S. before safe transition language.'
      },
      {
        text: 'A reverse order that runs E.B.S. first, then rebuilds DUMBS, then reinstalls media moguls.',
        rationale:
          'The sequence is covert Phases One through Three first, then Four through Seven culminating in E.B.S. — not reverse order.'
      }
    ]
  },
  {
    question: 'After elite substitution with A.I. composites and clones, what is true of the control grid?',
    hint: 'Visual intactness versus actual power.',
    options: [
      {
        text: 'The control grid remains visually intact to the unawakened while its actual power is reduced to zero.',
        rationale:
          'By substituting elites with A.I. composites and clones, the control grid stays visually intact to the unawakened while actual power is reduced to zero.'
      },
      {
        text: 'The control grid both looks and functions at full original strength with every predator still in real command.',
        rationale:
          'Optics remain for stability, but actual power is reduced to zero after real-world power is stripped.'
      },
      {
        text: 'The control grid vanishes from every screen on day one so sleepers experience maximum shock immediately.',
        rationale:
          'Visual intactness for the unawakened is intentional; shock is isolated until frequency can be raised.'
      },
      {
        text: 'Only sports icons retain real command while royalty and banking heads keep pure holographic form without power loss.',
        rationale:
          'Across the early phases, targeted elites lose real-world power; the grid looks intact but is gutted in actual power.'
      }
    ]
  },
  {
    question: 'Why must Phases One through Three stay covert instead of full early public exposure?',
    hint: 'Avoid catastrophic trauma while the network is methodically gutted.',
    options: [
      {
        text: 'Exposing satanic operators, child predators, and the total illusion of global leadership without methodical dismantling would cause catastrophic trauma and chaos.',
        rationale:
          'Without methodical covert dismantling first, public exposure of those truths would result in catastrophic trauma and chaos.'
      },
      {
        text: 'Because the public already knows every detail, so secrecy adds no stability benefit during the takedown.',
        rationale:
          'Covert execution preserves societal stability precisely because full early exposure would traumatize the masses.'
      },
      {
        text: 'Because Whitehats want parasites to keep full real-world power while only logos change on television.',
        rationale:
          'Real-world power is stripped to zero; covert optics hide the gutting until frequency can rise safely.'
      },
      {
        text: 'Because Phase Seven E.B.S. is cancelled forever and no later shatter of false reality is planned.',
        rationale:
          'E.B.S. revelation remains the later shatter; early phases stay covert so that later reveal does not arrive as unmanaged chaos.'
      }
    ]
  },
  {
    question: 'What does this controlled demolition ultimately prepare humanity for?',
    hint: 'Frequency first, then safe transition when the overlay collapses.',
    options: [
      {
        text: 'When the 3D overlay finally collapses, humanity can transition safely into the restored realm after frequency has been sufficiently raised.',
        rationale:
          'Controlled demolition isolates shock until frequency rises, ensuring safe transition into the restored realm when the 3D overlay collapses.'
      },
      {
        text: 'Permanent life inside a fully powered parasitic grid that never collapses and never restores the realm.',
        rationale:
          'The end state described is collapse of the 3D overlay and safe transition into the restored realm — not permanent parasite grid life.'
      },
      {
        text: 'Immediate exile of all resonating souls so only sleepers inherit the restored realm without light anchors.',
        rationale:
          'Resonating souls anchor truth and light; the design raises frequency for a safe mass transition, not exile of anchors.'
      },
      {
        text: 'Rebuilding DUMBS and trafficking pipelines as the foundation of the restored realm economy.',
        rationale:
          'Phase Three removes that lifeblood; restoration is into the restored realm after overlay collapse, not rebuilt DUMBS economies.'
      }
    ]
  },
  {
    question: 'How do controlled stand-ins function for sleepers after the early purge phases?',
    hint: 'Business as usual as a holding pattern.',
    options: [
      {
        text: 'They keep up the illusion of business as usual so sleepers remain in a manageable state until later public phases.',
        rationale:
          'Phase Four Narrative Maintenance uses controlled stand-ins to keep business as usual and hold sleepers in a manageable state.'
      },
      {
        text: 'They immediately confess every crime on E.B.S. loops so sleepers never experience a business-as-usual period.',
        rationale:
          'Stand-ins maintain business-as-usual optics; full shatter is the later E.B.S. phase, not the stand-in holding pattern.'
      },
      {
        text: 'They restore full trafficking lifeblood so sleepers can invest again in the same underground stock backing.',
        rationale:
          'Underground lifeblood is seized and neutralized; stand-ins manage optics, not a return of illicit market backing.'
      },
      {
        text: 'They only appear underground in DUMBS and never on surface media that sleepers actually watch.',
        rationale:
          'Stand-ins replace leaders for public optics so the surface control grid looks intact to the unawakened.'
      }
    ]
  }
];

if (RAW.length !== 25) {
  throw new Error(`Expected 25 raw questions, got ${RAW.length}`);
}

const questions = RAW.map((raw, idx) => {
  const number = idx + 1;
  if (!raw.options || raw.options.length !== 4) {
    throw new Error(`Q${number}: need exactly 4 options`);
  }

  const options = raw.options.map((o, i) => ({
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: cleanText(o.rationale)
  }));

  const question = cleanText(raw.question);
  const hint = cleanText(raw.hint);

  const finalized = finalizeOptions(options, `${TOPIC_ID}-${number}`);

  const out = {
    number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');

  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${number}: LaTeX/$ markup found`);
  }
  if (hedgeRe.test(blob)) {
    throw new Error(`Q${number}: meta/report voice still present: ${blob.match(hedgeRe)?.[0]}`);
  }

  const phrases = supportPhrases[number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Q${number}: report does not support phrases: ${missing.join('; ')}`);
  }

  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${number}${o.label}: short rationale`);
    }
    if (!o.text || o.text.length < 50) {
      throw new Error(`Q${number}${o.label}: option text too short (${o.text.length})`);
    }
  }

  return out;
});

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

function rebalanceCorrectLetters(qs) {
  const order = ['A', 'B', 'C', 'D'];
  for (let pass = 0; pass < 40; pass++) {
    const counts = recountLetters(qs);
    const minL = order.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    const maxL = order.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
    if (counts[minL] >= 4 && counts[maxL] <= 9) break;
    const donor = qs.find((q) => q.correctAnswer === maxL);
    if (!donor) break;
    const from = donor.options.find((o) => o.isCorrect);
    const to = donor.options.find((o) => o.label === minL);
    if (!from || !to || from === to) break;
    const tmp = { text: from.text, rationale: from.rationale };
    from.text = to.text;
    from.rationale = to.rationale;
    from.isCorrect = false;
    to.text = tmp.text;
    to.rationale = tmp.rationale;
    to.isCorrect = true;
    donor.correctAnswer = minL;
  }
  return recountLetters(qs);
}

const letterCounts = rebalanceCorrectLetters(questions);
const maxLetter = Math.max(...Object.values(letterCounts));
const minLetter = Math.min(...Object.values(letterCounts));
if (maxLetter >= 15 || minLetter < 2) {
  throw new Error(`Correct answers too skewed: ${JSON.stringify(letterCounts)}`);
}

if (!fs.existsSync(path.join(ROOT, TOPIC_IMAGE))) {
  throw new Error(`Missing topic image: ${TOPIC_IMAGE}`);
}

const DESC_SHORT =
  'Test your understanding of Phase One-Three — The Great Purge initial strikes against leadership, cultural influence, and underground illicit economies under lockdown cover.';
const DESC_META =
  'Interactive Living Truth Quiz on Phase One-Three: The Great Purge initial strikes against global leadership, cultural influencers, and subterranean illicit economies.';
const SUBTITLE =
  'Test your grasp of Phase One-Three — covert Great Purge strikes that gut leadership, cultural influence, and underground economies while clones preserve optics.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: SUBTITLE,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Phases One through Three of The Great Purge gut the parasitic network from the pyramid apex through cultural influence and underground lifeblood — under lockdown cover, with clones and stand-ins holding optics while real power falls to zero. Sit with what you missed, then return to the Phase One-Three deep-dive, infographic, and video transmissions. Covert stability now prepares the path through narrative maintenance toward the later shatter of false reality and a safe transition into the restored realm.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = TOPIC_IMAGE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in breakdown-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    DESC_META
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=breakdown&amp;topic=hard-drive-framework',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Hard Drive Framework deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hard Drive Framework</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hard-drive-framework.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/breakdown-topics/phase-one-three.json');
