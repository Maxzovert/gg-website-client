/**
 * JSON-LD builders shared by client Helmet and Cloudflare Worker HTML injection.
 * Keep free of React.
 */

import { FAQ_ITEMS } from './faqData.js';
import { HOME_DESCRIPTION } from './routeMeta.js';

export function buildOrganizationJsonLd(siteUrl, { description = HOME_DESCRIPTION, logoPath = '/favicon.png' } = {}) {
  const site = String(siteUrl || '').replace(/\/$/, '');
  const logo = logoPath.startsWith('http') ? logoPath : `${site}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gawri Ganga',
    url: site,
    logo,
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@gawriganga.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

export function buildFaqPageJsonLd(items = FAQ_ITEMS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(siteUrl, items) {
  if (!items?.length) return null;
  const site = String(siteUrl || '').replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url
        ? { item: item.url.startsWith('http') ? item.url : `${site}${item.url}` }
        : {}),
    })),
  };
}

export function buildProductJsonLd(siteUrl, { product, pricing, avgRating = 0, reviewCount = 0 }) {
  if (!product?.id && !product?.slug && !product?.name) return null;
  const site = String(siteUrl || '').replace(/\/$/, '');
  const slug = product.slug || product.id;
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const inStock = Number(product.stock) > 0;
  const price = Number(pricing?.currentPrice) || Number(product.price) || 0;

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.meta_description ||
      product.short_description ||
      (typeof product.description === 'string'
        ? product.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
        : '') ||
      product.name,
    image: images.length ? images : undefined,
    sku: String(product.sku || product.id || slug),
    brand: {
      '@type': 'Brand',
      name: 'Gawri Ganga',
    },
    offers: {
      '@type': 'Offer',
      url: `${site}/product/${slug}`,
      priceCurrency: 'INR',
      price,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Gawri Ganga',
      },
    },
  };

  if (reviewCount > 0 && avgRating > 0) {
    json.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return json;
}

/** Category / collection breadcrumb: Home → Category */
export function categoryBreadcrumbItems(pathname) {
  const map = {
    '/rudraksha': 'Rudraksha',
    '/tulsimala': 'Tulsi Mala',
    '/sprays': 'Aura Sprays',
    '/rashi': 'Rudraksha by Rashi',
    '/accessories': 'Accessories',
    '/purpose-products': 'Shop by Purpose',
    '/combos': 'Combos',
    '/products': 'All Products',
    '/blog': 'Blog',
    '/about': 'About',
    '/contact': 'Contact',
  };
  const name = map[pathname];
  if (!name) return null;
  return [
    { name: 'Home', url: '/' },
    { name, url: pathname },
  ];
}
