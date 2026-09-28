/**
 * Client helpers — wraps shared SEO JSON-LD with VITE_SITE_URL.
 */
import {
  buildBreadcrumbJsonLd as buildBreadcrumbJsonLdShared,
  buildProductJsonLd as buildProductJsonLdShared,
} from '../seo/jsonLd.js';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');

export function buildProductJsonLd({ product, pricing, avgRating = 0, reviewCount = 0 }) {
  return buildProductJsonLdShared(SITE, { product, pricing, avgRating, reviewCount });
}

export function buildBreadcrumbJsonLd(items) {
  return buildBreadcrumbJsonLdShared(SITE, items);
}
