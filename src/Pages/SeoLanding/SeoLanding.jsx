import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NotFound from '../NotFound/NotFound';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import { resolveLanding, LANDING_PAGES } from '../../seo/landings.js';
import { buildBreadcrumbJsonLd } from '../../utils/productJsonLd.js';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');

function productMatchesMukhi(product, n) {
  const text = `${product?.name || ''} ${product?.subcategory || ''}`.toLowerCase();
  return (
    text.includes(`${n} mukhi`) ||
    text.includes(`${n}-mukhi`) ||
    text.includes(`${n}mukhi`)
  );
}

const SeoLanding = () => {
  const { pathname } = useLocation();
  const page = resolveLanding(pathname);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(page?.kind === 'guide' ? false : Boolean(page));

  useEffect(() => {
    if (!page || page.kind === 'guide') {
      setProducts([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let list = [];
        if (page.kind === 'purpose') {
          const res = await apiFetch(
            `/api/products?purpose=${encodeURIComponent(page.purposeQuery)}&limit=100`,
          );
          const json = await res.json();
          list = json?.success && Array.isArray(json.data) ? json.data : [];
        } else {
          const res = await apiFetch('/api/products?category=Rudraksha&limit=100');
          const json = await res.json();
          const all = json?.success && Array.isArray(json.data) ? json.data : [];
          if (page.kind === 'mukhi') {
            list = all.filter((p) => productMatchesMukhi(p, page.mukhi));
          } else if (page.kind === 'rashi') {
            list = all.filter((p) => page.mukhis.some((m) => productMatchesMukhi(p, parseInt(m, 10))));
          }
        }
        if (!cancelled) setProducts(list.filter((p) => p?.slug));
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (page === null || page === undefined) return <NotFound />;

  const crumbLd = buildBreadcrumbJsonLd(page.crumbs);
  const related = LANDING_PAGES.filter((p) => p.kind === page.kind && p.path !== page.path).slice(0, 8);

  return (
    <div className="min-h-[60vh] bg-[#FFFAEB]">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        {page.keywords ? <meta name="keywords" content={page.keywords} /> : null}
        <link rel="canonical" href={`${SITE}${page.path}`} />
        {crumbLd ? <script type="application/ld+json">{JSON.stringify(crumbLd)}</script> : null}
      </Helmet>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-600">
          <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
            {page.crumbs.map((c, i) => (
              <li key={c.url} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {i < page.crumbs.length - 1 ? (
                  <Link to={c.url} className="hover:text-primary">
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-stone-900 font-medium">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">{page.h1}</h1>
        <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-3xl">{page.lead}</p>

        {page.kind === 'mukhi' ? (
          <p className="mt-4 text-stone-700 leading-relaxed max-w-3xl">
            Traditionally associated with {page.deity}
            {page.planet && page.planet !== 'none in particular' ? ` and ${page.planet}` : ''}. Compare the{' '}
            {page.mukhi > 1 ? (
              <Link className="text-primary font-semibold hover:underline" to={`/mukhi/${page.mukhi - 1}-mukhi-rudraksha`}>
                {page.mukhi - 1} Mukhi
              </Link>
            ) : null}
            {page.mukhi > 1 && page.mukhi < 14 ? ' and ' : ''}
            {page.mukhi < 14 ? (
              <Link className="text-primary font-semibold hover:underline" to={`/mukhi/${page.mukhi + 1}-mukhi-rudraksha`}>
                {page.mukhi + 1} Mukhi
              </Link>
            ) : null}{' '}
            pages, or shop the full{' '}
            <Link className="text-primary font-semibold hover:underline" to="/rudraksha">
              Rudraksha collection
            </Link>
            .
          </p>
        ) : null}

        {page.kind === 'guide'
          ? page.sections.map((section) => (
              <section key={section.h} className="mt-8">
                <h2 className="font-heading text-xl font-bold text-stone-900">{section.h}</h2>
                <p className="mt-2 text-stone-700 leading-relaxed">{section.p}</p>
              </section>
            ))
          : null}

        {page.kind !== 'guide' ? (
          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-stone-900 mb-4">Matching products</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <p className="text-stone-600">
                No matching products are listed right now.{' '}
                <Link className="text-primary font-semibold hover:underline" to="/products">
                  Browse the full catalogue
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id || product.slug}
                    product={product}
                    calculatePricing={pricingFromProduct}
                    getReviewCount={getCardReviewCount}
                  />
                ))}
              </div>
            )}
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="font-heading text-lg font-bold text-stone-900 mb-3">More in this series</h2>
          <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
            {related.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="text-primary hover:underline font-medium">
                  {item.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
};

export default SeoLanding;
