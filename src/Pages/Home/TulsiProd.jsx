import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGem } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';

const FEATURED_COUNT = 5;
const TULSI_CATEGORY = 'Tulsi Mala';

const getRandomProducts = (items, count) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const TulsiProd = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileCarousel, setIsMobileCarousel] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobileCarousel(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(
          `/api/products?category=${encodeURIComponent(TULSI_CATEGORY)}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        setProducts(getRandomProducts(list, FEATURED_COUNT));
      } catch (_err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getReviewCount = (productId) => 5 + (productId % 3);

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-[#FFFAEB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      className="relative py-10 md:py-14 overflow-x-clip overflow-y-visible bg-[#FFFAEB]"
      aria-labelledby="tulsi-featured-heading"
    >
      <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            <FaGem className="text-primary text-sm" aria-hidden />
            Handpicked for you
          </p>
          <h2
            id="tulsi-featured-heading"
            className="font-heading font-bold text-stone-800 text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3"
          >
            Our Curated Tulsi Mala Collection
          </h2>
        </div>

        <div
          className="flex flex-nowrap max-sm:gap-3 max-sm:-mx-4 max-sm:px-4 max-sm:py-1 max-sm:pb-3 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0 sm:py-0 md:grid-cols-3 lg:grid-cols-5 sm:gap-5 md:gap-6 lg:gap-7 [scrollbar-width:thin]"
          role="list"
          aria-label="Featured Tulsi products, scroll horizontally on small screens"
        >
          {products.map((product) => (
            <div
              key={product.id}
              role="listitem"
              className="relative shrink-0 snap-start w-[min(calc(100vw-3.75rem),208px)] sm:w-auto sm:min-w-0 sm:shrink rounded-lg sm:rounded-2xl p-px sm:p-[3px] bg-linear-to-br from-amber-400/90 via-primary/50 to-amber-600/80 shadow-md sm:shadow-lg shadow-amber-900/10"
            >
              <span className="absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100%-6px)] truncate rounded-full bg-primary px-1.5 py-px sm:px-3 sm:py-1 text-[8px] sm:text-[11px] sm:leading-normal md:text-sm font-bold uppercase tracking-wide text-white shadow-md text-center">
                Highlighted
              </span>
              <div className="rounded-[10px] sm:rounded-[13px] bg-amber-50/30 overflow-hidden h-full w-full pt-3.5 sm:pt-5">
                <ProductCard
                  product={product}
                  variant="rudraksh"
                  size={isMobileCarousel ? 'default' : 'lg'}
                  calculatePricing={pricingFromProduct}
                  getReviewCount={getReviewCount}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            to="/tulsimala"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base hover:text-primary/80 transition-colors"
          >
            View full Tulsi Mala collection
            <FaArrowRight className="text-sm" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TulsiProd;
