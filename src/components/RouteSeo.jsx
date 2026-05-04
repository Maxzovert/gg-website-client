import { Helmet } from 'react-helmet-async';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');
const DEFAULT_DESC =
  'Shop authentic Rudraksha, japa & meditation malas, aura sprays, Tulsi malas, and spiritual accessories at Gawri Ganga—secure checkout and delivery across India.';

/** Rich copy for the home page (SEO + social). ~155–165 characters for description snippet. */
const HOME_DESCRIPTION =
  'Gawri Ganga: Nepali Rudraksha, japa malas, Tulsi malas, aura sprays & spiritual products online in India. Natural beads, ethical sourcing, guides—meditation, puja & daily practice.';

/** Long-tail + adjacent intent (meta keywords; align with on-page copy). */
const HOME_KEYWORDS =
  'Gawri Ganga, Gawri Ganga Rudraksha, authentic Rudraksha India, Rudraksha mala online, spiritual products India, aura spray, Rudraksha shop, spiritual wellness, Nepali Rudraksha, original Nepali Rudraksha in India, Rudraksha price, best website to buy rudraksha, Nepali Rudraksha Delhi, Nepali Rudraksha Noida, buy rudraksha online India, natural rudraksha beads, genuine rudraksha, rudraksha japa mala, meditation mala 108 beads, rudraksha for meditation, spiritual beads India, puja items online, rudraksha by rashi, Lord Shiva rudraksha';

/** Dedicated /rudraksha collection — core long-tails + related searches (mukhi, japa, authenticity, astrology). */
const RUDRAKSHA_PAGE_TITLE =
  'Nepali Rudraksha Mala & Original Beads Online India | Gawri Ganga';

const RUDRAKSHA_PAGE_DESCRIPTION =
  'Original Nepali Rudraksha—1 Mukhi to 8+ Mukhi, 5 & 7 Mukhi, japa & wrist malas, 108 beads & bracelets. Natural beads, clear prices, India delivery (Delhi, Noida & nationwide).';

const RUDRAKSHA_PAGE_KEYWORDS =
  'Rudraksha mala, 1 Mukhi original Nepali, Rudraksha price, Nepali Rudraksha benefits, Rudraksha 5 Mukhi, Original Nepali Rudraksha price in India, best website to buy rudraksha, Nepal Rudraksha price list, rudraksha 7 mukhi, nepali rudraksha bracelet, nepali rudraksha mala 108 beads, nepali rudraksha 7 mukhi, Nepali Rudraksha Delhi, Nepali Rudraksha Noida, nepali rudraksha 8 mukhi, nepali rudraksha, nepali rudraksha mala, nepali rudraksha price, nepali rudraksha 5 mukhi, buy rudraksha online India, natural rudraksha beads, genuine rudraksha, original rudraksha beads, Lord Shiva rudraksha, ek mukhi rudraksha, panch mukhi rudraksha, rudraksha japa mala, rudraksha for meditation, wrist rudraksha mala, meditation mala rudraksha, rudraksha by rashi, rudraksha astrology, gauri shankar rudraksha, Nepali vs Indonesian rudraksha, sacred rudraksha beads, spiritual rudraksha shop, authentic rudraksha online, mukhi meaning rudraksha';

const TULSI_KEYWORDS =
  'Tulsi mala online India, Tulsi japa mala, holy basil mala, meditation mala, prayer beads, Vaishnav mala, spiritual mala, buy Tulsi mala online, 108 beads Tulsi mala';

const RASHI_KEYWORDS =
  'Rudraksha by rashi, rudraksha for zodiac, rashiya rudraksha, astrology rudraksha, planetary rudraksha, birth sign rudraksha, shop rudraksha by rashi India, zodiac spiritual beads';

const ACCESSORIES_KEYWORDS =
  'spiritual accessories India, rudraksha bracelet, meditation accessories, pooja accessories online, spiritual jewelry India, japa mala accessories';

const PURPOSE_KEYWORDS =
  'spiritual products by purpose, meditation essentials, mindfulness products India, puja items online, spiritual wellness products, intention-based rudraksha';

const SPRAYS_KEYWORDS =
  'aura spray India, spiritual room spray, meditation spray, chakra spray, energy cleansing spray, lavender spiritual spray, sacred space spray';

const ROUTE_META = [
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
  { path: '/product/:slug', title: 'Product | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/cart', title: 'Shopping Cart | Gawri Ganga', description: 'Review your cart and proceed to checkout.' },
  { path: '/wishlist', title: 'Wishlist | Gawri Ganga', description: 'Your saved products.' },
  { path: '/profile', title: 'My Profile | Gawri Ganga', description: 'Account and orders.' },
  { path: '/orders/:id', title: 'Order Details | Gawri Ganga', description: 'View your order status and items.' },
  { path: '/about', title: 'About Us | Gawri Ganga', description: 'Learn about Gawri Ganga and our mission.' },
  {
    path: '/blog',
    title: 'Blog | Rudraksha Care, Japa & Spiritual Wellness | Gawri Ganga',
    description:
      'Guides on Nepali Rudraksha, mukhi meanings, japa malas, meditation, and daily spiritual practice—from Gawri Ganga, India.',
    keywords:
      'rudraksha care guide, how to wear rudraksha, japa mala guide, meditation tips, spiritual wellness blog India, nepali rudraksha articles',
  },
  {
    path: '/blog/:slug',
    title: 'Blog Article | Gawri Ganga',
    description:
      'Spiritual wellness and Rudraksha guides—care, japa, and mindful practice from Gawri Ganga.',
    keywords:
      'rudraksha guide, spiritual article, japa meditation, Gawri Ganga blog',
  },
  { path: '/contact', title: 'Contact | Gawri Ganga', description: 'Get in touch with Gawri Ganga support.' },
  { path: '/privacy-policy', title: 'Privacy Policy | Gawri Ganga', description: 'How we handle your data.' },
  { path: '/terms-of-service', title: 'Terms of Service | Gawri Ganga', description: 'Terms of using our website.' },
  { path: '/terms-and-conditions', title: 'Terms & Conditions | Gawri Ganga', description: 'Purchase and site terms.' },
  { path: '/shipping-policy', title: 'Shipping Policy | Gawri Ganga', description: 'Delivery timelines and charges.' },
  { path: '/refund-cancellation', title: 'Refund & Cancellation | Gawri Ganga', description: 'Returns and refunds policy.' },
  { path: '/login', title: 'Sign In | Gawri Ganga', description: 'Sign in with your mobile number and OTP.' },
  {
    path: '/signup',
    title: 'Create account | Gawri Ganga',
    description: 'Create your Gawri Ganga account with your mobile number and OTP.',
  },
  { path: '/order-success', title: 'Order Confirmed | Gawri Ganga', description: 'Thank you for your order.' },
  { path: '/order-failed', title: 'Payment Issue | Gawri Ganga', description: 'We could not complete payment.' },
];

function decodeSubcategoryParam(raw) {
  if (raw == null || !String(raw).trim()) return null;
  try {
    return decodeURIComponent(String(raw).trim());
  } catch {
    return String(raw).trim();
  }
}

function matchRouteMeta(pathname, searchParams) {
  if (matchPath({ path: '/rudraksha', end: true }, pathname)) {
    const subRaw = searchParams?.get('subcategory') ?? searchParams?.get('mukhi');
    const sub = decodeSubcategoryParam(subRaw);
    if (sub) {
      return {
        path: '/rudraksha',
        title: `${sub} Nepali Rudraksha | Mala & Beads Online India | Gawri Ganga`,
        description: `Shop authentic ${sub} Nepali Rudraksha—beads, japa & wrist malas (108-bead), bracelets. Natural Nepal rudraksha, clear pricing, rashi-friendly picks, delivery across India including Delhi & Noida.`,
        keywords: RUDRAKSHA_PAGE_KEYWORDS,
      };
    }
  }

  const exact = ROUTE_META.find((r) => matchPath({ path: r.path, end: true }, pathname));
  if (exact) return exact;
  return ROUTE_META.find((r) => matchPath({ path: r.path, end: false }, pathname)) || ROUTE_META[0];
}

function organizationJsonLd(siteUrl, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gawri Ganga',
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    description,
  };
}

const RouteSeo = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const meta = matchRouteMeta(pathname, searchParams);
  const url = `${SITE}${pathname}`;
  const ogImage = `${SITE}/favicon.png`;
  const isHome = pathname === '/';
  const orgLd = isHome ? organizationJsonLd(SITE, HOME_DESCRIPTION) : null;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Gawri Ganga" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {orgLd ? (
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
      ) : null}
    </Helmet>
  );
};

export default RouteSeo;
