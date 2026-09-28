import { Helmet } from 'react-helmet-async';
import { matchPath, useLocation, useSearchParams } from 'react-router-dom';
import {
  DEFAULT_DESC,
  HOME_DESCRIPTION,
  PRODUCT_META_OVERRIDES,
  matchStaticRouteMeta,
  productMetaFromSlug,
  slugToReadableName,
} from '../seo/routeMeta.js';
import { resolveLanding } from '../seo/landings.js';
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  categoryBreadcrumbItems,
} from '../seo/jsonLd.js';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');
const OG_LOCALE = 'en_IN';
const OG_IMAGE_PATH = import.meta.env.VITE_OG_IMAGE_PATH || '/favicon.png';

function matchRouteMeta(pathname, searchParams) {
  const landing = resolveLanding(pathname);
  if (landing) {
    return {
      title: landing.title,
      description: landing.description,
      keywords: landing.keywords,
    };
  }

  const productMatch = matchPath({ path: '/product/:slug', end: true }, pathname);
  if (productMatch?.params?.slug) {
    const slug = productMatch.params.slug;
    return productMetaFromSlug(slug, null);
  }

  const blogMatch =
    matchPath({ path: '/blog/:slug', end: true }, pathname) ||
    matchPath({ path: '/blogs/:slug', end: true }, pathname);
  if (blogMatch?.params?.slug) {
    const readable = slugToReadableName(blogMatch.params.slug);
    return {
      title: `${readable} | Gawri Ganga Blog`,
      description:
        'Spiritual wellness and Rudraksha guides—care, japa, and mindful practice from Gawri Ganga.',
    };
  }

  const staticMeta = matchStaticRouteMeta(pathname, searchParams);
  if (staticMeta) return staticMeta;

  return {
    title: 'Page Not Found | Gawri Ganga',
    description: 'The page you requested does not exist on Gawri Ganga.',
  };
}

const RouteSeo = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const meta = matchRouteMeta(pathname, searchParams);
  const url = `${SITE}${pathname}`;
  const ogImage =
    meta.image ||
    import.meta.env.VITE_OG_IMAGE_URL?.trim() ||
    (OG_IMAGE_PATH.startsWith('http')
      ? OG_IMAGE_PATH
      : `${SITE}${OG_IMAGE_PATH.startsWith('/') ? '' : '/'}${OG_IMAGE_PATH}`);
  const isHome = pathname === '/';
  const orgLd = isHome
    ? buildOrganizationJsonLd(SITE, { description: HOME_DESCRIPTION, logoPath: OG_IMAGE_PATH })
    : null;
  const crumbItems = categoryBreadcrumbItems(pathname);
  const crumbLd = crumbItems ? buildBreadcrumbJsonLd(SITE, crumbItems) : null;
  const isProduct = Boolean(matchPath({ path: '/product/:slug', end: true }, pathname));

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description || DEFAULT_DESC} />
      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:type" content={isProduct ? 'product' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description || DEFAULT_DESC} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Gawri Ganga" />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:image:alt" content={meta.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description || DEFAULT_DESC} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={meta.title} />
      {orgLd ? (
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
      ) : null}
      {crumbLd ? (
        <script type="application/ld+json">{JSON.stringify(crumbLd)}</script>
      ) : null}
    </Helmet>
  );
};

export default RouteSeo;

export { PRODUCT_META_OVERRIDES };
