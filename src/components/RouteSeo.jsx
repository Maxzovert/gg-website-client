import { Helmet } from 'react-helmet-async';
import { matchPath, useLocation } from 'react-router-dom';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');
const DEFAULT_DESC =
  'Shop authentic Rudraksha, malas, sprays, and spiritual accessories at Gawri Ganga. Blessed products, secure checkout, delivery across India.';

const ROUTE_META = [
  { path: '/', title: 'Gawri Ganga — Rudraksha & Spiritual Products', description: DEFAULT_DESC },
  { path: '/sprays', title: 'Spiritual Sprays | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/rudraksha', title: 'Rudraksha Collection | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/tulsimala', title: 'Tulsi Mala | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/rashi', title: 'Shop by Rashi | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/accessories', title: 'Accessories | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/purpose-products', title: 'Shop by Purpose | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/product/:slug', title: 'Product | Gawri Ganga', description: DEFAULT_DESC },
  { path: '/cart', title: 'Shopping Cart | Gawri Ganga', description: 'Review your cart and proceed to checkout.' },
  { path: '/wishlist', title: 'Wishlist | Gawri Ganga', description: 'Your saved products.' },
  { path: '/profile', title: 'My Profile | Gawri Ganga', description: 'Account and orders.' },
  { path: '/orders/:id', title: 'Order Details | Gawri Ganga', description: 'View your order status and items.' },
  { path: '/about', title: 'About Us | Gawri Ganga', description: 'Learn about Gawri Ganga and our mission.' },
  { path: '/contact', title: 'Contact | Gawri Ganga', description: 'Get in touch with Gawri Ganga support.' },
  { path: '/privacy-policy', title: 'Privacy Policy | Gawri Ganga', description: 'How we handle your data.' },
  { path: '/terms-of-service', title: 'Terms of Service | Gawri Ganga', description: 'Terms of using our website.' },
  { path: '/terms-and-conditions', title: 'Terms & Conditions | Gawri Ganga', description: 'Purchase and site terms.' },
  { path: '/shipping-policy', title: 'Shipping Policy | Gawri Ganga', description: 'Delivery timelines and charges.' },
  { path: '/refund-cancellation', title: 'Refund & Cancellation | Gawri Ganga', description: 'Returns and refunds policy.' },
  { path: '/auth', title: 'Sign In | Gawri Ganga', description: 'Log in with phone OTP.' },
  { path: '/order-success', title: 'Order Confirmed | Gawri Ganga', description: 'Thank you for your order.' },
  { path: '/order-failed', title: 'Payment Issue | Gawri Ganga', description: 'We could not complete payment.' },
];

function matchRouteMeta(pathname) {
  const exact = ROUTE_META.find((r) => matchPath({ path: r.path, end: true }, pathname));
  if (exact) return exact;
  return ROUTE_META.find((r) => matchPath({ path: r.path, end: false }, pathname)) || ROUTE_META[0];
}

const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta = matchRouteMeta(pathname);
  const url = `${SITE}${pathname}`;
  const ogImage = `${SITE}/favicon.png`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
    </Helmet>
  );
};

export default RouteSeo;
