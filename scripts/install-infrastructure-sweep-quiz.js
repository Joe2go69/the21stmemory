/**
 * Installs Infrastructure Sweep quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/infrastructure-sweep.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run:
 *   node scripts/install-infrastructure-sweep-quiz.js
 *   node scripts/rebalance-quiz-length.js data/quizzes/breakdown/infrastructure-sweep.json
 *   node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'infrastructure-sweep';
const TOPIC_TITLE = 'Infrastructure Sweep';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/infrastructure-sweep.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

/** Support phrases grounded only in infrastructure-sweep.json report. */
const supportPhrases = {
  1: ['infrastructure sweep', 'second phase', 'great purge'],
  2: ['phase one', 'phase three', 'cultural and corporate'],
  3: ['corporate', 'entertainment', 'cultural leaders'],
  4: ['corporate ceos', 'removed from power'],
  5: ['entertainment royalty', 'sports icons', 'public taste'],
  6: ['big whitehat takeover', 'real-world power', 'outward optics'],
  7: ['frequency vibration consciousness', 'cultural interference'],
  8: ['cultural programming', 'political', 'financial'],
  9: ['active agents', 'dark controllers', 'independent thinking'],
  10: ['nothing is as it seems', 'fabricated for optics'],
  11: ['prime ministers', 'royals', 'banking heads'],
  12: ['clones', 'stand-in actors', 'a.i. driven composites'],
  13: ['mass reveal window', 'public alarm'],
  14: ['politics, tastes, and thinking', 'parasites'],
  15: ['resonating sols', 'think for themselves'],
  16: ['connective tissue', 'phase one', 'phase three'],
  17: ['apex predators', 'global resources', 'enforcement'],
  18: ['3rd realm collapse', 'underground economy'],
  19: ['dumbs', 'human trafficking', 'adrenochrome'],
  20: ['covid plandemic lockdowns', 'three phases'],
  21: ['whitehats', 'consciousness', 'elevate'],
  22: ['great awakening', 'spell over the masses'],
  23: ['stand-ins', 'sleeping masses', 'mass reveal'],
  24: ['frequency shifts', 'premature societal chaos'],
  25: ['psychological and cultural tethers', 'global frequency']
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
    question: 'What is the Infrastructure Sweep within the Great Purge?',
    hint: 'Its place in the phased top-down sequence.',
    options: [
      {
        text: 'The critical second phase of the Great Purge — a systematic top-down operation that dismantles parasitic control over the realm.',
        rationale:
          'The Infrastructure Sweep is the critical second phase of the Great Purge: a systematic, top-down operation to dismantle parasitic control.'
      },
      {
        text: 'The first apex strike that only removes prime ministers, royals, and banking heads with no cultural targets at all.',
        rationale:
          'That apex leadership strike is Phase One; the Infrastructure Sweep is Phase Two against cultural and corporate pillars.'
      },
      {
        text: 'The third-phase physical strike that only obliterates DUMBS and trafficking pipelines without touching CEOs or influencers.',
        rationale:
          'Underground physical obliteration is Phase Three; the Infrastructure Sweep is Phase Two cultural and corporate neutralization.'
      },
      {
        text: 'A bottom-up street protest that never reaches corporate leaders, entertainment royalty, or sports icons.',
        rationale:
          'The sweep is a coordinated top-down Whitehat operation against corporate, entertainment, and cultural leaders — not a bottom-up protest.'
      }
    ]
  },
  {
    question: 'Where does Phase Two sit in the Great Purge sequence?',
    hint: 'Between two other named phases with different targets.',
    options: [
      {
        text: 'Between Phase One’s decapitation of top-tier global leadership and Phase Three’s physical obliteration of the underground economy.',
        rationale:
          'Phase Two sits between Phase One leadership decapitation and Phase Three’s physical obliteration of the underground economy.'
      },
      {
        text: 'After Phase Three finishes destroying DUMBS, so cultural influencers are the last targets left standing.',
        rationale:
          'Cultural and corporate clearing is Phase Two and is a mandatory prerequisite before Phase Three’s 3rd Realm Collapse.'
      },
      {
        text: 'Before any leadership is removed, so CEOs fall first and royals remain untouched until the mass reveal.',
        rationale:
          'Phase One removes apex leadership first; Phase Two then descends the hierarchy into cultural and corporate targets.'
      },
      {
        text: 'Outside the Great Purge entirely, as a separate civilian media campaign with no military alliance role.',
        rationale:
          'The Infrastructure Sweep is Phase Two of the Great Purge and is executed as The Big Whitehat Takeover by military and alliance forces.'
      }
    ]
  },
  {
    question: 'Which pillars of society did Phase Two specifically target?',
    hint: 'Not only politics at the apex — look mid-pyramid.',
    options: [
      {
        text: 'The cultural and corporate pillars — the figures dictating societal tastes, politics, and corporate operations.',
        rationale:
          'Phase Two specifically targeted the cultural and corporate pillars by neutralizing those dictating tastes, politics, and corporate operations.'
      },
      {
        text: 'Only underground tunnel crews and Adrenochrome chemists, leaving surface culture completely untouched.',
        rationale:
          'Underground economy destruction is Phase Three; Phase Two hits cultural and corporate surface influence first.'
      },
      {
        text: 'Only apex royals and banking heads, with no action against entertainment royalty or corporate CEOs.',
        rationale:
          'Royals and banking heads are Phase One apex targets; Phase Two moves to CEOs, entertainment royalty, and cultural influencers.'
      },
      {
        text: 'Only local school boards and neighborhood clubs with no global corporate or entertainment reach.',
        rationale:
          'Targets are major corporate CEOs, entertainment royalty, sports icons, and massive cultural influencers — not only local boards.'
      }
    ]
  },
  {
    question: 'What happened to Corporate CEOs during the Infrastructure Sweep?',
    hint: 'Power status after Phase Two neutralization.',
    options: [
      {
        text: 'They were neutralized and removed from real power as heads of major global corporations in Phase Two.',
        rationale:
          'Corporate CEOs — heads of major global corporations — were neutralized and removed from power during Phase Two.'
      },
      {
        text: 'They kept full real-world command and only changed logos while parasites retained corporate control.',
        rationale:
          'CEOs were stripped of real-world power in The Big Whitehat Takeover; surface optics do not equal retained command.'
      },
      {
        text: 'They were left alone until Phase Three so that only DUMBS operators would ever be neutralized.',
        rationale:
          'Corporate CEOs are explicit Phase Two targets of the Infrastructure Sweep, not deferred exclusively to Phase Three.'
      },
      {
        text: 'They voluntarily resigned on live television with full public confession before any Whitehat operation began.',
        rationale:
          'Neutralization used covert power stripping and optic replacements to avoid public alarm before the mass reveal window.'
      }
    ]
  },
  {
    question: 'Why were Entertainment Royalty and Sports Icons removed in this phase?',
    hint: 'What their public influence was doing to the population.',
    options: [
      {
        text: 'To stop the manipulation of public taste and independent thought by high-profile cultural influencers.',
        rationale:
          'Entertainment Royalty and Sports Icons were removed to stop manipulation of public taste and independent thought.'
      },
      {
        text: 'To improve award-show production quality while leaving public taste fully under parasitic programming.',
        rationale:
          'Removal severs cultural programming over taste and thinking; it is not a cosmetic entertainment upgrade.'
      },
      {
        text: 'To promote them into banking leadership after Phase One emptied royal and presidential seats.',
        rationale:
          'These figures were stripped of real-world power and held only for optics — not promoted into banking command.'
      },
      {
        text: 'To protect them as neutral artists who never served as agents of the dark controllers.',
        rationale:
          'Public figures revered as entertainment royalty and sports icons were active agents of the dark controllers.'
      }
    ]
  },
  {
    question: 'What is The Big Whitehat Takeover in this operation?',
    hint: 'Power stripped while surface appearance continues.',
    options: [
      {
        text: 'The coordinated military and alliance operation that strips cultural and corporate figures of real-world power while maintaining outward optics.',
        rationale:
          'The Big Whitehat Takeover is the coordinated military and alliance operation that strips those figures of real-world power while maintaining outward optics.'
      },
      {
        text: 'A public stock-market auction that sells every corporation to sleepers with full transparent ownership transfer.',
        rationale:
          'The takeover is a covert Whitehat power strip with optic replacements, not a public ownership auction.'
      },
      {
        text: 'A Phase Three tunnel demolition plan that never touches CEOs, entertainment royalty, or sports icons.',
        rationale:
          'The Big Whitehat Takeover describes Phase Two neutralization of cultural and corporate figures, not only underground demolition.'
      },
      {
        text: 'A media rebrand that leaves parasites in full real-world control while only changing stage names and logos.',
        rationale:
          'Real-world power is stripped; remaining public presence is optics only, not continued parasitic command.'
      }
    ]
  },
  {
    question: 'What is Frequency Vibration Consciousness in the language of this sweep?',
    hint: 'The energetic priority Phase Two sought to raise.',
    options: [
      {
        text: 'The energetic state of humanity that Phase Two prioritized raising by eliminating parasitic cultural interference.',
        rationale:
          'Frequency Vibration Consciousness is the energetic state of humanity that Phase Two prioritized raising by eliminating parasitic cultural interference.'
      },
      {
        text: 'A stock ticker code used only by banking heads during Phase One apex leadership removals.',
        rationale:
          'The term names humanity’s energetic state targeted for elevation in Phase Two, not a Phase One banking code.'
      },
      {
        text: 'A weaponized broadcast frequency used to lower public awareness before the mass reveal window.',
        rationale:
          'Phase Two’s priority is raising frequency vibration consciousness, not lowering awareness with a weaponized broadcast.'
      },
      {
        text: 'An underground tunnel signal system that only DUMBS operators can receive after Phase Three.',
        rationale:
          'This is the population’s energetic consciousness state elevated by clearing cultural interference, not a DUMBS signal protocol.'
      }
    ]
  },
  {
    question: 'How heavily did the parasitic control grid rely on culture compared with politics and finance?',
    hint: 'Core revelation about what held the population.',
    options: [
      {
        text: 'It relied just as heavily on cultural programming as it did on political and financial dominance.',
        rationale:
          'The parasitic control grid relied just as heavily on cultural programming as on political and financial dominance.'
      },
      {
        text: 'It relied only on banking ledgers, with culture treated as harmless entertainment and no programming role.',
        rationale:
          'Cultural programming was a core control pillar equal in weight to political and financial dominance.'
      },
      {
        text: 'It abandoned culture entirely after Phase One, leaving entertainment free of any parasitic influence.',
        rationale:
          'Phase Two was required precisely because cultural influencers were still active agents binding the population.'
      },
      {
        text: 'It used culture only after the mass reveal, never during the covert lockdown-era purge phases.',
        rationale:
          'Cultural programming was already central to the control grid; Phase Two severs it under lockdown-era cover before the reveal.'
      }
    ]
  },
  {
    question: 'What role did revered public influencers play for the dark controllers?',
    hint: 'Beyond fame — function in the control grid.',
    options: [
      {
        text: 'They were active agents manipulating the population’s tastes, politics, and independent thinking for the dark controllers.',
        rationale:
          'Entertainment royalty, sports icons, and corporate leaders were active agents of the dark controllers manipulating tastes, politics, and independent thinking.'
      },
      {
        text: 'They were accidental celebrities with no connection to politics, taste shaping, or independent-thought suppression.',
        rationale:
          'These figures were active agents engineering influence over tastes, politics, and independent thinking.'
      },
      {
        text: 'They were secret Whitehat allies who openly confessed every crime before Phase One even began.',
        rationale:
          'They were parasitic cultural agents neutralized in Phase Two; public optics afterward are fabricated replacements, not open early confessions.'
      },
      {
        text: 'They only managed sports scores and never touched corporate operations or political narrative influence.',
        rationale:
          'Targets included corporate CEOs and cultural influencers shaping politics, tastes, and thinking — not sports scores alone.'
      }
    ]
  },
  {
    question: 'What does the continued public presence of neutralized influencers actually represent?',
    hint: 'The phrase that nothing is as it seems.',
    options: [
      {
        text: 'An engineered illusion — their current public presence is entirely fabricated for optics after real power was stripped.',
        rationale:
          'Visible culture was an engineered illusion; after power was stripped, public presence is entirely fabricated for optics. Nothing is as it seems.'
      },
      {
        text: 'Proof that every CEO and celebrity still holds full real-world command over politics and taste.',
        rationale:
          'Real-world power was stripped in The Big Whitehat Takeover; remaining appearances are optic replacements only.'
      },
      {
        text: 'Evidence that Phase Two never happened and cultural programming continues with original leadership intact.',
        rationale:
          'Phase Two neutralized those leaders and replaced them for optics so the sweep could remain covert until mass reveal.'
      },
      {
        text: 'A transparent public trial schedule where every influencer admits crimes nightly without any mimic technology.',
        rationale:
          'Mimic replacements hold optics until the mass reveal window; the surface show is fabrication, not open nightly trials.'
      }
    ]
  },
  {
    question: 'After Phase One, which apex roles had already been removed when Phase Two began?',
    hint: 'The absolute top of the pyramid named in target identification.',
    options: [
      {
        text: 'Prime ministers, royals, and banking heads at the absolute top of the pyramid.',
        rationale:
          'Following Phase One’s removal of prime ministers, royals, and banking heads at the pyramid top, Phase Two descended to cultural and corporate targets.'
      },
      {
        text: 'Only sports icons and mid-level influencers, leaving royals and banking heads fully in place.',
        rationale:
          'Sports icons are Phase Two targets; Phase One already removed prime ministers, royals, and banking heads at the apex.'
      },
      {
        text: 'Only DUMBS tunnel supervisors, with no surface political or banking leadership neutralized yet.',
        rationale:
          'Phase One hits surface apex leadership; DUMBS dismantling belongs to Phase Three after the cultural sweep.'
      },
      {
        text: 'Nobody of consequence — Phase One was purely symbolic and left the pyramid apex untouched.',
        rationale:
          'Phase One decapitated top-tier global leadership including prime ministers, royals, and banking heads before Phase Two.'
      }
    ]
  },
  {
    question: 'Which replacement technologies held public optics after cultural and corporate neutralization?',
    hint: 'Same suite used during Phase One.',
    options: [
      {
        text: 'Clones, stand-in actors with masks, and A.I. driven composites used to keep outward appearances stable.',
        rationale:
          'Neutralized figures were replaced for optics using clones, stand-in actors with masks, and A.I. driven composites — the same suite as Phase One.'
      },
      {
        text: 'Only handwritten press releases with empty chairs on every stage and no living-looking replacements.',
        rationale:
          'Advanced mimic technology maintained living-looking public presence so the population would not alarm early.'
      },
      {
        text: 'Full holographic confessions that ended all optics management on the first day of Phase Two.',
        rationale:
          'Optics replacements continue to hold sleepers until the designated mass reveal window, not day-one full confession broadcasts.'
      },
      {
        text: 'No replacements at all — every CEO and celebrity simply vanished from media without any stand-in.',
        rationale:
          'Replacement for optics was essential to prevent public alarm while real-world power was stripped.'
      }
    ]
  },
  {
    question: 'Why were optic replacements required during The Big Whitehat Takeover?',
    hint: 'Timing relative to public disclosure.',
    options: [
      {
        text: 'To prevent public alarm before the designated mass reveal window while real power was already gone.',
        rationale:
          'Figures were replaced for optics to prevent public alarm before the designated mass reveal window.'
      },
      {
        text: 'To restore full original command authority to every removed CEO and cultural influencer overnight.',
        rationale:
          'Replacements preserve appearance only; real-world power remains stripped under Whitehat control.'
      },
      {
        text: 'To force immediate mass panic so the Great Awakening would begin as chaotic street collapse.',
        rationale:
          'Optics management prevents premature alarm; safe collapse proceeds through frequency shifts, not forced chaos.'
      },
      {
        text: 'To advertise Phase Three tunnel maps on primetime television before any cultural clearing finished.',
        rationale:
          'Replacements hold cultural optics stable; they are not a Phase Three underground-map advertising campaign.'
      }
    ]
  },
  {
    question: 'What was the primary mechanical action of severing the influence connection?',
    hint: 'What link between parasites and the population was cut.',
    options: [
      {
        text: 'Cutting the connection between the parasites and their influence over the population’s politics, tastes, and thinking.',
        rationale:
          'The primary mechanical action was cutting the connection between parasites and their overarching influence over politics, tastes, and thinking.'
      },
      {
        text: 'Strengthening hypnotic cultural programming so independent thinking would become permanently impossible.',
        rationale:
          'The sweep severs parasitic cultural influence so people can think without artificial interference — not strengthen it.'
      },
      {
        text: 'Seizing every shipping route and dismantling every DUMB before any cultural influencer was neutralized.',
        rationale:
          'Shipping routes and DUMBS are Phase Three; Phase Two’s primary action is severing cultural and corporate influence.'
      },
      {
        text: 'Handing politics, tastes, and thinking back to the original dark controllers under a new brand name.',
        rationale:
          'Influence is cut so the population can think freely; it is not returned to the parasites under rebranding.'
      }
    ]
  },
  {
    question: 'What absolute priority did consciousness elevation serve in this sweep?',
    hint: 'Who benefits when artificial cultural interference ends.',
    options: [
      {
        text: 'Raising frequency vibration consciousness so Resonating Sols and the broader population can finally think for themselves.',
        rationale:
          'The absolute priority was raising frequency vibration consciousness so Resonating Sols and the broader human population can think for themselves without artificial cultural interference.'
      },
      {
        text: 'Lowering frequency so sleepers never notice that cultural influencers lost real-world power.',
        rationale:
          'Priority is raising frequency vibration consciousness, not lowering it to hide the operation forever.'
      },
      {
        text: 'Replacing Resonating Sols with optic composites so no independent thinking returns after Phase Two.',
        rationale:
          'Resonating Sols are helped to think freely; the sweep does not replace them with composites as its priority.'
      },
      {
        text: 'Freezing all consciousness work until Adrenochrome supply lines are publicly restored after lockdown.',
        rationale:
          'Phase Two clears cultural interference to elevate consciousness; Phase Three destroys Adrenochrome supply rather than restoring it.'
      }
    ]
  },
  {
    question: 'How does the Infrastructure Sweep relate Phase One to Phase Three?',
    hint: 'The connective role of psychological and cultural clearing.',
    options: [
      {
        text: 'It is the vital connective tissue — cultural and corporate clearing required after apex removal and before underground collapse.',
        rationale:
          'The Infrastructure Sweep forms the vital connective tissue between Phase One and Phase Three as mandatory psychological and cultural clearing.'
      },
      {
        text: 'It replaces both Phase One and Phase Three so leadership and underground economies never need separate operations.',
        rationale:
          'All three phases are distinct: apex leadership, cultural infrastructure, then underground economy destruction.'
      },
      {
        text: 'It only happens after Phase Three, once DUMBS and trafficking pipelines are already fully destroyed.',
        rationale:
          'Cultural clearing is a mandatory prerequisite for Phase Three, not a cleanup that follows underground collapse.'
      },
      {
        text: 'It has no relationship to either phase and runs as an unrelated entertainment awards reform.',
        rationale:
          'Phase Two is sequenced between political-military apex removal and physical underground dismantling as connective tissue.'
      }
    ]
  },
  {
    question: 'What did Phase One remove that allowed Phase Two to sweep cultural infrastructure?',
    hint: 'Shields around the apex predators.',
    options: [
      {
        text: 'Those controlling global resources, overarching narratives, and enforcement — the apex predators and their political-military shields.',
        rationale:
          'Phase One targeted controllers of global resources, narratives, and enforcement, removing apex predators so Phase Two could sweep cultural and corporate infrastructure.'
      },
      {
        text: 'Only sports icons, leaving political and military shields fully intact around the pyramid apex.',
        rationale:
          'Sports icons are Phase Two; Phase One removes resource, narrative, and enforcement controllers at the apex first.'
      },
      {
        text: 'Only Adrenochrome chemists, with no action against narratives, enforcement, or global resource control.',
        rationale:
          'Adrenochrome supply destruction is Phase Three; Phase One clears apex resource, narrative, and enforcement control.'
      },
      {
        text: 'Nobody — Phase Two began while apex political and military shields remained at full strength.',
        rationale:
          'Once political and military shields were down from Phase One, Phase Two could sweep cultural and corporate infrastructure.'
      }
    ]
  },
  {
    question: 'What is Phase Three: 3rd Realm Collapse in relation to this sweep?',
    hint: 'What physical systems fall after cultural clearing.',
    options: [
      {
        text: 'The phase that physically destroyed the underground economy after Phase Two’s psychological and cultural clearing.',
        rationale:
          'Phase Three: 3rd Realm Collapse physically destroyed the underground economy after Phase Two’s cultural clearing as a mandatory prerequisite.'
      },
      {
        text: 'The phase that only renames entertainment awards while leaving underground economies fully operational.',
        rationale:
          'Phase Three physically destroys underground economies, DUMBS, trafficking, and Adrenochrome supply — not award-show cosmetics.'
      },
      {
        text: 'The phase that removes only prime ministers and banking heads before any cultural influencer is touched.',
        rationale:
          'Apex political and banking removals are Phase One; Phase Three is underground physical and financial obliteration.'
      },
      {
        text: 'The public mass-reveal broadcast hour with no underground dismantling of bases or trafficking pipelines.',
        rationale:
          'Mass reveal is the later strategic window; Phase Three is physical destruction of underground parasitic infrastructure.'
      }
    ]
  },
  {
    question: 'Which underground systems did Phase Three destroy after the Infrastructure Sweep?',
    hint: 'Bases, pipelines, and a specific harvest supply.',
    options: [
      {
        text: 'DUMBS, human trafficking pipelines, and the Adrenochrome supply that fed the underground parasitic economy.',
        rationale:
          'Phase Three destroyed the underground economy, DUMBS, human trafficking pipelines, and the Adrenochrome supply.'
      },
      {
        text: 'Only surface film studios, with DUMBS and trafficking networks left completely intact as safe havens.',
        rationale:
          'Phase Three hits underground bases, trafficking pipelines, and Adrenochrome supply — not merely surface studios.'
      },
      {
        text: 'Organic Light Grid temples that guide awakening, mistaken for parasitic underground infrastructure.',
        rationale:
          'Targets are parasitic underground economies and harvest systems, not organic awakening infrastructure.'
      },
      {
        text: 'Nothing physical — Phase Three was only a press conference announcing future plans without raids.',
        rationale:
          'Phase Three physically destroyed underground economies, DUMBS, trafficking pipelines, and Adrenochrome supply.'
      }
    ]
  },
  {
    question: 'Under what cover were Phases One through Three systematically executed together?',
    hint: 'The global event that masked the purge sequence.',
    options: [
      {
        text: 'Under the cover of the Covid plandemic lockdowns that hid leadership, cultural, and underground strikes.',
        rationale:
          'Together the three phases stripped parasites of leadership, mind-control apparatus, and financial lifeblood under Covid plandemic lockdown cover.'
      },
      {
        text: 'Under full live mass-reveal broadcasting that showed every raid in real time from day one.',
        rationale:
          'The sequence ran covertly under lockdown cover; the mass reveal window is held until later controlled disclosure.'
      },
      {
        text: 'Under a voluntary celebrity confession tour with no lockdown cover and no military alliance role.',
        rationale:
          'Execution was a Whitehat military-alliance operation under Covid plandemic lockdown cover, not a voluntary confession tour.'
      },
      {
        text: 'Under open international sports tournaments that never paused public gatherings or travel.',
        rationale:
          'Cover was the Covid plandemic lockdowns, which constrained normal public life while the three phases ran.'
      }
    ]
  },
  {
    question: 'What did seamless Whitehat sequencing between political purge and underground collapse ensure?',
    hint: 'What could rise once cultural programmers were removed.',
    options: [
      {
        text: 'That the realm’s consciousness could elevate unhindered once cultural programmers were strategically removed.',
        rationale:
          'By executing the Infrastructure Sweep between political purge and underground collapse, the Whitehats ensured consciousness could elevate unhindered.'
      },
      {
        text: 'That consciousness would be permanently suppressed so no Great Awakening path could open afterward.',
        rationale:
          'Strategic removal of cultural programmers broke the spell and set the stage for the Great Awakening — not permanent suppression.'
      },
      {
        text: 'That parasites would regain corporate and entertainment command before Phase Three began.',
        rationale:
          'Phase Two strips real-world cultural and corporate power; sequencing protects elevation, not parasitic restoration.'
      },
      {
        text: 'That sleepers would riot immediately with no stable optics holding pattern until mass reveal.',
        rationale:
          'Stand-ins hold sleepers stable until the mass reveal; seamless sequencing avoids premature chaos while consciousness rises.'
      }
    ]
  },
  {
    question: 'What did removing cultural programmers strategically set the stage for?',
    hint: 'The larger awakening beyond Phase Two itself.',
    options: [
      {
        text: 'The true Great Awakening, after the spell over the masses was effectively broken.',
        rationale:
          'Strategic removal of cultural programmers broke the spell over the masses and set the stage for the true Great Awakening.'
      },
      {
        text: 'A deeper spell that reattached the population to entertainment royalty more tightly than before.',
        rationale:
          'Removal broke the spell over the masses; it did not deepen cultural hypnosis.'
      },
      {
        text: 'Permanent cancellation of any mass reveal window so sleepers never learn what occurred.',
        rationale:
          'Controlled stand-ins hold the population only until the precise mass reveal window — disclosure is staged, not cancelled.'
      },
      {
        text: 'Immediate return of full Adrenochrome markets as the official economy of the awakened timeline.',
        rationale:
          'Phase Three destroys Adrenochrome supply; Phase Two clears culture for awakening, not market restoration.'
      }
    ]
  },
  {
    question: 'What role do controlled stand-ins for cultural figures still play after power is stripped?',
    hint: 'Stability management until a timed disclosure.',
    options: [
      {
        text: 'They hold the sleeping masses in a manageable, stable state until the precise mass reveal window.',
        rationale:
          'Continued use of controlled stand-ins holds sleeping masses in a manageable, stable state until the precise mass reveal window.'
      },
      {
        text: 'They restore original real-world power so parasites again dictate politics, tastes, and thinking fully.',
        rationale:
          'Stand-ins are optics only after real power is stripped; they manage sleepers until reveal, not restore parasite command.'
      },
      {
        text: 'They publicly dismantle every DUMB on live television as Phase Two’s only remaining task.',
        rationale:
          'DUMBS destruction is Phase Three; stand-ins manage cultural surface optics until mass reveal.'
      },
      {
        text: 'They have no function — all surface culture vanished the moment Phase Two neutralization finished.',
        rationale:
          'Optics replacements continue specifically so sleepers remain stable until the mass reveal window.'
      }
    ]
  },
  {
    question: 'How is 3D reality meant to collapse safely after this sequencing?',
    hint: 'Frequency path versus chaos path.',
    options: [
      {
        text: 'Through frequency shifts rather than premature societal chaos, while stand-ins keep surface optics stable.',
        rationale:
          'Sequencing and stand-in optics ensure 3D reality collapses safely through frequency shifts rather than premature societal chaos.'
      },
      {
        text: 'Through day-one chaotic demolition of every city with no frequency work and no managed holding pattern.',
        rationale:
          'Safe collapse is via frequency shifts with managed stability — not premature societal chaos.'
      },
      {
        text: 'Through permanent freeze of the false 3D overlay so it never collapses at all after Phase Two.',
        rationale:
          'The design is safe collapse of 3D reality through frequency shifts, not permanent freeze of the illusion.'
      },
      {
        text: 'Through restoring full cultural programming so the 3D spell rebuilds stronger than before the purge.',
        rationale:
          'Cultural programming was severed to break the spell; collapse proceeds by frequency elevation, not restored hypnosis.'
      }
    ]
  },
  {
    question: 'What direct population effect did neutralizing cultural and corporate dictators produce?',
    hint: 'Tethers, frequency, and consciousness together.',
    options: [
      {
        text: 'It severed psychological and cultural tethers binding humanity, directly elevating global frequency and consciousness.',
        rationale:
          'Neutralizing those dictating tastes, politics, and corporate operations severed psychological and cultural tethers and directly elevated global frequency and consciousness.'
      },
      {
        text: 'It tightened psychological and cultural tethers so global frequency fell and independent thought vanished.',
        rationale:
          'The sweep severs those tethers and elevates frequency and consciousness — the opposite of tightening control.'
      },
      {
        text: 'It only changed corporate logos while leaving every psychological tether to parasites fully intact.',
        rationale:
          'Real influence connections were cut and consciousness elevation was the absolute priority, not cosmetic rebranding.'
      },
      {
        text: 'It delayed all frequency work until after open mass panic destroyed social order without Whitehat cover.',
        rationale:
          'Elevation of global frequency and consciousness was a direct result of Phase Two neutralization under managed cover.'
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

  // Correct claim grounding
  const correct = out.options.find((o) => o.isCorrect);
  const claim = `${correct.text} ${correct.rationale}`.toLowerCase();
  const claimTokens = (claim.match(/[a-z0-9%]{5,}/g) || []).filter(
    (t, i, a) => a.indexOf(t) === i
  );
  const hitRate =
    claimTokens.filter((t) => reportLower.includes(t)).length / Math.max(claimTokens.length, 1);
  if (hitRate < 0.28) {
    throw new Error(
      `Q${number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
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
  'Test your understanding of Infrastructure Sweep — Phase Two of the Great Purge that neutralizes corporate, entertainment, and cultural influencers to raise global frequency.';
const DESC_META =
  'Interactive Living Truth Quiz on Infrastructure Sweep: Phase Two Great Purge neutralization of corporate CEOs, entertainment royalty, and cultural programmers under Whitehat optics.';
const SUBTITLE =
  'Test your grasp of Infrastructure Sweep — Phase Two cultural and corporate neutralization, Big Whitehat optic replacements, and consciousness elevation between apex purge and underground collapse.';

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
      'Infrastructure Sweep is Phase Two of the Great Purge — the cultural and corporate clearing that severs parasitic influence over politics, tastes, and thinking while clones, masked stand-ins, and A.I. composites hold surface optics. Sit with what you missed, then return to the Infrastructure Sweep deep-dive, infographic, and video transmissions. Between apex leadership removal and underground collapse, this sweep elevates frequency vibration consciousness so Resonating Sols and the broader population can finally think for themselves until the mass reveal window.'
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

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'targeting-parasites.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Targeting Parasites Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Targeting Parasites: The Great Purge apex-to-underground dismantling of parasitic control under lockdown cover.',
    DESC_META
  ],
  ['quiz/breakdown/targeting-parasites.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/targeting-parasites.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=breakdown&amp;topic=targeting-parasites',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Targeting Parasites deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Targeting Parasites</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/targeting-parasites.json',
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
    "  { path: '/quiz/breakdown/targeting-parasites.html', priority: '0.75', changefreq: 'monthly' },";
  if (sm.includes(anchor)) {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  } else {
    const fallback =
      "  { path: '/quiz/breakdown/phase-one-three.html', priority: '0.75', changefreq: 'monthly' },";
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
console.log('PASS: audited 25/25 against data/breakdown-topics/infrastructure-sweep.json');
