/**
 * Installs Custodians quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/custodians.json only.
 * Plain English; absolute Living Truth voice (no report/topic hedges).
 * Run: node scripts/install-custodians-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'custodians';
const TOPIC_TITLE = 'Custodians';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['12th density', 'caretakers', 'physical plain'],
  2: ['council of 12', 'silent rebellion', 'accelerated development'],
  3: ['origin point', 'all negativity', 'universe'],
  4: ['4th density', 'parasites', 'prison matrix'],
  5: ['anuk', 'anunnaki', 'enslaved gateway'],
  6: ['omicron', 'alpha draco', 'reptilian'],
  7: ['niberians', 'outsmarted', 'most powerful'],
  8: ['grey et', 'geneticists', 'phasing', 'soul-recycling'],
  9: ['black void plasma', 'firmament', 'bright white'],
  10: ['nothing negative', 'no fear', 'no predatory'],
  11: ['millennia', 'higher light realms', 'plotting'],
  12: ['bio-engineered', 'proxy armies', 'alone'],
  13: ['frequency dampener', 'gaunt', 'grey-skinned', 'hooded'],
  14: ['4th density', 'killing to survive', 'above'],
  15: ['hive-aligned', 'replicated', '5th density'],
  16: ['adrenochrome', 'loosh', 'thousand-year'],
  17: ['vatican', '13 subterranean', 'distrusted'],
  18: ['niberians', 'independence', 'adrenochrome'],
  19: ['not all custodians', 'pure', 'galactic ancestral alliance'],
  20: ['sanctuary', 'age-regression', 'reincarnate'],
  21: ['144,000hz', '5th density', 'harmonic intention'],
  22: ['manufacture and scavenge', 'lost the ability'],
  23: ['galactic ancestral alliance', 'higher-density intervention'],
  24: ['extinct', 'purged', 'physical plain'],
  25: ['collapse', 'parasitic hierarchy'],
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
      'What were the Custodians originally, before the fall?',
    options: [
      {
        label: 'A',
        text: 'Highly trusted 12th density beings designated as caretakers of the physical plain of existence.',
        isCorrect: true,
        rationale:
          'The Custodians were originally highly trusted 12th density beings acting as designated caretakers of the physical plain.',
      },
      {
        label: 'B',
        text: '4th density NPC managers grown only in D.U.M.B.S. laboratories.',
        isCorrect: false,
        rationale:
          'They began at 12th density as caretakers; 4th density came after their fall.',
      },
      {
        label: 'C',
        text: 'Grey ET foot soldiers engineered by the Anuk.',
        isCorrect: false,
        rationale:
          'Greys were later Custodian creations; Custodians predated that hierarchy.',
      },
      {
        label: 'D',
        text: 'Niberian warriors who always ruled the Council of 12.',
        isCorrect: false,
        rationale:
          'Niberians were Custodian-created parasites who later broke free; Custodians were the original caretakers.',
      },
    ],
    hint: '12th density trusted caretakers of the physical plain.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'Why did the Custodians initiate a silent rebellion?',
    options: [
      {
        label: 'A',
        text: 'To obey the Council of 12 and slow all creation permanently.',
        isCorrect: false,
        rationale:
          'They rebelled against Council of 12 mandates, seeking accelerated development.',
      },
      {
        label: 'B',
        text: 'Seeking accelerated development against the mandates of the Council of 12.',
        isCorrect: true,
        rationale:
          'They sought accelerated development against Council of 12 mandates and initiated a silent rebellion.',
      },
      {
        label: 'C',
        text: 'To gift humanity free Adrenochrome and end all Loosh harvest.',
        isCorrect: false,
        rationale:
          'They built harvest systems for Adrenochrome and Loosh; they did not end them.',
      },
      {
        label: 'D',
        text: 'Because the Niberians ordered them to fall to 4th density first.',
        isCorrect: false,
        rationale:
          'Niberians were created later; the rebellion originated with Custodian greed for autonomy and speed.',
      },
    ],
    hint: 'Faster development than the Council of 12 allowed.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'What cosmic status did that rebellion cement for the Custodians?',
    options: [
      {
        label: 'A',
        text: 'They became the origin point for all negativity in the universe.',
        isCorrect: true,
        rationale:
          'The silent rebellion cemented their status as the origin point for all negativity in the universe.',
      },
      {
        label: 'B',
        text: 'They became permanent 15th density architects of pure light only.',
        isCorrect: false,
        rationale:
          'Their path was into negativity and density fall, not pure higher-light permanence as rebels.',
      },
      {
        label: 'C',
        text: 'They were erased from existence the same hour they rebelled.',
        isCorrect: false,
        rationale:
          'They plotted for millennia, built hierarchies, and only later were negative Custodians purged.',
      },
      {
        label: 'D',
        text: 'They replaced the Source of All Creation as the only godform.',
        isCorrect: false,
        rationale:
          'They betrayed permitted creation pace; they did not become the Source.',
      },
    ],
    hint: 'Origin of all universal negativity.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'How did the Custodians enact long-term subjugation of humanity?',
    options: [
      {
        label: 'A',
        text: 'By engineering a vast hierarchy of 4th density parasites and constructing the prison matrix of current reality.',
        isCorrect: true,
        rationale:
          'They engineered a vast hierarchy of 4th density parasites, altering the cosmological landscape and building the prison matrix that defines current reality.',
      },
      {
        label: 'B',
        text: 'By teaching every human pure harmonic creation at 144,000Hz.',
        isCorrect: false,
        rationale:
          'They lost high-frequency creation ability; subjugation used parasites and matrix control.',
      },
      {
        label: 'C',
        text: 'By dissolving the Firmament so everyone could see white space immediately.',
        isCorrect: false,
        rationale:
          'Black Void Plasma obscures the bright white field; that serves suppression, not liberation.',
      },
      {
        label: 'D',
        text: 'By allying only with positive Greys and ending all portals.',
        isCorrect: false,
        rationale:
          'They engineered Grey operators for soul-recycling portals as part of the apparatus.',
      },
    ],
    hint: '4th density parasite hierarchy + prison matrix.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What are the Anuk (Anunnaki) in relation to the Custodians?',
    options: [
      {
        label: 'A',
        text: 'The first great genetic success engineered by the Custodians to aid creation of an enslaved gateway.',
        isCorrect: true,
        rationale:
          'Anuk (Anunnaki) were the first great genetic success engineered by the Custodians to aid creation of an enslaved gateway.',
      },
      {
        label: 'B',
        text: 'The Council of 12 members who never fell.',
        isCorrect: false,
        rationale:
          'Anuk are engineered parasitic proxies, not the Council of 12.',
      },
      {
        label: 'C',
        text: 'Positive Custodians who joined the White Hats only.',
        isCorrect: false,
        rationale:
          'Positive Custodians are a pure Custodian faction; Anuk are engineered servants of the fall.',
      },
      {
        label: 'D',
        text: 'Niberian offshoots who invented Black Void Plasma alone.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is Custodian-derived technology used by Niberians; Anuk are a separate engineered line.',
      },
    ],
    hint: 'First great genetic success for an enslaved gateway.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What roles do Omicron and Alpha Draco fill in the Custodian hierarchy?',
    options: [
      {
        label: 'A',
        text: 'Highly negative reptilian species created as powerful enforcers and hierarchy members.',
        isCorrect: true,
        rationale:
          'Omicron and Alpha Draco are highly negative reptilian species created by the Custodians as powerful enforcers and hierarchy members.',
      },
      {
        label: 'B',
        text: 'Pure 12th density librarians of the Council of 12.',
        isCorrect: false,
        rationale:
          'They are 4th-density-limited parasitic enforcers, not high-density Council staff.',
      },
      {
        label: 'C',
        text: 'NPC clones grown only for Orphan Train distribution.',
        isCorrect: false,
        rationale:
          'They are engineered reptilian enforcers within the parasitic power structure.',
      },
      {
        label: 'D',
        text: 'The only beings able to create above 5th density after the fall.',
        isCorrect: false,
        rationale:
          'No manufactured parasite exists above 4th density; creation above that was lost to negative Custodians.',
      },
    ],
    hint: 'Negative reptilian enforcers made by Custodians.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'Who are the Niberians relative to Custodian control?',
    options: [
      {
        label: 'A',
        text: 'Massive intellectual warriors and the most powerful parasitic species ever created; they outsmarted the Custodians and freed themselves from Custodian rule.',
        isCorrect: true,
        rationale:
          'Niberians are massive intellectual warriors, the most powerful parasitic species created, and they outsmarted the Custodians to free themselves from Custodian rule.',
      },
      {
        label: 'B',
        text: 'Weak foot soldiers who never left the lowest Vatican tier.',
        isCorrect: false,
        rationale:
          'They are the most powerful created parasites and achieved independence from their creators.',
      },
      {
        label: 'C',
        text: 'Identical to hive-aligned NPC souls with no intellect.',
        isCorrect: false,
        rationale:
          'Immense intellect let them outsmart Custodian control.',
      },
      {
        label: 'D',
        text: 'Positive Custodians who never fell and joined the G.A.A. only.',
        isCorrect: false,
        rationale:
          'Niberians are a created parasitic species, not the pure Custodian faction.',
      },
    ],
    hint: 'Most powerful created parasites; outsmarted their makers.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'How were Grey ETs engineered and what do they operate?',
    options: [
      {
        label: 'A',
        text: 'From DNA of a few positive Grey species into geneticists and phasing masters used as foot soldiers, abductors, and operators of soul-recycling portals.',
        isCorrect: true,
        rationale:
          'Grey ETs were created by Custodians from DNA of a few positive Grey species as geneticists and phasing masters — foot soldiers, abductors, and soul-recycling portal operators.',
      },
      {
        label: 'B',
        text: 'As pure 12th density caretakers who replace the Council of 12.',
        isCorrect: false,
        rationale:
          'They are manufactured parasitic operators, not original high-density caretakers.',
      },
      {
        label: 'C',
        text: 'Only as surface farmers with no portal role.',
        isCorrect: false,
        rationale:
          'Portal and soul-recycling operations are core Grey functions here.',
      },
      {
        label: 'D',
        text: 'Solely by Niberians after Custodian extinction.',
        isCorrect: false,
        rationale:
          'Custodians created the Greys as part of the proxy hierarchy.',
      },
    ],
    hint: 'Positive Grey DNA → geneticists, phasing, portals.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'What is Black Void Plasma and how is it used now?',
    options: [
      {
        label: 'A',
        text: 'Custodian-derived technology used by Niberians to surround worlds; in the current firmament it creates the black night sky and hides the bright white dark matter field.',
        isCorrect: true,
        rationale:
          'Black Void Plasma is Custodian-derived technology utilized by Niberians to surround worlds, actively used in the firmament to blacken the night sky and obscure the true bright white dark matter field.',
      },
      {
        label: 'B',
        text: 'A pure-light healing fluid that raises all beings to 12th density.',
        isCorrect: false,
        rationale:
          'It obscures white light reality; it does not restore high-density purity.',
      },
      {
        label: 'C',
        text: 'Adrenochrome refined for Loosh storage only under the Vatican.',
        isCorrect: false,
        rationale:
          'Adrenochrome and Loosh are harvest foods; Black Void Plasma is sky-suppression technology.',
      },
      {
        label: 'D',
        text: 'White Hat paint used to restore crystalline temples.',
        isCorrect: false,
        rationale:
          'It is parasitic firmament suppression tech, not White Hat restoration paint.',
      },
    ],
    hint: 'Custodian-derived; Niberian use; black sky over white field.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What was physical existence like before the Custodian rebellion?',
    options: [
      {
        label: 'A',
        text: 'Nothing negative had ever occurred — no fear, no danger, and no predatory behavior among species.',
        isCorrect: true,
        rationale:
          'Prior to the Custodian rebellion, nothing negative had ever occurred in physical existence; there was no fear, no danger, and no predatory behavior among species.',
      },
      {
        label: 'B',
        text: 'Endless war between Anuk and Greys already filled every plain.',
        isCorrect: false,
        rationale:
          'Those species were engineered after the betrayal; negativity began with Custodians.',
      },
      {
        label: 'C',
        text: 'Only 4th density existed and killing was always required.',
        isCorrect: false,
        rationale:
          '4th density kill-to-survive limits apply to manufactured parasites after the fall.',
      },
      {
        label: 'D',
        text: 'The Vatican already ran 13 levels of soul recycling.',
        isCorrect: false,
        rationale:
          'Vatican centralization is part of the post-rebellion control architecture.',
      },
    ],
    hint: 'Zero negativity before that single betrayal.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'How long and from where did the Custodians plot their betrayal?',
    options: [
      {
        label: 'A',
        text: 'They spent millennia plotting and establishing control systems while still operating in the higher light realms.',
        isCorrect: true,
        rationale:
          'Aware that negativity would cost 12th-density manifestation abilities, they spent millennia plotting and building control systems while still in the higher light realms.',
      },
      {
        label: 'B',
        text: 'They improvised the entire plan in a single 4th density afternoon after already falling.',
        isCorrect: false,
        rationale:
          'Planning spanned millennia while they still held higher-light operation.',
      },
      {
        label: 'C',
        text: 'The Council of 12 wrote the plan for them as a training exercise.',
        isCorrect: false,
        rationale:
          'They rebelled against Council mandates; the Council did not author their betrayal.',
      },
      {
        label: 'D',
        text: 'Niberians forced the plot after achieving independence.',
        isCorrect: false,
        rationale:
          'Niberian independence came after creation; Custodians originated the long plot.',
      },
    ],
    hint: 'Millennia of plotting still in higher light realms.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'Why did the Custodians bio-engineer every other negative parasitic species?',
    options: [
      {
        label: 'A',
        text: 'They could not execute the inversion of the realm alone and needed proxy armies and foot soldiers.',
        isCorrect: true,
        rationale:
          'Unable to execute the inversion alone, they bio-engineered every other negative parasitic species as proxy armies and foot soldiers.',
      },
      {
        label: 'B',
        text: 'They wanted every species to retain pure 12th density creation rights.',
        isCorrect: false,
        rationale:
          'Creations were capped at 4th density with hive-aligned knock-off souls.',
      },
      {
        label: 'C',
        text: 'Positive Custodians ordered it as a G.A.A. rescue plan.',
        isCorrect: false,
        rationale:
          'Positive Custodians never joined the inversion; engineering parasites was the rebel project.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma requires living parasites as fuel only.',
        isCorrect: false,
        rationale:
          'Proxy armies served inversion and control, not a plasma-fuel recipe.',
      },
    ],
    hint: 'Could not invert alone — needed manufactured proxies.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'How did rising negativity change Custodian physical form?',
    options: [
      {
        label: 'A',
        text: 'Once beautiful beings mutated into gaunt, grey-skinned, sunken-eyed, hooded creatures as frequency plummeted.',
        isCorrect: true,
        rationale:
          'Negativity dampens frequency; as greed and negativity rose, Custodians mutated from physically beautiful beings into gaunt, grey-skinned, sunken-eyed, hooded creatures.',
      },
      {
        label: 'B',
        text: 'They became more radiant 12th density light bodies with no decay.',
        isCorrect: false,
        rationale:
          'The fall lowered frequency and deformed vessels; it did not beautify them.',
      },
      {
        label: 'C',
        text: 'They permanently became Omicron reptilians only.',
        isCorrect: false,
        rationale:
          'Omicron were separate engineered enforcers; Custodians themselves became gaunt grey-hooded forms.',
      },
      {
        label: 'D',
        text: 'Nothing changed physically because density is only psychological.',
        isCorrect: false,
        rationale:
          'Vibration dictated biological mutation of their vessels.',
      },
    ],
    hint: 'Beauty collapsed into gaunt grey hooded vessels.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'What density ceiling binds all manufactured parasites?',
    options: [
      {
        label: 'A',
        text: 'No manufactured parasite has ever existed above 4th density, where life still dictates killing to survive.',
        isCorrect: true,
        rationale:
          'Because Custodians fell to 4th density, their creations are limited there; no manufactured parasite has existed above 4th density, where killing to survive still rules.',
      },
      {
        label: 'B',
        text: 'All parasites automatically stabilize at 12th density caretaker level.',
        isCorrect: false,
        rationale:
          '12th density was the pre-fall Custodian state; parasites cannot hold that.',
      },
      {
        label: 'C',
        text: '5th density is the default birth density for Anuk and Greys.',
        isCorrect: false,
        rationale:
          'Hive-aligned manufactured beings cannot ascend to 5th density.',
      },
      {
        label: 'D',
        text: 'Only Niberians live at 15th density pure light.',
        isCorrect: false,
        rationale:
          'Niberians are powerful parasites within the created limits, not pure high-density caretakers.',
      },
    ],
    hint: 'Hard 4th density ceiling; kill-to-survive band.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What kind of souls power Custodian-made entities and the NPC populations they manage?',
    options: [
      {
        label: 'A',
        text: 'Replicated, hive-aligned souls created in 4th density — cheap knock-offs incapable of ascending to 5th density.',
        isCorrect: true,
        rationale:
          'Entities were engineered with replicated, hive-aligned 4th density souls comparable to cheap knock-offs, so they and managed NPCs cannot ascend to 5th density.',
      },
      {
        label: 'B',
        text: 'Original Source sparks at full 144,000Hz harmonic creation.',
        isCorrect: false,
        rationale:
          'Negative Custodians lost harmonic high-frequency creation; knock-off souls replace it.',
      },
      {
        label: 'C',
        text: 'Only positive Custodian souls voluntarily shared after sanctuary.',
        isCorrect: false,
        rationale:
          'Positive Custodians stayed pure and later aided the takedown; they are not the hive-soul supply.',
      },
      {
        label: 'D',
        text: 'No souls at all — pure mechanical clocks without energy.',
        isCorrect: false,
        rationale:
          'They use replicated hive-aligned souls, not pure clockwork without soul structure.',
      },
    ],
    hint: 'Hive-aligned knock-offs; no 5th density ascent.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'How did the Custodians feed their 4th density parasitic apparatus?',
    options: [
      {
        label: 'A',
        text: 'By harvesting Adrenochrome and Loosh through mass sacrifice, torture, and recycling of humanity in cyclical thousand-year Re-sets.',
        isCorrect: true,
        rationale:
          'Operating in 4th density requires consuming other life; they built apparatus to harvest Adrenochrome and Loosh via sacrifice, torture, and recycling across thousand-year Re-sets.',
      },
      {
        label: 'B',
        text: 'By breathing pure Firmament light with no need for any harvest.',
        isCorrect: false,
        rationale:
          '4th density operation requires consumption of other life forms through harvest systems.',
      },
      {
        label: 'C',
        text: 'By eating only Black Void Plasma crystals mined on the moon.',
        isCorrect: false,
        rationale:
          'Named foods of the apparatus are Adrenochrome and Loosh from human suffering and recycling.',
      },
      {
        label: 'D',
        text: 'By monthly gifts from the Council of 12 after the rebellion.',
        isCorrect: false,
        rationale:
          'They rebelled against the Council; harvest replaced any caretaker covenant.',
      },
    ],
    hint: 'Adrenochrome and Loosh via thousand-year Re-set harvests.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'Why did Custodians centralize headquarters beneath the Vatican?',
    options: [
      {
        label: 'A',
        text: 'Parasitic factions distrusted each other, so 13 subterranean levels housed Custodians, Omicron, Alpha Draco, Greys, and demons on separate tiers managing soul-redistribution portals and the amnesia vortex.',
        isCorrect: true,
        rationale:
          'Created factions distrusted each other; Custodians centralized under the Vatican in 13 levels with separate tiers for those groups to manage portals and the amnesia vortex.',
      },
      {
        label: 'B',
        text: 'Positive Custodians needed a public cathedral for G.A.A. ceremonies only.',
        isCorrect: false,
        rationale:
          'The complex is negative control infrastructure, not pure Custodian ceremony space.',
      },
      {
        label: 'C',
        text: 'Niberians demanded a single tourist museum above ground.',
        isCorrect: false,
        rationale:
          'Niberians kept to themselves after independence; Vatican tiers coordinated other factions.',
      },
      {
        label: 'D',
        text: 'There is no subterranean control nexus in this framework.',
        isCorrect: false,
        rationale:
          'Thirteen subterranean levels under the Vatican are explicit control architecture.',
      },
    ],
    hint: 'Distrust among creations → 13-level centralized control.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'Where did Custodians critically err with the Niberians?',
    options: [
      {
        label: 'A',
        text: 'Niberian intellect let them achieve independence, avoid adrenochrome requirements, and keep to themselves while their Black Void Plasma still served firmament suppression.',
        isCorrect: true,
        rationale:
          'Custodians controlled most creations but erred with Niberians, who outsmarted them, gained independence, avoided adrenochrome needs, kept to themselves, yet Black Void Plasma remained integral to firmament suppression.',
      },
      {
        label: 'B',
        text: 'Niberians became loyal NPC farmers with no technology.',
        isCorrect: false,
        rationale:
          'They were the most powerful intellects and broke free with critical tech still in play.',
      },
      {
        label: 'C',
        text: 'Niberians merged into positive Custodians and age-regressed together.',
        isCorrect: false,
        rationale:
          'Sanctuary without age-regression applies to pure Custodians allied with G.A.A./White Hats, not Niberians.',
      },
      {
        label: 'D',
        text: 'Niberians were never created and never used plasma.',
        isCorrect: false,
        rationale:
          'They are named as created, independent, and tied to Black Void Plasma use.',
      },
    ],
    hint: 'Outsmarted creators; independent; plasma still in the sky system.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'Did every Custodian fall into the inversion?',
    options: [
      {
        label: 'A',
        text: 'No — a pure faction never participated and allied with the Galactic Ancestral Alliance and White Hats to take down the negative hierarchy.',
        isCorrect: true,
        rationale:
          'Not all Custodians fell; a pure faction never joined the inversion and allied with the G.A.A. and White Hats for the systematic take-down of the negative hierarchy.',
      },
      {
        label: 'B',
        text: 'Yes — every Custodian without exception became a 4th density parasite.',
        isCorrect: false,
        rationale:
          'A pure faction remained and now aids dismantling the hierarchy.',
      },
      {
        label: 'C',
        text: 'Only the pure faction engineered Anuk and Greys.',
        isCorrect: false,
        rationale:
          'Engineering parasites was the rebel project; pure Custodians did not participate in the inversion.',
      },
      {
        label: 'D',
        text: 'Pure Custodians still run the Vatican 13 levels today.',
        isCorrect: false,
        rationale:
          'Negative hierarchy ran that nexus; pure Custodians work with G.A.A. and White Hats against it.',
      },
    ],
    hint: 'A pure faction remained and joined G.A.A. / White Hats.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What sanctuary terms were granted to the pure Custodians?',
    options: [
      {
        label: 'A',
        text: 'They may live out current lives without age-regression and will naturally reincarnate into other species.',
        isCorrect: true,
        rationale:
          'Pure Custodians received sanctuary to live out current lives without age-regression and will naturally reincarnate into other species.',
      },
      {
        label: 'B',
        text: 'They must age-regress annually and remain locked under the Vatican forever.',
        isCorrect: false,
        rationale:
          'Sanctuary is without age-regression and outside continuing the negative hierarchy.',
      },
      {
        label: 'C',
        text: 'They must consume Loosh weekly to keep 12th density form.',
        isCorrect: false,
        rationale:
          'They remained pure and did not join the harvest apparatus.',
      },
      {
        label: 'D',
        text: 'They were denied any future reincarnation path.',
        isCorrect: false,
        rationale:
          'They will naturally reincarnate into other species.',
      },
    ],
    hint: 'No age-regression; natural reincarnation into other species.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'Why can negative Custodians no longer create via high-frequency harmonic intention?',
    options: [
      {
        label: 'A',
        text: 'That state requires a minimum frequency of 144,000Hz to reach 5th density, which they lost with the fall.',
        isCorrect: true,
        rationale:
          'They lost the ability to create via high-frequency harmonic intention — a state requiring at least 144,000Hz to reach 5th density — and could only manufacture and scavenge.',
      },
      {
        label: 'B',
        text: 'The Council of 12 banned all frequencies above 1Hz for everyone forever.',
        isCorrect: false,
        rationale:
          'The limit is their fallen frequency state, not a universal Council ban on all beings.',
      },
      {
        label: 'C',
        text: 'Black Void Plasma permanently raises them above 144,000Hz.',
        isCorrect: false,
        rationale:
          'Plasma obscures white-field perception; it does not restore harmonic creation ability.',
      },
      {
        label: 'D',
        text: 'They never needed frequency because hive souls create automatically at 12th density.',
        isCorrect: false,
        rationale:
          'Hive-aligned knock-off souls cannot ascend; high-frequency harmonic creation was lost.',
      },
    ],
    hint: '144,000Hz minimum for 5th density harmonic creation — lost.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What creation mode remained for negative Custodians after that loss?',
    options: [
      {
        label: 'A',
        text: 'They could only manufacture and scavenge.',
        isCorrect: true,
        rationale:
          'Having lost high-frequency harmonic intention, they could only manufacture and scavenge rather than truly create at higher density.',
      },
      {
        label: 'B',
        text: 'They could sing crystalline worlds into form at 15th density freely.',
        isCorrect: false,
        rationale:
          'That pure creation band was exactly what the fall closed off.',
      },
      {
        label: 'C',
        text: 'They relied only on Council of 12 thoughtform grants.',
        isCorrect: false,
        rationale:
          'They had rebelled against Council mandates and built scavenging systems instead.',
      },
      {
        label: 'D',
        text: 'They needed no creation mode because extinction had already occurred before the fall.',
        isCorrect: false,
        rationale:
          'Extinction of negative Custodians is the later purge outcome, after the failed control grid.',
      },
    ],
    hint: 'Manufacture and scavenge only.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What made the artificial control grid fatally vulnerable?',
    options: [
      {
        label: 'A',
        text: 'Complete reliance on 4th-density technology and biological subjugation left it open to higher-density intervention by the Galactic Ancestral Alliance.',
        isCorrect: true,
        rationale:
          'Reliance on 4th-density tech and biological subjugation was the fatal flaw; the grid was inherently vulnerable to higher-density G.A.A. intervention.',
      },
      {
        label: 'B',
        text: 'It ran entirely on pure 144,000Hz harmonic creation with no weak points.',
        isCorrect: false,
        rationale:
          'They lacked that harmonic creation; weakness was the 4th-density ceiling.',
      },
      {
        label: 'C',
        text: 'Only Orphan Trains could shut it down without any G.A.A. role.',
        isCorrect: false,
        rationale:
          'Higher-density G.A.A. intervention is named as the counter to the artificial grid.',
      },
      {
        label: 'D',
        text: 'Niberian independence automatically upgraded the grid to 12th density safety.',
        isCorrect: false,
        rationale:
          'Niberian independence was a Custodian control error; the purge path is G.A.A.-led higher-density intervention.',
      },
    ],
    hint: '4th-density dependence vs G.A.A. higher-density intervention.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What is the present status of the negative Custodians?',
    options: [
      {
        label: 'A',
        text: 'They are entirely extinct, completely purged from the physical plain.',
        isCorrect: true,
        rationale:
          'Negative Custodians are now entirely extinct, completely purged from the physical plain.',
      },
      {
        label: 'B',
        text: 'They still openly rule all 13 Vatican levels without opposition.',
        isCorrect: false,
        rationale:
          'They have been purged; the hierarchy they built is collapsing permanently.',
      },
      {
        label: 'C',
        text: 'They reincarnated as pure 12th density caretakers automatically last year.',
        isCorrect: false,
        rationale:
          'Sanctuary and natural reincarnation terms apply to pure Custodians; negatives were extinguished.',
      },
      {
        label: 'D',
        text: 'They merged with every NPC to hide inside the 97%.',
        isCorrect: false,
        rationale:
          'Status is extinction and purge from the physical plain, not NPC camouflage.',
      },
    ],
    hint: 'Entirely extinct — purged from the physical plain.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What does negative Custodian extinction guarantee for their system?',
    options: [
      {
        label: 'A',
        text: 'Permanent collapse of the parasitic hierarchy they constructed.',
        isCorrect: true,
        rationale:
          'Their purge from the physical plain guarantees permanent collapse of the parasitic hierarchy they constructed.',
      },
      {
        label: 'B',
        text: 'A stronger thousand-year Re-set schedule under new Custodian kings.',
        isCorrect: false,
        rationale:
          'Extinction ends their reign; it does not crown new negative Custodian kings.',
      },
      {
        label: 'C',
        text: 'Automatic restoration of Black Void Plasma as pure white light therapy.',
        isCorrect: false,
        rationale:
          'Plasma was a suppression tool; the guarantee named is hierarchy collapse.',
      },
      {
        label: 'D',
        text: 'Return of predatory behavior as the natural state before any rebellion.',
        isCorrect: false,
        rationale:
          'Before the rebellion there was no predatory behavior; collapse ends their constructed evil system.',
      },
    ],
    hint: 'Permanent collapse of the hierarchy they built.',
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
  /* correct letter assigned by finalizeOptions shuffle */

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
    throw new Error(`Q${q.number}: LaTeX-like markup or $ found:\n${blob}`);
  }
  if (hedgeRe.test(blob)) {
    throw new Error(`Q${q.number}: report/topic hedge found:\n${blob}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (options.length < 2) throw new Error(`Q${q.number}: need 2+ options`);
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
if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Custodians — the 12th-density fall, engineered parasites, 4th-density harvest grid, Vatican nexus, pure Custodian allies, and the purge of the negative hierarchy.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'All evil on the physical plain traces to one betrayal: trusted 12th-density caretakers who wanted creation faster than the Council of 12 allowed. They spent millennia plotting in the higher light, then fell into gaunt 4th-density form, manufacturing Anuk, Draco lines, Greys, and more with hive-aligned knock-off souls that cannot reach 5th density. Adrenochrome and Loosh, Vatican tiers, Black Void Plasma, Niberian independence, and a pure Custodian faction with the G.A.A. and White Hats — that is the arc. Negative Custodians are extinct. Sit with what you missed, then return to the Custodians deep-dive, infographics, and video transmissions. Their hierarchy collapses because high-frequency creation cannot be scavenged.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole)) {
  throw new Error('LaTeX or $ remains in quiz payload');
}
if (hedgeRe.test(whole)) {
  throw new Error('Report/topic hedge remains in quiz payload');
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
    'Test your understanding of Custodians — 12th-density fall, engineered parasites, 4th-density harvest grid, Vatican nexus, pure Custodian allies, and negative Custodian extinction.',
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
  throw new Error('custodians not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Custodians: 12th-density fall, engineered parasites, 4th-density harvest grid, Vatican nexus, pure Custodian allies, and negative Custodian extinction.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/custodian.webp'],
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
  const anchors = [
    "  { path: '/quiz/alice/culling-survivors.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/cosmology.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/control-mechanisms.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample correct answers:');
[0, 6, 14, 18, 23].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/custodians.json');
