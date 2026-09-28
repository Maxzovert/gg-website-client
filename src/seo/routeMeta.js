/**
 * Shared route SEO metadata (client Helmet + Cloudflare Worker HTML injection).
 * Keep free of React so the Worker can import this module.
 */

export const SITE_DEFAULT =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://www.gawriganga.com';

export const DEFAULT_DESC =
  'Shop authentic Rudraksha, japa & meditation malas, aura sprays, Tulsi malas, and spiritual accessories at Gawri Ganga—secure checkout and delivery across India.';

export const HOME_DESCRIPTION =
  'Gawri Ganga: Nepali Rudraksha, japa malas, Tulsi malas, aura sprays & spiritual products online in India. Natural beads, ethical sourcing, guides—meditation, puja & daily practice.';

export const HOME_KEYWORDS =
  'Gawri Ganga, authentic Rudraksha India, Nepali Rudraksha, Rudraksha mala online, spiritual products India, Tulsi mala online, aura spray India, buy rudraksha online India, rudraksha bracelet, japa mala';

export const RUDRAKSHA_PAGE_TITLE =
  'Nepali Rudraksha Mala & Original Beads Online India | Gawri Ganga';

export const RUDRAKSHA_PAGE_DESCRIPTION =
  'Original Nepali Rudraksha—1 Mukhi to 8+ Mukhi, 5 & 7 Mukhi, japa & wrist malas, 108 beads & bracelets. Natural beads, clear prices, India delivery (Delhi, Noida & nationwide).';

export const RUDRAKSHA_PAGE_KEYWORDS =
  'rudraksha, rudraksha mala, original rudraksha mala, 1 mukhi rudraksha benefits, 2 mukhi rudraksha benefits, 3 mukhi rudraksha, 5 mukhi rudraksha price, 7 mukhi rudraksha price, 9 mukhi rudraksh, panchmukhi rudraksha, rudraksha chain, kumbh rashi rudraksha, rudraksha bracelet for men, rudraksha bracelet for women, rudraksha wearing rules for females, रुद्राक्ष का पेड़, rudraksh ka ped';

const TULSI_KEYWORDS =
  'tulsi mala, tulsi mala online India, tulsi japa mala, japa mala, holy basil mala, tulsi kanthi mala, vaishnav mala, prayer beads';

const RASHI_KEYWORDS =
  'rudraksha by rashi, rudraksha for zodiac, astrology consultation, online astrologer consultation, online astrology consultation, 2026 horoscope, 2026 predictions, 2026 predictions astrology';

const ACCESSORIES_KEYWORDS =
  'spiritual accessories India, rudraksha bracelet, pyrite bracelet, tiger eye bracelet, carnelian bracelet, pyrite stone bracelet, raw pyrite bracelet, golden pyrite bracelet, pyrite bracelet for men, money bracelet, money attraction bracelet, money magnet bracelet, money magnet crystal bracelet, dhan yog bracelet, dhanyog bracelet, karungali bracelet, pyrite anklet, pyrite anklet for women, lava stone benefits';

const PURPOSE_KEYWORDS =
  'spiritual products by purpose, meditation essentials, puja items online, spiritual wellness products, money magnet bracelet benefits, pyrite bracelet benefits, karungali mala benefits, karungali malai benefits, 5 mukhi rudraksha side effects';

const SPRAYS_KEYWORDS =
  'aura spray India, spiritual room spray, meditation spray, chakra spray, energy cleansing spray, lavender spiritual spray, sacred space spray';

const BLOG_KEYWORDS =
  'shiv mantra, shiva mantra, shiv mantra in hindi, shiv mantra in sanskrit, shiv mantra in english, shiv mantra lyrics, shiv mantra list, shiva mantras list, lord shiva mantra, lord shiva mantras, lord shiva mantra in english, lord shiva powerful mantra, most powerful mantra of lord shiva, powerful mantra of lord shiva, powerful shiva mantra, mahadev mantra, mahadev mantra in hindi, mahadev mantra in sanskrit, shiv shlok, shiv shlok in hindi, shiv ji mantra, shiv ji ka mantra, shiv ji ke mantra, शिव मंत्र, शिव मंत्र लिस्ट, महादेव मंत्र, सर्व शक्तिशाली शिव मंत्र, who is ashwathama, aswathama god, aswathama mahabharata, divine meaning in hindi, ருத்ராட்சம் அணிந்து அசைவம் சாப்பிடலாமா';

const CORPORATE_BULK_KEYWORDS =
  'corporate bulk rudraksha, wholesale rudraksha India, bulk rudraksha mala, B2B spiritual products, temple rudraksha supply, corporate gifting rudraksha, bulk tulsi mala India, wellness studio wholesale, bulk order spiritual gifts, Gawri Ganga wholesale';

export const PRODUCT_META_OVERRIDES = {
  '1-mukhi-rudraksha': {
    title: '1 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '1 mukhi rudraksha benefits, 1 mukhi rudraksha price, original rudraksha mala',
  },
  '2-mukhi-rudraksha': {
    title: '2 Mukhi Rudraksha | Authentic Bead Online India | Gawri Ganga',
    keywords: '2 mukhi rudraksha benefits, 2 mukhi rudraksha, rudraksha mala',
  },
  '3-mukhi-rudraksha': {
    title: '3 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '3 mukhi rudraksha, original rudraksha mala, rudraksha',
  },
  '5-mukhi-rudraksha': {
    title: '5 Mukhi Rudraksha | Price & Benefits | Gawri Ganga',
    keywords: '5 mukhi rudraksha price, panchmukhi rudraksha, 5 mukhi rudraksha side effects',
  },
  '7-mukhi-rudraksha': {
    title: '7 Mukhi Rudraksha | Price & Uses Online India | Gawri Ganga',
    keywords: '7 mukhi rudraksha price, 7 mukhi rudraksha, rudraksha mala',
  },
  '9-mukhi-rudraksha': {
    title: '9 Mukhi Rudraksha | Original Bead Online India | Gawri Ganga',
    keywords: '9 mukhi rudraksh, 9 mukhi rudraksha, rudraksha',
  },
  'karungli-mala': {
    title: 'Karungali Mala | Original Karungali Malai Online | Gawri Ganga',
    keywords:
      'karungali mala, karungali malai, karungali mala original, original karungali mala, karungali malai original, karungali mala original price, original karungali malai, original karungali malai price, karungali malai price, karungali mala silver, karungali mala benefits, karungali malai benefits, karingali mala, karikali mala, கருங்காலி மாலை, ebony wood mala, kalinga mala',
  },
  'rudraksha-mala': {
    title: 'Rudraksha Mala | Original Japa Mala Online | Gawri Ganga',
    keywords: 'rudraksha mala, original rudraksha mala, japa mala, rudraksha mala for men',
  },
  'sacred-rudraksha-japa-mala': {
    title: 'Sacred Rudraksha Japa Mala | 108 Beads | Gawri Ganga',
    keywords: 'japa mala, rudraksha mala, original rudraksha mala, rudraksha chain',
  },
  'shiva-bracelet': {
    title: 'Shiva Bracelet | Rudraksha & Healing Bracelet | Gawri Ganga',
    keywords:
      'rudraksha bracelet, rudraksha bracelet for men, rudraksha bracelet for women, pyrite bracelet, pyrite bracelet for men, tiger eye bracelet, carnelian bracelet, money bracelet, money attraction bracelet, money magnet bracelet, money magnet crystal bracelet, money magnet bracelet benefits, dhan yog bracelet, dhanyog bracelet, pyrite stone bracelet, raw pyrite bracelet, golden pyrite bracelet, pyrite bracelet benefits',
  },
  'original-thick-tulsi-kanthi-mala': {
    title: 'Original Thick Tulsi Kanthi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi mala online India, tulsi japa mala, japa mala',
  },
  'original-tulsi-kanthi-mala': {
    title: 'Original Tulsi Kanthi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi mala online India, tulsi japa mala',
  },
  'sacred-radhe-engraved-tulsi-mala': {
    title: 'Sacred Radhe Engraved Tulsi Mala | Gawri Ganga',
    keywords: 'tulsi mala, tulsi japa mala, devotional tulsi mala',
  },
  'shri-radha-tulsi-mala-pendant': {
    title: 'Shri Radha Tulsi Mala Pendant | Gawri Ganga',
    keywords: 'tulsi mala pendant, tulsi mala, devotional necklace',
  },
  'sitaram-hanumanji-tulsi-necklace': {
    title: 'Sitaram Hanumanji Tulsi Necklace | Gawri Ganga',
    keywords: 'tulsi necklace, tulsi mala, spiritual necklace',
  },
  'tulsi-bead-mala': {
    title: 'Tulsi Bead Mala | Japa Mala Online India | Gawri Ganga',
    keywords: 'tulsi bead mala, tulsi mala, japa mala, tulsi japa mala',
  },
};

/** Exact public paths that exist as SPA routes (no params). */
export const KNOWN_STATIC_PATHS = [
  '/',
  '/sprays',
  '/sprays/amrat-bindu',
  '/sprays/maitri',
  '/sprays/chakra-balance',
  '/sprays/shuddhi',
  '/rudraksha',
  '/tulsimala',
  '/rashi',
  '/accessories',
  '/purpose-products',
  '/combos',
  '/products',
  '/cart',
  '/wishlist',
  '/profile',
  '/order-success',
  '/order-failed',
  '/about',
  '/blog',
  '/blogs',
  '/contact',
  '/corporate-bulk-orders',
  '/terms-of-service',
  '/refund-cancellation',
  '/return-policy',
  '/terms-and-conditions',
  '/shipping-policy',
  '/privacy-policy',
  '/login',
];

/** HTTP 301 path redirects (typos + legacy). */
export const PATH_REDIRECTS = {
  '/karungli': '/product/karungli-mala',
  '/karungli-mala': '/product/karungli-mala',
  '/karungali': '/product/karungli-mala',
  '/karungali-mala': '/product/karungli-mala',
  '/rudaksha': '/rudraksha',
  '/rudraksh': '/rudraksha',
  '/sprays/amrat-dhara': '/sprays/amrat-bindu',
  '/signup': '/login',
  '/auth': '/login',
};

export const ROUTE_META = [
  {
    path: '/',
    title: 'Gawri Ganga | Authentic Rudraksha & Spiritual Wellness Online India',
    description: HOME_DESCRIPTION,
    keywords: HOME_KEYWORDS,
  },
  {
    path: '/sprays',
    title: 'Aura & Spiritual Sprays Online India | Gawri Ganga',
    description:
      'Aura and spiritual sprays for meditation, calm, and sacred space. Shop Amrat Bindu, Maitri, Chakra Balance & Shuddhi at Gawri Ganga—delivery across India.',
    keywords: SPRAYS_KEYWORDS,
  },
  {
    path: '/sprays/amrat-bindu',
    title: 'Amrat Bindu Aura Spray | Gawri Ganga',
    description: 'Discover Amrat Bindu Lavender Aura Spray for calmness, relaxation, and a peaceful spiritual atmosphere.',
  },
  {
    path: '/sprays/maitri',
    title: 'Maitri Aura Spray | Gawri Ganga',
    description: 'Explore Maitri Aura Spray for emotional warmth, balance, and a soothing spiritual ambience.',
  },
  {
    path: '/sprays/chakra-balance',
    title: 'Chakra Balance Aura Spray | Gawri Ganga',
    description: 'Explore Chakra Balance Aura Spray for energy alignment, positivity, and spiritual harmony.',
  },
  {
    path: '/sprays/shuddhi',
    title: 'Shuddhi Aura Spray | Gawri Ganga',
    description: 'Explore Shuddhi Aura Spray for purification, freshness, and spiritual clarity.',
  },
  {
    path: '/rudraksha',
    title: RUDRAKSHA_PAGE_TITLE,
    description: RUDRAKSHA_PAGE_DESCRIPTION,
    keywords: RUDRAKSHA_PAGE_KEYWORDS,
  },
  {
    path: '/tulsimala',
    title: 'Tulsi Mala & Japa Mala Online India | Gawri Ganga',
    description:
      'Authentic Tulsi (holy basil) malas and japa malas for naam jaap and meditation. Clear details, secure checkout—Gawri Ganga, India-wide delivery.',
    keywords: TULSI_KEYWORDS,
  },
  {
    path: '/rashi',
    title: 'Rudraksha by Rashi & Zodiac | Shop Online India | Gawri Ganga',
    description:
      'Find rudraksha aligned with your rashi and spiritual goals—curated picks, trusted quality, and delivery across India from Gawri Ganga.',
    keywords: RASHI_KEYWORDS,
  },
  {
    path: '/accessories',
    title: 'Spiritual Accessories & Mala Supplies | Gawri Ganga',
    description:
      'Spiritual accessories, bracelets, and companion pieces for your practice—pair with Rudraksha and malas. Shop Gawri Ganga with India delivery.',
    keywords: ACCESSORIES_KEYWORDS,
  },
  {
    path: '/purpose-products',
    title: 'Spiritual Products by Purpose | Meditation & Puja | Gawri Ganga',
    description:
      'Browse spiritual products by intention—meditation, daily practice, and puja. Ethical sourcing and clear product stories at Gawri Ganga.',
    keywords: PURPOSE_KEYWORDS,
  },
  {
    path: '/combos',
    title: 'Spiritual Product Combos | Gawri Ganga',
    description: 'Curated Rudraksha and spiritual product combos from Gawri Ganga—delivery across India.',
  },
  {
    path: '/products',
    title: 'All Products | Rudraksha, Malas & Spiritual Items | Gawri Ganga',
    description:
      'Browse the full Gawri Ganga catalogue—Nepali Rudraksha, Tulsi malas, aura sprays, accessories, and combos.',
  },
  { path: '/cart', title: 'Shopping Cart | Gawri Ganga', description: 'Review your cart and proceed to checkout.' },
  { path: '/wishlist', title: 'Wishlist | Gawri Ganga', description: 'Your saved products.' },
  { path: '/profile', title: 'My Profile | Gawri Ganga', description: 'Account and orders.' },
  { path: '/about', title: 'About Us | Gawri Ganga', description: 'Learn about Gawri Ganga and our mission.' },
  {
    path: '/blog',
    title: 'Blog | Rudraksha Care, Japa & Spiritual Wellness | Gawri Ganga',
    description:
      'Guides on Nepali Rudraksha, mukhi meanings, japa malas, meditation, and daily spiritual practice—from Gawri Ganga, India.',
    keywords: BLOG_KEYWORDS,
  },
  {
    path: '/blogs',
    title: 'Blog | Rudraksha Care, Japa & Spiritual Wellness | Gawri Ganga',
    description:
      'Guides on Nepali Rudraksha, mukhi meanings, japa malas, meditation, and daily spiritual practice—from Gawri Ganga, India.',
    keywords: BLOG_KEYWORDS,
  },
  { path: '/contact', title: 'Contact | Gawri Ganga', description: 'Get in touch with Gawri Ganga support.' },
  {
    path: '/corporate-bulk-orders',
    title: 'Corporate & Bulk Orders | Wholesale Rudraksha & Malas | Gawri Ganga',
    description:
      'Request volume pricing for authentic Nepali Rudraksha, Tulsi malas, aura sprays, and spiritual accessories—corporate gifting, temples, retailers, and institutions across India.',
    keywords: CORPORATE_BULK_KEYWORDS,
  },
  { path: '/privacy-policy', title: 'Privacy Policy | Gawri Ganga', description: 'How we handle your data.' },
  { path: '/terms-of-service', title: 'Terms of Service | Gawri Ganga', description: 'Terms of using our website.' },
  { path: '/terms-and-conditions', title: 'Terms & Conditions | Gawri Ganga', description: 'Purchase and site terms.' },
  { path: '/shipping-policy', title: 'Shipping Policy | Gawri Ganga', description: 'Delivery timelines and charges.' },
  { path: '/refund-cancellation', title: 'Refund & Cancellation | Gawri Ganga', description: 'Returns and refunds policy.' },
  { path: '/return-policy', title: 'Return Policy | Gawri Ganga', description: 'Returns and exchanges.' },
  { path: '/login', title: 'Sign In | Gawri Ganga', description: 'Sign in with your mobile number and OTP.' },
  { path: '/order-success', title: 'Order Confirmed | Gawri Ganga', description: 'Thank you for your order.' },
  { path: '/order-failed', title: 'Payment Issue | Gawri Ganga', description: 'We could not complete payment.' },
];

export function slugToReadableName(slug = '') {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizePathname(pathname = '/') {
  if (!pathname || pathname === '/') return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function pathMatches(pattern, pathname) {
  if (pattern === pathname) return true;
  if (!pattern.includes(':')) return false;
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return false;
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) continue;
    if (patternParts[i] !== pathParts[i]) return false;
  }
  return true;
}

/**
 * @returns {{ title: string, description: string, keywords?: string } | null}
 */
export function matchStaticRouteMeta(pathname, searchParams) {
  const path = normalizePathname(pathname);

  if (path === '/rudraksha' && searchParams) {
    const subRaw = searchParams.get?.('subcategory') ?? searchParams.get?.('mukhi');
    if (subRaw && String(subRaw).trim()) {
      let sub = String(subRaw).trim();
      try {
        sub = decodeURIComponent(sub);
      } catch {
        /* keep raw */
      }
      return {
        title: `${sub} Nepali Rudraksha | Mala & Beads Online India | Gawri Ganga`,
        description: `Shop authentic ${sub} Nepali Rudraksha—beads, japa & wrist malas (108-bead), bracelets. Natural Nepal rudraksha, clear pricing, rashi-friendly picks, delivery across India including Delhi & Noida.`,
        keywords: RUDRAKSHA_PAGE_KEYWORDS,
      };
    }
  }

  const exact = ROUTE_META.find((r) => pathMatches(r.path, path));
  return exact
    ? { title: exact.title, description: exact.description, keywords: exact.keywords }
    : null;
}

export function productMetaFromSlug(slug, product) {
  const override = PRODUCT_META_OVERRIDES[slug];
  const name = product?.name || slugToReadableName(slug);
  const title =
    (product?.meta_title && String(product.meta_title).trim()) ||
    override?.title ||
    `${name} | Buy Online India | Gawri Ganga`;
  const description =
    (product?.meta_description && String(product.meta_description).trim()) ||
    (product?.short_description && String(product.short_description).trim()) ||
    (product?.description
      ? String(product.description).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
      : '') ||
    DEFAULT_DESC;
  const keywords =
    override?.keywords || `${String(name).toLowerCase()}, spiritual products India, Gawri Ganga`;
  const image =
    (Array.isArray(product?.images) && product.images[0]) ||
    product?.image ||
    null;
  return { title, description, keywords, image, name };
}

export function blogMetaFromPost(post) {
  const title = post?.title
    ? `${post.title} | Gawri Ganga Blog`
    : 'Blog Article | Gawri Ganga';
  const description =
    (post?.excerpt && String(post.excerpt).trim()) ||
    'Spiritual wellness and Rudraksha guides—care, japa, and mindful practice from Gawri Ganga.';
  const image = post?.hero_image_url || post?.header_image_url || null;
  return { title, description, keywords: BLOG_KEYWORDS, image };
}

export function isKnownStaticPath(pathname) {
  return KNOWN_STATIC_PATHS.includes(normalizePathname(pathname));
}
