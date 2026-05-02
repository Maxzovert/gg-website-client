import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import { apiFetch } from '../../config/api';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';

const EXPLORE_PRODUCT_COUNT = 16;

function isSprayProduct(product) {
  return String(product?.category || '')
    .toLowerCase()
    .includes('spray');
}

function pickRandomProducts(products, count) {
  const pool = [...products];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Random non-spray product gallery (16 items, 4 columns from md+). Shared by Blog list and BlogPostPage.
 */
export default function BlogExploreProductsSection({ headingId = 'blog-explore-products-heading' }) {
  const [exploreProducts, setExploreProducts] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchExploreProducts = async () => {
      try {
        setExploreLoading(true);
        const response = await apiFetch('/api/products?limit=100');
        const payload = await response.json();
        const list = payload?.success && Array.isArray(payload.data) ? payload.data : [];
        const withoutSprays = list.filter((p) => !isSprayProduct(p));
        const picked = pickRandomProducts(withoutSprays, EXPLORE_PRODUCT_COUNT);
        if (!cancelled) setExploreProducts(picked);
      } catch (_err) {
        if (!cancelled) setExploreProducts([]);
      } finally {
        if (!cancelled) setExploreLoading(false);
      }
    };

    fetchExploreProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="mt-16 border-t border-stone-200 pt-12 sm:mt-20 sm:pt-16"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 id={headingId} className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl">
          Explore our products
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
          Spiritual products online — Rudraksha, Tulsi Mala, accessories, and more. Handpicked inspiration while
          you read (sprays excluded here; find them on our{' '}
          <Link
            to="/sprays"
            className="font-semibold text-primary underline-offset-2 hover:text-primary/80 hover:underline"
          >
            Aura Sprays
          </Link>{' '}
          page).
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          Browse the store
          <FaArrowRight aria-hidden />
        </Link>
      </div>

      {exploreLoading ? (
        <div className="mt-10 flex justify-center">
          <Loader />
        </div>
      ) : exploreProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {exploreProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="default"
              calculatePricing={pricingFromProduct}
              getReviewCount={getCardReviewCount}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
