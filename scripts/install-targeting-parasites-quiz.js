/**
 * Installs Targeting Parasites quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/targeting-parasites.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run:
 *   node scripts/install-targeting-parasites-quiz.js
 *   node scripts/rebalance-quiz-length.js data/quizzes/breakdown/targeting-parasites.json
 *   node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'targeting-parasites';
const TOPIC_TITLE = 'Targeting Parasites';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/targeting-parasites.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

/** Support phrases grounded only in targeting-parasites.json report. */
const supportPhrases = {
  1: ['great purge', 'top-down', 'parasitic control'],
  2: ['apex', 'global power pyramid', 'lockdown'],
  3: ['parasites', 'resources', 'false 3d illusion'],
  4: ['clones', 'biological copies', 'public optics'],
  5: ['stand-in actors', 'masked', 'public panic'],
  6: ['a.i. driven composites', 'holographical', 'television'],
  7: ['big whitehat takeover', 'corporate', 'real-world power'],
  8: ['resonating sols', 'frequency', 'anchoring light'],
  9: ['dumbs', 'trafficking', 'dismantled'],
  10: ['adrenochrome', 'child harvesting', 'stock market'],
  11: ['covid', 'plandemic', 'child predators'],
  12: ['satanic cults', 'financial lifeblood'],
  13: ['business as usual', 'sleeping masses'],
  14: ['phase one', 'royals', 'media moguls'],
  15: ['presidents', 'vatican hierarchy', 'banking heads'],
  16: ['phase two', 'infrastructure sweep', 'ceos'],
  17: ['entertainment royalty', 'sports icons', 'cultural influencers'],
  18: ['politics, tastes, and thinking', 'independently'],
  19: ['frequency and vibration', 'global consciousness'],
  20: ['phase three', '3rd realm', 'shipping routes'],
  21: ['organ harvesting', 'drug pipelines', 'human lifeforce'],
  22: ['great awakening', 'time window', 'npcs'],
  23: ['3d matrix net', 'frequency shifts', 'chaotic demolition'],
  24: ['controlled theatre', 'mass reveal'],
  25: ['light grids', 'solar origins', 'control grids']
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
    question: 'What is The Great Purge in this targeting operation?',
    hint: 'A coordinated sequence against the parasitic control structure.',
    options: [
      {
        text: 'A highly coordinated, top-down sequence that systematically dismantled the parasitic control structure beginning at the apex of power.',
        rationale:
          'The Great Purge is the systematic top-down dismantling of the parasitic control structure in a highly coordinated sequence.'
      },
      {
        text: 'A random bottom-up riot that starts with street vendors and never reaches royals, banking heads, or media moguls.',
        rationale:
          'The operation begins at the apex of the global power pyramid and works downward, not as random bottom-up street chaos.'
      },
      {
        text: 'An overnight weather event that dissolves every city on day one with no phases and no mimic replacements.',
        rationale:
          'Initial three phases use replacement technologies and careful sequencing to avoid full-scale societal collapse.'
      },
      {
        text: 'A pure finance rebrand that leaves parasites in full control of resources, narratives, and enforcement.',
        rationale:
          'The purge neutralizes parasites controlling resources, narratives, and enforcement — it is not a cosmetic rebrand.'
      }
    ]
  },
  {
    question: 'Where did the targeting operation begin, and under what cover was it largely executed?',
    hint: 'Pyramid apex during the global lockdown period.',
    options: [
      {
        text: 'At the apex of the global power pyramid, executed largely under the cover of the Covid plandemic lockdowns.',
        rationale:
          'The purge began at the absolute top of the pyramid and worked down, largely under Covid plandemic lockdown cover.'
      },
      {
        text: 'At local neighborhood councils first, with open televised trials before any elite neutralization occurred.',
        rationale:
          'Targeting starts at the pyramid apex under lockdown cover, not at local councils with open day-one trials.'
      },
      {
        text: 'Only in underground DUMBS with no action against surface royals, presidents, or media moguls at all.',
        rationale:
          'Phase One removes surface apex leadership; DUMBS dismantling is part of Phase Three after the top-down sweep begins.'
      },
      {
        text: 'During a single mass-reveal broadcast that skipped lockdown cover and all covert replacement optics.',
        rationale:
          'Covert lockdown-era execution maintained business as usual; the mass reveal window comes later as controlled theatre ends.'
      }
    ]
  },
  {
    question: 'Who are the Parasites in this architecture?',
    hint: 'Controllers of resources, narratives, and enforcement.',
    options: [
      {
        text: 'Entities and individuals who controlled global resources, narratives, and enforcement to harvest energy and maintain the false 3D illusion.',
        rationale:
          'Parasites controlled global resources, narratives, and enforcement to harvest energy and maintain the false 3D illusion.'
      },
      {
        text: 'Benevolent Light Grid architects who never harvest energy and never run trafficking or enforcement systems.',
        rationale:
          'Parasites harvest energy and maintain the false 3D illusion; Light Grids activate after control grids are sterilized.'
      },
      {
        text: 'Only surface sports fans with no link to global resources, narratives, or societal enforcement structures.',
        rationale:
          'Parasites sit at control of resources, narratives, and enforcement — not ordinary sports fans without that architecture.'
      },
      {
        text: 'Resonating Sols who anchor light and cut through illusion without any harvest or control function.',
        rationale:
          'Resonating Sols cut through the parasitic illusion and anchor light; Parasites are the controllers who harvest and enforce.'
      }
    ]
  },
  {
    question: 'What are Clones in this operation?',
    hint: 'Biological replacements for optics after leaders are removed.',
    options: [
      {
        text: 'Biological copies used to instantly replace removed leaders so public optics remain intact after neutralization.',
        rationale:
          'Clones are biological copies used to instantly replace removed leaders to maintain public optics.'
      },
      {
        text: 'Permanent free-will rulers who keep full original power and never serve as temporary optics replacements.',
        rationale:
          'Clones maintain optics after real leaders are removed; real-world power is stripped, not permanently restored to free predators.'
      },
      {
        text: 'Only cartoon mascots with no biological copy technology and no role in elite replacement broadcasts.',
        rationale:
          'Clones are biological copies for leadership optics, distinct from but used alongside stand-ins and A.I. composites.'
      },
      {
        text: 'Underground tunnel workers who dismantle DUMBS by hand without appearing as surface leadership doubles.',
        rationale:
          'DUMBS dismantling is a military Phase Three action; clones replace removed leaders for public optics.'
      }
    ]
  },
  {
    question: 'What are Stand-In Actors?',
    hint: 'Masked replacements used to prevent panic.',
    options: [
      {
        text: 'Masked individuals acting as replacements for neutralized elites specifically to prevent public panic.',
        rationale:
          'Stand-In Actors are masked individuals acting as replacements for neutralized elites to prevent public panic.'
      },
      {
        text: 'Unmasked true royals restored to full pyramid power with no mimic technology involved at all.',
        rationale:
          'Stand-ins are masked replacements after neutralization, not restored true royals with original power.'
      },
      {
        text: 'Only digital holograms with no living masked person ever appearing as a neutralized elite.',
        rationale:
          'Stand-In Actors are masked individuals; holographical tools and A.I. composites are separate replacement technologies.'
      },
      {
        text: 'Sleeping masses recruited to confess every crime on day one so panic spreads as fast as possible.',
        rationale:
          'Stand-ins prevent public panic; they do not recruit sleepers into day-one mass confessions.'
      }
    ]
  },
  {
    question: 'What are A.I. Driven Composites used for?',
    hint: 'Digital and holographical mimic tech on broadcasts.',
    options: [
      {
        text: 'Digital and holographical mimic technology deployed for television appearances of removed individuals.',
        rationale:
          'A.I. Driven Composites are digital and holographical mimic technology for television appearances of removed individuals.'
      },
      {
        text: 'Organic Light Grid activators that guide the population back to solar origins without any mimic role.',
        rationale:
          'Light Grids activate after control grids are sterilized; A.I. composites mimic removed individuals on television.'
      },
      {
        text: 'Only paper press releases with no digital, holographical, or television appearance function whatsoever.',
        rationale:
          'Composites are deployed for television appearances via digital and holographical mimic technology.'
      },
      {
        text: 'Permanent soul bodies for child predators so they keep real-world command after the Great Purge.',
        rationale:
          'Replacement tech maintains optics after neutralization; it does not preserve predator real-world command.'
      }
    ]
  },
  {
    question: 'What is The Big Whitehat Takeover?',
    hint: 'Military and alliance action against corporate and cultural power.',
    options: [
      {
        text: 'The coordinated military and alliance operation that strips corporate and cultural leaders of real-world power.',
        rationale:
          'The Big Whitehat Takeover is the coordinated military and alliance operation to strip corporate and cultural leaders of real-world power.'
      },
      {
        text: 'A parasitic banking rebrand that expands trafficking pipelines while posing as a liberation campaign.',
        rationale:
          'The Big Whitehat Takeover strips real-world power from corporate and cultural leaders; it does not expand parasitic pipelines.'
      },
      {
        text: 'A sleeper fashion festival with no military, alliance, or real-world power-stripping function at all.',
        rationale:
          'It is a coordinated military and alliance operation, not a civilian fashion event without power consequences.'
      },
      {
        text: 'An NPC software update that only changes desktop icons and never touches corporate or cultural leadership.',
        rationale:
          'The takeover targets corporate and cultural leaders real-world power as part of the infrastructure sweep sequence.'
      }
    ]
  },
  {
    question: 'Who are Resonating Sols?',
    hint: 'True souls whose frequency cuts through the illusion.',
    options: [
      {
        text: 'True souls possessing the frequency and vibration capable of cutting through the parasitic illusion and anchoring light.',
        rationale:
          'Resonating Sols are true souls whose frequency and vibration cut through the parasitic illusion and anchor light.'
      },
      {
        text: '3D sleepers and NPCs held only by business-as-usual optics with no capacity to cut through illusion.',
        rationale:
          'Sleepers and NPCs are held stable by the managed illusion; Resonating Sols cut through that parasitic illusion.'
      },
      {
        text: 'Neutralized media moguls permanently restored so they can keep controlling global narratives forever.',
        rationale:
          'Media moguls are Phase One targets removed and replaced for optics; Resonating Sols are true light-anchoring souls.'
      },
      {
        text: 'Only sports icons whose hypnotic influence over tastes is strengthened after the infrastructure sweep.',
        rationale:
          'Sports icons are stripped of real-world power in Phase Two; Resonating Sols gain freedom to think independently.'
      }
    ]
  },
  {
    question: 'What are DUMBS in this operation?',
    hint: 'Underground bases used for trafficking and smuggling.',
    options: [
      {
        text: 'Deep underground military bases and cities used for trafficking and smuggling, dismantled by military forces.',
        rationale:
          'DUMBS are deep underground military bases and cities utilized for trafficking and smuggling and dismantled by military forces.'
      },
      {
        text: 'Surface shopping malls rebranded as free-energy markets with no subterranean trafficking function.',
        rationale:
          'DUMBS are underground bases and cities for trafficking and smuggling — not surface shopping rebrands.'
      },
      {
        text: 'Public stock exchanges that list adrenochrome openly for ordinary investors during lockdown broadcasts.',
        rationale:
          'Adrenochrome backed the stock market through the underground economy; DUMBS are the underground bases themselves.'
      },
      {
        text: 'Television studios that only air A.I. composites and never house tunnel networks or smuggling cities.',
        rationale:
          'DUMBS are underground military bases and cities dismantled in Phase Three, not surface TV studios alone.'
      }
    ]
  },
  {
    question: 'What is Adrenochrome in this parasitic economy?',
    hint: 'Lifeblood linked to harvesting and market backing.',
    options: [
      {
        text: 'A vital component of the underground economy and parasitic lifeblood, connected to child harvesting and human trafficking that backed the world stock market.',
        rationale:
          'Adrenochrome is vital underground-economy lifeblood connected to child harvesting and trafficking that backed the world stock market.'
      },
      {
        text: 'A harmless surface vitamin sold in grocery stores with no link to trafficking or stock-market backing.',
        rationale:
          'Adrenochrome is named as parasitic lifeblood tied to child harvesting, trafficking, and market backing — not a harmless grocery vitamin.'
      },
      {
        text: 'Only a Phase Two entertainment prop used by sports icons with no underground production network.',
        rationale:
          'Phase Three dismantles Adrenochrome production with trafficking and harvesting networks as financial lifeblood.'
      },
      {
        text: 'A Light Grid frequency code that activates solar origins without any underground economy role.',
        rationale:
          'Light Grids activate after sterilization of control grids; Adrenochrome is underground parasitic lifeblood, not Light Grid code.'
      }
    ]
  },
  {
    question: 'What was the paramount directive of the purge under Covid plandemic lockdowns?',
    hint: 'Predators, cults, and financial lifeblood.',
    options: [
      {
        text: 'Remove child predators, satanic cults, and the financial lifeblood of the dark controllers while the lockdown cover held.',
        rationale:
          'The paramount directive was to remove child predators, satanic cults, and the financial lifeblood of the dark controllers.'
      },
      {
        text: 'Expand satanic cult power and restore full trafficking lifeblood under a new public health logo only.',
        rationale:
          'The directive removes predators, cults, and financial lifeblood — it does not expand or restore them.'
      },
      {
        text: 'Ignore predators entirely and only rebrand media logos without touching financial or cult structures.',
        rationale:
          'Child predators, satanic cults, and financial lifeblood are the paramount removal targets of the operation.'
      },
      {
        text: 'Trigger full-scale societal collapse on day one so reconstruction never requires a time window or mimic tech.',
        rationale:
          'The operation strips controllers without full-scale societal collapse, using replacement tech and careful phasing.'
      }
    ]
  },
  {
    question: 'Besides child predators, which dark structures were paramount removal targets?',
    hint: 'Cult systems and the money that fed them.',
    options: [
      {
        text: 'Satanic cults and the financial lifeblood of the dark controllers that funded their power structure.',
        rationale:
          'Paramount directive includes satanic cults and the financial lifeblood of the dark controllers alongside child predators.'
      },
      {
        text: 'Only civilian sports leagues with no cult networks and no underground financial lifeblood at all.',
        rationale:
          'Sports icons are Phase Two optics targets; paramount directive names satanic cults and financial lifeblood of dark controllers.'
      },
      {
        text: 'Organic Light Grids that were already guiding the population back to solar origins without interference.',
        rationale:
          'Light Grids activate after control grids are sterilized; they are not the dark structures being purged.'
      },
      {
        text: 'Resonating Sols who anchor light, so that only sleepers remain to manage the Great Awakening alone.',
        rationale:
          'Resonating Sols cut through illusion and anchor light; the purge targets predators, cults, and parasitic finance.'
      }
    ]
  },
  {
    question: 'How did advanced replacement technologies serve the covert takeover?',
    hint: 'Keep sleeping masses in a familiar surface story.',
    options: [
      {
        text: 'They enabled a massive covert takeover of global infrastructure while maintaining the illusion of business as usual for the sleeping masses.',
        rationale:
          'Advanced replacement technologies let the alliance take over infrastructure covertly while business as usual held for sleeping masses.'
      },
      {
        text: 'They forced every sleeper into immediate mass panic by showing empty chairs where leaders once stood.',
        rationale:
          'Replacement tech maintains optics to prevent premature panic, not to empty the public stage overnight.'
      },
      {
        text: 'They permanently restored every removed royal and banking head to full original command authority.',
        rationale:
          'Removed leaders are replaced for optics while real power is stripped; the takeover is covert neutralization, not restoration.'
      },
      {
        text: 'They only updated desktop wallpapers and never supported television appearances or masked stand-ins.',
        rationale:
          'Replacement suite includes clones, masked stand-ins, holographical projections, and A.I. composites for public broadcasts.'
      }
    ]
  },
  {
    question: 'What was Phase One: The Great Purge primary objective?',
    hint: 'Those who controlled resources, narrative, and enforcement.',
    options: [
      {
        text: 'Neutralize those who controlled the world resources, the overarching narrative, and societal enforcement at the pyramid top.',
        rationale:
          'Phase One primary objective was neutralizing controllers of world resources, the overarching narrative, and societal enforcement.'
      },
      {
        text: 'Replace only sports icons while leaving royals, banking heads, and media moguls in full original power.',
        rationale:
          'Sports icons are Phase Two; Phase One permanently removes royals, banking heads, media moguls, and related apex roles.'
      },
      {
        text: 'Seize shipping routes and dismantle DUMBS before any leadership neutralization at the surface apex.',
        rationale:
          'Shipping routes and DUMBS are Phase Three; Phase One targets the most dangerous leadership and enforcement apex first.'
      },
      {
        text: 'Activate organic Light Grids only, with no arrests of presidents, police brass, or Vatican hierarchy.',
        rationale:
          'Phase One removes apex leadership including presidents, police brass, and Vatican hierarchy; Light Grids are the later strategic outcome.'
      }
    ]
  },
  {
    question: 'Which leadership layers did Phase One permanently remove?',
    hint: 'Royals through media moguls at the global apex.',
    options: [
      {
        text: 'Royals, prime ministers, presidents, high military and police brass, banking heads, Vatican hierarchy, and media moguls.',
        rationale:
          'Phase One permanently removed royals, prime ministers, presidents, high military and police brass, banking heads, Vatican hierarchy, and media moguls.'
      },
      {
        text: 'Only mid-level city clerks with no reach into royals, presidents, Vatican hierarchy, or media power.',
        rationale:
          'The sweep hits the absolute top of the pyramid — royals through media moguls — not merely mid-level clerks.'
      },
      {
        text: 'Every Resonating Sol worldwide so that only NPCs remain to run public broadcasts after lockdown.',
        rationale:
          'Resonating Sols anchor light; Phase One removes parasitic apex leadership and replaces them for optics.'
      },
      {
        text: 'Nobody of consequence — all banking heads and media moguls kept full real-world power without clones.',
        rationale:
          'Those apex figures were permanently removed and instantly replaced by clones, stand-ins, holograms, and A.I. composites.'
      }
    ]
  },
  {
    question: 'What is Phase Two called in this sequence?',
    hint: 'The second phase name points at influence infrastructure.',
    options: [
      {
        text: 'Infrastructure Sweep — the move against corporate CEOs, entertainment royalty, sports icons, and cultural influencers.',
        rationale:
          'Phase Two is the Infrastructure Sweep targeting corporate CEOs, entertainment royalty, sports icons, and cultural influencers.'
      },
      {
        text: '3rd Realm Collapse — the shipping-route and DUMBS dismantling that hits underground lifeblood first.',
        rationale:
          '3rd Realm Collapse is Phase Three; Phase Two is Infrastructure Sweep of corporate and cultural influence.'
      },
      {
        text: 'The Great Purge apex only — leadership arrests with no action on CEOs or cultural influencers.',
        rationale:
          'Phase One is the Great Purge apex leadership sweep; Phase Two is specifically Infrastructure Sweep.'
      },
      {
        text: 'Mass Reveal Window — the final public confession hour with no optics replacements remaining.',
        rationale:
          'Mass reveal is the later strategic window; Phase Two still uses optics replacements while stripping real power.'
      }
    ]
  },
  {
    question: 'Which groups did Phase Two specifically target after the apex leadership sweep?',
    hint: 'Corporate, entertainment, sports, and cultural layers.',
    options: [
      {
        text: 'Corporate CEOs, entertainment royalty, sports icons, and cultural influencers stripped of real-world power for optics-only roles.',
        rationale:
          'Phase Two moved to corporate CEOs, entertainment royalty, sports icons, and cultural influencers — replaced purely for optics.'
      },
      {
        text: 'Only Vatican hierarchy and prime ministers, leaving all CEOs and sports icons in full original command.',
        rationale:
          'Vatican hierarchy and prime ministers are Phase One apex removals; Phase Two hits CEOs, entertainment, sports, and influencers.'
      },
      {
        text: 'Deep tunnel crews alone, with no action against entertainment royalty or corporate executive power.',
        rationale:
          'Tunnel and DUMBS work is Phase Three; Phase Two is the corporate and cultural infrastructure sweep.'
      },
      {
        text: 'Every sleeper household forced into panic before any Whitehat stripping of influencer real-world power.',
        rationale:
          'Phase Two severs influence so people can think independently; it does not panic every sleeper household as the target list.'
      }
    ]
  },
  {
    question: 'What explicit purpose did Phase Two serve regarding population influence?',
    hint: 'Cut the parasite link to politics, tastes, and thinking.',
    options: [
      {
        text: 'Sever the connection between parasites and their influence over politics, tastes, and thinking so Resonating Sols can think independently.',
        rationale:
          'Phase Two severs parasitic influence over politics, tastes, and thinking, enabling Resonating Sols to think independently.'
      },
      {
        text: 'Increase hypnotic control over politics, tastes, and thinking so independent thought becomes impossible.',
        rationale:
          'The explicit purpose is to sever that influence connection, not to strengthen hypnotic control.'
      },
      {
        text: 'Publish every DUMBS map on day one so underground cargo routes become public tourist attractions.',
        rationale:
          'DUMBS dismantling is Phase Three; Phase Two focuses on severing cultural and corporate influence over minds.'
      },
      {
        text: 'Restore full original power to media moguls after a brief optics-only suspension of their brands.',
        rationale:
          'Targets are stripped of real-world power and kept only for optics; influence is severed, not restored.'
      }
    ]
  },
  {
    question: 'What was the overarching priority of Phase Two for global consciousness?',
    hint: 'Raise frequency and vibration worldwide.',
    options: [
      {
        text: 'Elevate the frequency and vibration of global consciousness after severing parasitic influence channels.',
        rationale:
          'The overarching priority of Phase Two was to elevate the frequency and vibration of global consciousness.'
      },
      {
        text: 'Lower global frequency so sleeping masses never approach the mass reveal window with clearer perception.',
        rationale:
          'Phase Two priority is elevating frequency and vibration of global consciousness, not lowering it.'
      },
      {
        text: 'Freeze all consciousness work until Adrenochrome production is publicly relaunched on stock exchanges.',
        rationale:
          'Phase Three destroys Adrenochrome production and underground market backing; Phase Two raises frequency of consciousness.'
      },
      {
        text: 'Replace Resonating Sols with NPCs so independent thinking never returns after the infrastructure sweep.',
        rationale:
          'Phase Two enables Resonating Sols to think independently; it does not replace them with NPCs.'
      }
    ]
  },
  {
    question: 'What is Phase Three: 3rd Realm Collapse aimed at?',
    hint: 'Financial and physical lifeblood of parasitic power.',
    options: [
      {
        text: 'The financial and physical lifeblood of the parasitic power structure — shipping routes, DUMBS, and underground economies.',
        rationale:
          'Phase Three directly targeted the financial and physical lifeblood of the parasitic power structure.'
      },
      {
        text: 'Only surface fashion influencers with no action on shipping routes, DUMBS, or underground economies.',
        rationale:
          'Surface cultural influencers are Phase Two; Phase Three hits financial and physical underground lifeblood.'
      },
      {
        text: 'Replacing royals with clones while leaving trafficking rings and Adrenochrome production fully running.',
        rationale:
          'Leadership replacement is Phase One; Phase Three dismantles trafficking, harvesting, drugs, and Adrenochrome production.'
      },
      {
        text: 'A pure narrative speech series with no military seizure of shipping or tunnel dismantling whatsoever.',
        rationale:
          'Military and Allied Special Forces seized shipping routes and dismantled underground cities and tunnels.'
      }
    ]
  },
  {
    question: 'Which underground systems did Phase Three dismantle to cut money and human lifeforce?',
    hint: 'Trafficking, organs, drugs, and Adrenochrome production.',
    options: [
      {
        text: 'Human and child trafficking rings, organ harvesting networks, drug pipelines, and Adrenochrome production that fed parasite supply.',
        rationale:
          'Phase Three dismantled trafficking rings, organ harvesting, drug pipelines, and Adrenochrome production, cutting money and human lifeforce.'
      },
      {
        text: 'Only legal pharmacies with transparent inventories and no trafficking or harvesting networks involved.',
        rationale:
          'The targets are illicit trafficking, organ harvesting, drug pipelines, and Adrenochrome production as parasitic lifeblood.'
      },
      {
        text: 'Entertainment award shows alone, without seizing shipping routes or dismantling underground cities.',
        rationale:
          'Entertainment royalty is Phase Two; Phase Three seizes shipping and dismantles DUMBS and underground production.'
      },
      {
        text: 'Light Grid activation temples that guide solar origin return without any underground economy role.',
        rationale:
          'Light Grids activate after control-grid sterilization; Phase Three destroys underground parasitic economies.'
      }
    ]
  },
  {
    question: 'Why was mimic technology deployment required before full infrastructure dismantling?',
    hint: 'Time window without premature panic among sleepers and NPCs.',
    options: [
      {
        text: 'It provided the time window to dismantle global infrastructure without inciting premature mass panic among 3D sleepers and NPCs.',
        rationale:
          'Advanced mimic technology provided the necessary time window to dismantle infrastructure without premature mass panic among 3D sleepers and NPCs.'
      },
      {
        text: 'It forced immediate mass panic so the Great Awakening would begin as chaotic demolition of every city.',
        rationale:
          'Mimic tech prevents premature panic; the 3D Matrix Net collapses safely through frequency shifts, not chaotic demolition.'
      },
      {
        text: 'It restored full trafficking stock-market backing so sleepers could invest in Adrenochrome production again.',
        rationale:
          'Phase Three destroys the underground economy that backed the stock market; mimic tech buys dismantling time, not market restoration.'
      },
      {
        text: 'It was optional decoration with no link to the Great Awakening preparation or infrastructure timeline.',
        rationale:
          'Removal of parasites and mimic deployment prepare the ground for the Great Awakening with a controlled time window.'
      }
    ]
  },
  {
    question: 'How is the 3D Matrix Net designed to collapse safely?',
    hint: 'Frequency shifts rather than chaotic demolition.',
    options: [
      {
        text: 'Through frequency shifts rather than chaotic demolition, after meticulous phasing of the targeting operation.',
        rationale:
          'Meticulous phasing ensures the 3D Matrix Net collapses safely through frequency shifts rather than chaotic demolition.'
      },
      {
        text: 'Through instant chaotic demolition of every city on day one with no frequency work and no phased cover.',
        rationale:
          'Safe collapse is via frequency shifts after phased covert work — not day-one chaotic demolition.'
      },
      {
        text: 'By permanently freezing the false 3D illusion so the Matrix Net never collapses at all.',
        rationale:
          'The design is safe collapse of the 3D Matrix Net through frequency shifts, not permanent freeze of the illusion.'
      },
      {
        text: 'By restoring satanic cult leadership so the Net rebuilds stronger than before the Great Purge.',
        rationale:
          'Parasitic leadership is decapitated and control grids sterilized; collapse prepares Light Grid activation, not cult restoration.'
      }
    ]
  },
  {
    question: 'After Phases One through Three, what remains in the public eye?',
    hint: 'A managed illusion until the reveal window.',
    options: [
      {
        text: 'A controlled theatre — a managed illusion designed to hold sleeping masses stable until the precise mass reveal window.',
        rationale:
          'What remains publicly is controlled theatre: a managed illusion holding sleeping masses stable until the mass reveal window.'
      },
      {
        text: 'Fully empowered parasitic leadership with intact financial systems and no theatre or managed optics remaining.',
        rationale:
          'Phases One through Three decapitated parasitic leadership and obliterated their financial systems; public view is theatre only.'
      },
      {
        text: 'An already completed mass reveal with every sleeper fully awake and no further managed holding pattern.',
        rationale:
          'The managed illusion holds until the precise mass reveal window; theatre is what remains before that moment.'
      },
      {
        text: 'Only open DUMBS tourism with full public maps and no need for any controlled surface narrative.',
        rationale:
          'Public surface reality is controlled theatre for sleepers; DUMBS were dismantled as underground infrastructure, not opened as tourism.'
      }
    ]
  },
  {
    question: 'What is the ultimate strategic outcome of sterilizing the realm control grids?',
    hint: 'Light Grids activate and guide return to solar origins.',
    options: [
      {
        text: 'Organic Light Grids activate and guide the awakening population back to their true solar origins.',
        rationale:
          'Complete sterilization of control grids allows organic Light Grids to activate and guide the awakening population back to true solar origins.'
      },
      {
        text: 'Parasitic control grids permanently strengthen so the population never returns to solar origins.',
        rationale:
          'Control grids are sterilized so Light Grids can activate and guide return to true solar origins — not parasite grid permanence.'
      },
      {
        text: 'Only Adrenochrome markets reopen as the official economy of the restored solar origin timeline.',
        rationale:
          'Adrenochrome production and underground market backing are destroyed; the outcome is Light Grid guidance to solar origins.'
      },
      {
        text: 'NPCs replace all Resonating Sols so no true frequency remains to cut through residual illusion.',
        rationale:
          'Resonating Sols cut through illusion and anchor light; the strategic outcome empowers Light Grid return, not NPC replacement of true sols.'
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
  'Test your understanding of Targeting Parasites — The Great Purge top-down neutralization of dark controllers, replacement optics, and destruction of underground lifeblood.';
const DESC_META =
  'Interactive Living Truth Quiz on Targeting Parasites: The Great Purge apex-to-underground dismantling of parasitic control under lockdown cover.';
const SUBTITLE =
  'Test your grasp of Targeting Parasites — top-down Great Purge phases that strip apex power, cultural influence, and underground lifeblood while mimic optics hold the sleeping masses.';

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
      'Targeting Parasites is the top-down Great Purge that decapitates apex control, severs cultural hypnotic influence, and obliterates underground financial lifeblood — under lockdown cover, with clones, stand-ins, and A.I. composites holding business as usual. Sit with what you missed, then return to the Targeting Parasites deep-dive, infographic, and video transmissions. Controlled theatre holds the sleepers until the mass reveal window, while sterilized control grids make way for organic Light Grids and the return to true solar origins.'
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
    "  { path: '/quiz/breakdown/phase-one-three.html', priority: '0.75', changefreq: 'monthly' },";
  if (sm.includes(anchor)) {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  } else {
    const fallback =
      "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(fallback)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(fallback, `${fallback}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/breakdown-topics/targeting-parasites.json');
