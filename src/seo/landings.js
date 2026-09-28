/**
 * Phase 3 landing pages: mukhi (14), rashi (12), purpose (5), guides (3).
 * Plain data so the Worker and the React app share the same titles and paths.
 */

const MUKHI = [
  { n: 1, deity: 'Shiva', planet: 'Sun', suits: 'seekers looking for focus on the self and a single-bead practice' },
  { n: 2, deity: 'Ardhanarishvara', planet: 'Moon', suits: 'people working on balance in relationships' },
  { n: 3, deity: 'Agni', planet: 'Mars', suits: 'those who want clarity and a cleaner daily routine' },
  { n: 4, deity: 'Brahma', planet: 'Mercury', suits: 'students and anyone building a learning habit' },
  { n: 5, deity: 'Kalagni Rudra', planet: 'Jupiter', suits: 'everyday wear and first-time buyers' },
  { n: 6, deity: 'Kartikeya', planet: 'Venus', suits: 'people who want steadiness in speech and will' },
  { n: 7, deity: 'Mahalakshmi', planet: 'Saturn', suits: 'those drawn to discipline and household wellbeing' },
  { n: 8, deity: 'Ganesha', planet: 'Rahu', suits: 'anyone starting a new effort and wanting fewer obstacles' },
  { n: 9, deity: 'Durga', planet: 'Ketu', suits: 'people looking for courage in a demanding season' },
  { n: 10, deity: 'Vishnu', planet: 'none in particular', suits: 'those who want a calmer, protective daily bead' },
  { n: 11, deity: 'Hanuman', planet: 'none in particular', suits: 'people who want strength and a simple protection practice' },
  { n: 12, deity: 'Surya', planet: 'Sun', suits: 'leaders and anyone building confidence in public life' },
  { n: 13, deity: 'Kamadeva', planet: 'Venus', suits: 'those working on attraction, charm, and creative work' },
  { n: 14, deity: 'Shiva', planet: 'Saturn', suits: 'advanced seekers who already have a daily practice' },
];

export const RASHI_MUKHI = {
  aries: ['1 Mukhi', '3 Mukhi', '11 Mukhi'],
  taurus: ['2 Mukhi', '6 Mukhi', '14 Mukhi'],
  gemini: ['3 Mukhi', '5 Mukhi', '12 Mukhi'],
  cancer: ['2 Mukhi', '4 Mukhi', '7 Mukhi'],
  leo: ['1 Mukhi', '5 Mukhi', '9 Mukhi'],
  virgo: ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
  libra: ['2 Mukhi', '7 Mukhi', '11 Mukhi'],
  scorpio: ['3 Mukhi', '8 Mukhi', '13 Mukhi'],
  sagittarius: ['4 Mukhi', '9 Mukhi', '12 Mukhi'],
  capricorn: ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
  aquarius: ['5 Mukhi', '11 Mukhi', '13 Mukhi'],
  pisces: ['4 Mukhi', '7 Mukhi', '12 Mukhi'],
};

const RASHI = [
  { slug: 'aries', name: 'Aries', hindi: 'Mesh', planet: 'Mars' },
  { slug: 'taurus', name: 'Taurus', hindi: 'Vrishabh', planet: 'Venus' },
  { slug: 'gemini', name: 'Gemini', hindi: 'Mithun', planet: 'Mercury' },
  { slug: 'cancer', name: 'Cancer', hindi: 'Karka', planet: 'Moon' },
  { slug: 'leo', name: 'Leo', hindi: 'Simha', planet: 'Sun' },
  { slug: 'virgo', name: 'Virgo', hindi: 'Kanya', planet: 'Mercury' },
  { slug: 'libra', name: 'Libra', hindi: 'Tula', planet: 'Venus' },
  { slug: 'scorpio', name: 'Scorpio', hindi: 'Vrishchik', planet: 'Mars' },
  { slug: 'sagittarius', name: 'Sagittarius', hindi: 'Dhanu', planet: 'Jupiter' },
  { slug: 'capricorn', name: 'Capricorn', hindi: 'Makar', planet: 'Saturn' },
  { slug: 'aquarius', name: 'Aquarius', hindi: 'Kumbh', planet: 'Saturn' },
  { slug: 'pisces', name: 'Pisces', hindi: 'Meen', planet: 'Jupiter' },
];

const PURPOSES = [
  {
    slug: 'protection',
    title: 'Rudraksha for Protection',
    query: 'Protection',
    lead: 'Beads and malas traditionally chosen when the intention is protection in daily life — travel, home, and personal practice.',
  },
  {
    slug: 'focus',
    title: 'Rudraksha for Concentration',
    query: 'Focus',
    lead: 'A shorter catalogue for study, japa, and work that needs a steady mind. Start with 4 Mukhi and 5 Mukhi if you are choosing a first bead.',
  },
  {
    slug: 'wealth',
    title: 'Rudraksha for Wealth',
    query: 'Wealth',
    lead: 'Pieces associated with household wellbeing and livelihood. These are spiritual aids, not a promise of money.',
  },
  {
    slug: 'health',
    title: 'Rudraksha for Health',
    query: 'Health',
    lead: 'Beads people keep close during recovery and daily care. They do not replace medical treatment.',
  },
  {
    slug: 'peace',
    title: 'Rudraksha for Peace',
    query: 'Peace',
    lead: 'Calmer malas and sprays for meditation rooms, evening japa, and a quieter home.',
  },
];

const GUIDES = [
  {
    slug: 'how-to-identify-real-rudraksha',
    title: 'How to Identify a Real Rudraksha',
    description:
      'What to check on a Nepali Rudraksha before you buy: mukhi lines, natural holes, weight, and seller proof from Gawri Ganga.',
    sections: [
      {
        h: 'Count the mukhi lines',
        p: 'A mukhi is a natural facet running from top to bottom. Lines should be deep and continuous, not painted grooves. 5 Mukhi is the most common; very cheap “rare” mukhi beads deserve extra scrutiny.',
      },
      {
        h: 'Look at the hole and the surface',
        p: 'A natural bead has an organic hole and a slightly uneven surface. A perfectly glassy, identical set of faces is a common sign of a shaped or composite piece.',
      },
      {
        h: 'Ask for the sourcing story',
        p: 'Gawri Ganga lists origin, mukhi, and size on each product. If a listing has no measurements and no return policy, treat that as a warning, not a bargain.',
      },
    ],
  },
  {
    slug: 'which-rudraksha-should-i-wear',
    title: 'Which Rudraksha Should I Wear?',
    description:
      'A simple way to choose a first Rudraksha: 5 Mukhi for everyday wear, then rashi and purpose if you want a closer match.',
    sections: [
      {
        h: 'Start with 5 Mukhi',
        p: 'Most first-time buyers in India do well with a 5 Mukhi Nepali bead or a 5 Mukhi mala. It is widely available, easier to authenticate, and suited to daily japa.',
      },
      {
        h: 'Then match rashi or purpose',
        p: 'If you already know your rashi, use the rashi pages to see the mukhi counts we suggest. If you are shopping by intention, use the purpose pages for protection, focus, wealth, health, or peace.',
      },
      {
        h: 'Size and how you will wear it',
        p: 'A loose bead is easy to keep on a thread. A mala is better if you already chant. Check the millimetre size on the product page before you order.',
      },
    ],
  },
  {
    slug: 'how-to-wear-and-care-for-rudraksha',
    title: 'How to Wear and Care for Rudraksha',
    description:
      'How to wear Rudraksha, when to remove it, and how to clean a natural bead so it lasts.',
    sections: [
      {
        h: 'Wear it clean and dry',
        p: 'Put it on after a bath, with a short prayer if that is part of your practice. Remove it before swimming, oil massages, and chemical cleaners.',
      },
      {
        h: 'Clean it gently',
        p: 'Rinse with clean water, dry in shade, and oil very lightly only if the bead looks dry. Do not soak it. A little darkening from skin oils is normal.',
      },
      {
        h: 'If it cracks',
        p: 'Natural beads can crack if they dry out. Stop wearing a split bead and contact Gawri Ganga support if it arrived damaged.',
      },
    ],
  },
];

function pageBase(path, title, description, keywords, kind, extra = {}) {
  return {
    path,
    title,
    description,
    keywords,
    kind,
    crumbs: extra.crumbs || [],
    ...extra,
  };
}

const mukhiPages = MUKHI.map((m) =>
  pageBase(
    `/mukhi/${m.n}-mukhi-rudraksha`,
    `${m.n} Mukhi Rudraksha Benefits, Price & Who It Suits | Gawri Ganga`,
    `${m.n} Mukhi Nepali Rudraksha — traditionally linked with ${m.deity}. See who it suits, related beads, and current Gawri Ganga products.`,
    `${m.n} mukhi rudraksha benefits, ${m.n} mukhi rudraksha price, ${m.n} mukhi rudraksha`,
    'mukhi',
    {
      crumbs: [
        { name: 'Home', url: '/' },
        { name: 'Rudraksha', url: '/rudraksha' },
        { name: `${m.n} Mukhi`, url: `/mukhi/${m.n}-mukhi-rudraksha` },
      ],
      mukhi: m.n,
      deity: m.deity,
      planet: m.planet,
      suits: m.suits,
      h1: `${m.n} Mukhi Rudraksha`,
      lead: `A ${m.n} Mukhi Rudraksha is traditionally linked with ${m.deity}${m.planet && m.planet !== 'none in particular' ? ` and ${m.planet}` : ''}. It suits ${m.suits}.`,
    },
  ),
);

const rashiPages = RASHI.map((r) => {
  const mukhis = RASHI_MUKHI[r.slug];
  return pageBase(
    `/rashi/${r.slug}`,
    `Rudraksha for ${r.name} Rashi (${r.hindi}) | Gawri Ganga`,
    `Rudraksha for ${r.name} (${r.hindi}) rashi: ${mukhis.join(', ')}. Ruling planet ${r.planet}. Shop matching Nepali beads at Gawri Ganga.`,
    `rudraksha for ${r.hindi.toLowerCase()} rashi, rudraksha for ${r.name.toLowerCase()}, rudraksha by rashi`,
    'rashi',
    {
      crumbs: [
        { name: 'Home', url: '/' },
        { name: 'Rashi', url: '/rashi' },
        { name: r.name, url: `/rashi/${r.slug}` },
      ],
      h1: `Rudraksha for ${r.name} (${r.hindi})`,
      lead: `${r.name} is ruled by ${r.planet}. For this rashi we suggest ${mukhis.join(', ')} Nepali Rudraksha, based on the same map used on our rashi shop.`,
      mukhis,
      planet: r.planet,
    },
  );
});

const purposePages = PURPOSES.map((p) =>
  pageBase(
    `/purpose/${p.slug}`,
    `${p.title} | Gawri Ganga`,
    p.lead,
    `rudraksha for ${p.slug}, ${p.title.toLowerCase()}`,
    'purpose',
    {
      crumbs: [
        { name: 'Home', url: '/' },
        { name: 'Purpose', url: '/purpose-products' },
        { name: p.title, url: `/purpose/${p.slug}` },
      ],
      h1: p.title,
      lead: p.lead,
      purposeQuery: p.query,
    },
  ),
);

const guidePages = GUIDES.map((g) =>
  pageBase(
    `/guides/${g.slug}`,
    `${g.title} | Gawri Ganga`,
    g.description,
    `${g.title.toLowerCase()}, rudraksha guide, gawri ganga`,
    'guide',
    {
      crumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: g.title, url: `/guides/${g.slug}` },
      ],
      h1: g.title,
      lead: g.description,
      sections: g.sections,
    },
  ),
);

export const LANDING_PAGES = [...mukhiPages, ...rashiPages, ...purposePages, ...guidePages];

const BY_PATH = new Map(LANDING_PAGES.map((p) => [p.path, p]));

const LANDING_PREFIXES = ['/mukhi/', '/rashi/', '/purpose/', '/guides/'];

/** @returns {object|null|undefined} page, null if prefix but unknown slug, undefined if not a landing URL */
export function resolveLanding(pathname) {
  const path = pathname && pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname || '/';
  if (!LANDING_PREFIXES.some((prefix) => path.startsWith(prefix))) return undefined;
  return BY_PATH.get(path) || null;
}

export function landingSitemapPaths() {
  return LANDING_PAGES.map((p) => p.path);
}

export const CATEGORY_INTROS = {
  rudraksha: {
    h1: 'Nepali Rudraksha mala and beads',
    p: '1 Mukhi through 14 Mukhi Nepali Rudraksha, japa malas, and bracelets. Open a mukhi page for benefits and who it suits.',
  },
};
