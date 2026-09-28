import {
  PATH_REDIRECTS,
  blogMetaFromPost,
  isKnownStaticPath,
  matchStaticRouteMeta,
  normalizePathname,
  productMetaFromSlug,
} from '../src/seo/routeMeta.js';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildProductJsonLd,
  categoryBreadcrumbItems,
} from '../src/seo/jsonLd.js';
import { landingSitemapPaths, resolveLanding } from '../src/seo/landings.js';
import { injectSeoIntoHtml, withAssetCacheHeaders } from './injectSeo.js';

const DEFAULT_SITE = 'https://www.gawriganga.com';
const DEFAULT_OG = '/favicon.png';

function siteUrl(env) {
  return String(env.SITE_URL || DEFAULT_SITE).replace(/\/+$/, '');
}

function apiBase(env) {
  return String(env.API_URL || '').replace(/\/+$/, '');
}

function defaultOgImage(env) {
  const site = siteUrl(env);
  const path = env.OG_IMAGE_PATH || DEFAULT_OG;
  if (String(path).startsWith('http')) return path;
  return `${site}${path.startsWith('/') ? '' : '/'}${path}`;
}

function isStaticAssetPath(pathname) {
  if (pathname === '/sitemap.xml' || pathname === '/sitemap-images.xml') return false;
  return /\.[a-zA-Z0-9]{1,8}$/.test(pathname);
}

/** Vite HMR / module graph — must not be treated as SPA HTML routes in local dev. */
function isViteDevPath(pathname) {
  return (
    pathname.startsWith('/@') ||
    pathname.startsWith('/node_modules/') ||
    pathname.startsWith('/src/') ||
    pathname.startsWith('/.vite/')
  );
}

function redirectResponse(to, status = 301) {
  return new Response(null, {
    status,
    headers: { Location: to, 'Cache-Control': 'public, max-age=86400' },
  });
}

/** Collapse http/non-www → https://www in one hop. */
function hostRedirect(request, env) {
  const url = new URL(request.url);
  const canonicalHost = new URL(siteUrl(env)).host;
  const host = url.hostname.toLowerCase();

  if (host === 'gawriganga.com' || host === 'www.gawriganga.com') {
    if (host !== canonicalHost || url.protocol === 'http:') {
      const target = new URL(url.pathname + url.search, `https://${canonicalHost}`);
      return redirectResponse(target.toString(), 301);
    }
  }
  return null;
}

function pathRedirect(pathname, request, env) {
  const path = normalizePathname(pathname);
  const dest = PATH_REDIRECTS[path];
  if (!dest) return null;
  const site = siteUrl(env);
  return redirectResponse(`${site}${dest}`, 301);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cf: { cacheTtl: 60, cacheEverything: true },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getProduct(slug, env) {
  const base = apiBase(env);
  if (!base) return null;
  const json = await fetchJson(`${base}/api/products/${encodeURIComponent(slug)}`);
  if (!json?.success || !json.data) return null;
  return json.data;
}

async function getBlog(slug, env) {
  const base = apiBase(env);
  if (!base) return null;
  const json = await fetchJson(`${base}/api/blogs/${encodeURIComponent(slug)}`);
  if (!json?.success || !json.data) return null;
  return json.data;
}

async function getSitemapPayload(env) {
  const base = apiBase(env);
  if (!base) return { products: [], blogs: [] };
  const json = await fetchJson(`${base}/api/seo/sitemap-urls`);
  if (!json?.success || !json.data) return { products: [], blogs: [] };
  return json.data;
}

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSitemapXml(env, { products = [], blogs = [] }) {
  const site = siteUrl(env);
  const staticPaths = [
    '/',
    '/sprays',
    '/rudraksha',
    '/tulsimala',
    '/rashi',
    '/accessories',
    '/purpose-products',
    '/combos',
    '/products',
    '/about',
    '/blog',
    '/contact',
    '/corporate-bulk-orders',
    '/terms-of-service',
    '/refund-cancellation',
    '/terms-and-conditions',
    '/shipping-policy',
    '/privacy-policy',
    '/sprays/amrat-bindu',
    '/sprays/maitri',
    '/sprays/chakra-balance',
    '/sprays/shuddhi',
  ];
  staticPaths.push(...landingSitemapPaths());

  const urls = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const path of staticPaths) {
    urls.push({ loc: `${site}${path === '/' ? '/' : path}`, lastmod: today });
  }
  for (const p of products) {
    if (!p?.slug) continue;
    urls.push({
      loc: `${site}/product/${p.slug}`,
      lastmod: (p.lastmod || today).slice(0, 10),
      image: p.image || null,
    });
  }
  for (const b of blogs) {
    if (!b?.slug) continue;
    urls.push({
      loc: `${site}/blog/${b.slug}`,
      lastmod: (b.lastmod || today).slice(0, 10),
      image: b.image || null,
    });
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls.map((u) => {
      const imageBlock = u.image
        ? `\n    <image:image>\n      <image:loc>${xmlEscape(u.image)}</image:loc>\n    </image:image>`
        : '';
      return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>${imageBlock}\n  </url>`;
    }),
    '</urlset>',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

async function serveSpaShell(request, env, { status, meta, product, blogPost, landing, pathname }) {
  const site = siteUrl(env);
  const url = new URL(request.url);
  const path = pathname || normalizePathname(url.pathname);
  const pageUrl = `${site}${path === '/' ? '/' : path}`;
  const ogImage = meta?.image || defaultOgImage(env);
  const logoPath = env.OG_IMAGE_PATH || DEFAULT_OG;

  const assetRes = await env.ASSETS.fetch(new URL('/index.html', request.url));
  if (!assetRes.ok) {
    return new Response('Not found', { status: 404 });
  }

  const notFoundMeta = {
    title: 'Page Not Found | Gawri Ganga',
    description: 'The page you requested does not exist on Gawri Ganga.',
  };

  const jsonLd = [];
  if (status === 200) {
    if (path === '/') {
      jsonLd.push(buildOrganizationJsonLd(site, { logoPath }));
      jsonLd.push(buildFaqPageJsonLd());
    }

    if (product) {
      jsonLd.push(
        buildProductJsonLd(site, {
          product,
          pricing: { currentPrice: product.price },
        }),
      );
      const categoryPath = categoryPathForProduct(product);
      jsonLd.push(
        buildBreadcrumbJsonLd(site, [
          { name: 'Home', url: '/' },
          ...(categoryPath ? [{ name: categoryPath.name, url: categoryPath.url }] : []),
          { name: product.name || meta?.title, url: path },
        ]),
      );
    } else if (blogPost) {
      jsonLd.push(
        buildBreadcrumbJsonLd(site, [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: blogPost.title || meta?.title, url: path },
        ]),
      );
    } else if (landing?.crumbs?.length) {
      jsonLd.push(buildBreadcrumbJsonLd(site, landing.crumbs));
    } else {
      const crumbs = categoryBreadcrumbItems(path);
      if (crumbs) jsonLd.push(buildBreadcrumbJsonLd(site, crumbs));
    }
  }

  return injectSeoIntoHtml(assetRes, {
    title: status === 404 ? notFoundMeta.title : meta?.title,
    description: status === 404 ? notFoundMeta.description : meta?.description,
    keywords: status === 404 ? undefined : meta?.keywords,
    url: pageUrl,
    image: ogImage,
    status,
    jsonLd,
  });
}

function categoryPathForProduct(product) {
  const cat = String(product?.category || '').toLowerCase();
  if (cat.includes('rudraksha')) return { name: 'Rudraksha', url: '/rudraksha' };
  if (cat.includes('tulsi')) return { name: 'Tulsi Mala', url: '/tulsimala' };
  if (cat.includes('spray')) return { name: 'Aura Sprays', url: '/sprays' };
  if (cat.includes('accessor')) return { name: 'Accessories', url: '/accessories' };
  if (cat.includes('combo')) return { name: 'Combos', url: '/combos' };
  return null;
}

async function resolveDocument(request, env) {
  const url = new URL(request.url);
  const path = normalizePathname(url.pathname);

  if (path.startsWith('/product/')) {
    const slug = path.slice('/product/'.length).split('/')[0];
    if (!slug) return { status: 404, meta: null, pathname: path };
    const product = await getProduct(slug, env);
    if (!product) return { status: 404, meta: null, pathname: path };
    return {
      status: 200,
      meta: productMetaFromSlug(slug, product),
      product,
      pathname: path,
    };
  }

  if (path.startsWith('/blog/') || path.startsWith('/blogs/')) {
    const slug = path.replace(/^\/blogs?\//, '').split('/')[0];
    if (!slug) return { status: 404, meta: null, pathname: path };
    const post = await getBlog(slug, env);
    if (!post) return { status: 404, meta: null, pathname: path };
    return {
      status: 200,
      meta: blogMetaFromPost(post),
      blogPost: post,
      pathname: path,
    };
  }

  if (path.startsWith('/orders/')) {
    return {
      status: 200,
      meta: { title: 'Order Details | Gawri Ganga', description: 'View your order status and items.' },
      pathname: path,
    };
  }

  if (path === '/auth/callback') {
    return {
      status: 200,
      meta: { title: 'Sign In | Gawri Ganga', description: 'Completing sign-in.' },
      pathname: path,
    };
  }

  const landing = resolveLanding(path);
  if (landing === null) return { status: 404, meta: null, pathname: path };
  if (landing) {
    return { status: 200, meta: landing, landing, pathname: path };
  }

  if (isKnownStaticPath(path)) {
    const meta = matchStaticRouteMeta(path, url.searchParams) || {
      title: 'Gawri Ganga',
      description: 'Authentic Rudraksha and spiritual products online in India.',
    };
    return { status: 200, meta, pathname: path };
  }

  return { status: 404, meta: null, pathname: path };
}

export default {
  async fetch(request, env) {
    const hostRedir = hostRedirect(request, env);
    if (hostRedir) return hostRedir;

    const url = new URL(request.url);
    const path = normalizePathname(url.pathname);

    const pathRedir = pathRedirect(path, request, env);
    if (pathRedir) return pathRedir;

    if (path === '/sitemap.xml' || path === '/sitemap-images.xml') {
      const payload = await getSitemapPayload(env);
      return buildSitemapXml(env, payload);
    }

    // Vite HMR + static assets (JS/CSS/images/fonts) — pass through with cache headers
    if (isViteDevPath(url.pathname) || isStaticAssetPath(path)) {
      const assetRes = await env.ASSETS.fetch(request);
      return withAssetCacheHeaders(assetRes, url.pathname);
    }

    // Non-GET (unlikely for HTML) — pass through
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    const resolved = await resolveDocument(request, env);
    return serveSpaShell(request, env, resolved);
  },
};
