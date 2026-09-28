import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { buildBreadcrumbJsonLd } from '../../utils/productJsonLd.js';
import CategoryIntro from '../../components/CategoryIntro';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');

const CATEGORIES = [
  { name: 'Rudraksha', path: '/rudraksha', api: 'Rudraksha' },
  { name: 'Tulsi Mala', path: '/tulsimala', api: 'Tulsi Mala' },
  { name: 'Aura Sprays', path: '/sprays', api: 'Sprays' },
  { name: 'Accessories', path: '/accessories', api: 'Accessories' },
  { name: 'Combos', path: '/combos', api: 'Combos' },
];

/**
 * Crawlable product index — every active product gets an internal HTML link
 * (addresses orphan pages from the SEO audit).
 */
const AllProducts = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const seen = new Set();
        const next = [];

        for (const cat of CATEGORIES) {
          const res = await apiFetch(
            `/api/products?category=${encodeURIComponent(cat.api)}&limit=100`,
          );
          const json = await res.json();
          if (!res.ok || !json?.success) continue;
          const items = (Array.isArray(json.data) ? json.data : [])
            .filter((p) => p?.slug && !seen.has(p.slug))
            .map((p) => {
              seen.add(p.slug);
              return p;
            })
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
          if (items.length) next.push({ ...cat, products: items });
        }

        // Catch any active products not in the known categories
        const allRes = await apiFetch('/api/products?limit=100');
        const allJson = await allRes.json();
        if (allRes.ok && allJson?.success) {
          const orphans = (Array.isArray(allJson.data) ? allJson.data : [])
            .filter((p) => p?.slug && !seen.has(p.slug))
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
          if (orphans.length) {
            next.push({
              name: 'More products',
              path: '/products',
              api: '',
              products: orphans,
            });
          }
        }

        if (!cancelled) setSections(next);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Unable to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'All Products', url: '/products' },
  ]);

  return (
    <div className="min-h-[60vh] bg-[#FFFAEB]">
      <Helmet>
        <title>All Products | Rudraksha, Malas & Spiritual Items | Gawri Ganga</title>
        <meta
          name="description"
          content="Browse the full Gawri Ganga catalogue—Nepali Rudraksha, Tulsi malas, aura sprays, accessories, and combos. Every product linked for easy discovery."
        />
        <link rel="canonical" href={`${SITE}/products`} />
        {breadcrumbJsonLd ? (
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        ) : null}
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <CategoryIntro id="products" />
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-600">
          <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-900 font-medium">All Products</li>
          </ol>
        </nav>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-3">
          All Products
        </h1>
        <p className="text-stone-700 mb-8 max-w-2xl">
          Complete catalogue of authentic Rudraksha, malas, sprays, and spiritual accessories at
          Gawri Ganga.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center py-12">{error}</p>
        ) : (
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.name}>
                <div className="flex items-baseline justify-between gap-4 mb-4 border-b border-stone-200 pb-2">
                  <h2 className="font-heading text-xl font-bold text-stone-900">{section.name}</h2>
                  {section.path !== '/products' ? (
                    <Link to={section.path} className="text-sm font-semibold text-primary hover:underline">
                      View collection
                    </Link>
                  ) : null}
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
                  {section.products.map((p) => (
                    <li key={p.id || p.slug}>
                      <Link
                        to={`/product/${p.slug}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
