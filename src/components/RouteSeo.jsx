import { Helmet } from 'react-helmet-async';
import { matchPath, useLocation } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');
const DEFAULT_DESC =
  'Shop spiritual products online at Gawri Ganga. Buy rudraksha, spiritual bracelets India, and pooja items online with clear details and trusted service.';

/** Rich copy for the home page (SEO + social). ~155–165 characters for description snippet. */
const HOME_DESCRIPTION =
  'Spiritual products online from Gawri Ganga. Buy rudraksha, spiritual bracelets India, aura sprays, and pooja items online for mindful daily practice.';

const HOME_KEYWORDS =
  'spiritual products online, buy rudraksha, spiritual bracelets India, pooja items online, rudraksha mala online, Gawri Ganga';

const ROUTE_META = [
  {
    path: '/',
    title: 'Spiritual Products Online India | Gawri Ganga',
    description: HOME_DESCRIPTION,
    keywords: HOME_KEYWORDS,
  },
  { path: '/sprays', title: 'Aura Sprays for Spiritual Use | Gawri Ganga', description: DEFAULT_DESC },
  {
    path: '/sprays/amrat-bindu',
    title: 'Amrat Bindu Aura Spray | Gawri Ganga',
    description: 'Explore Amrat Bindu Lavender Aura Spray for meditation spaces and daily spiritual routines.',
  },
  {
    path: '/sprays/maitri',
    title: 'Maitri Aura Spray | Gawri Ganga',
    description: 'Explore Maitri Aura Spray for a warm, calm atmosphere in daily spiritual and mindful routines.',
  },
  {
    path: '/sprays/chakra-balance',
    title: 'Chakra Balance Aura Spray | Gawri Ganga',
    description: 'Explore Chakra Balance Aura Spray for meditation and mindful daily spiritual practice.',
  },
  {
    path: '/sprays/shuddhi',
    title: 'Shuddhi Aura Spray | Gawri Ganga',
    description: 'Explore Shuddhi Aura Spray for daily spiritual use and room freshness during rituals.',
  },
  { path: '/rudraksha', title: 'Rudraksha Collection | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/tulsimala', title: 'Tulsi Mala | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/rashi', title: 'Shop by Rashi | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/accessories', title: 'Accessories | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/purpose-products', title: 'Spiritual Products Online | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/product/:slug', title: 'Product | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/cart', title: 'Shopping Cart | Gawri Ganga', description: 'Review your cart and proceed to checkout.' },
  { path: '/wishlist', title: 'Wishlist | Gawri Ganga', description: 'Your saved products.' },
  { path: '/profile', title: 'My Profile | Gawri Ganga', description: 'Account and orders.' },
  { path: '/orders/:id', title: 'Order Details | Gawri Ganga', description: 'View your order status and items.' },
  { path: '/about', title: 'About Us | Gawri Ganga', description: 'Learn about Gawri Ganga and our mission.' },
  {
    path: '/blog',
    title: 'Blog | Gawri Ganga — Rudraksha & Spiritual Wellness',
    description:
      'Articles and guides from Gawri Ganga on Rudraksha, spirituality, and wellness. Tips for care, intention, and practice.',
  },
  {
    path: '/blog/:slug',
    title: 'Blog Article | Gawri Ganga',
    description:
      'Read spiritual wellness and Rudraksha guides from Gawri Ganga.',
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

function matchRouteMeta(pathname) {
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
  const meta = matchRouteMeta(pathname);
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
