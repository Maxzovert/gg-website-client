import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { apiFetch } from '../config/api.js';
import { pricingFromProduct } from '../utils/productPricing';
import { getCardReviewCount } from '../utils/reviewDisplayCount.js';

const DESKTOP_EXPLORE_COUNT = 5;
const MOBILE_EXPLORE_COUNT = 6;

const getRandomProducts = (items, count) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

export default function ExploreCollectionSection({ heading, category, linkTo, linkText }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileCarousel, setIsMobileCarousel] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobileCarousel(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!category) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchExploreProducts = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(
          `/api/products?category=${encodeURIComponent(category)}&limit=100`,
        );
        if (!response.ok) throw new Error('Failed to fetch products');
        const result = await response.json();
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        const exploreCount = isMobileCarousel ? MOBILE_EXPLORE_COUNT : DESKTOP_EXPLORE_COUNT;
        if (!cancelled) {
          setProducts(getRandomProducts(list, exploreCount));
        }
      } catch (_err) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchExploreProducts();
    return () => {
      cancelled = true;
    };
  }, [category, isMobileCarousel]);

  if (loading) {
    return (
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="relative py-10 md:py-14 overflow-x-clip overflow-y-visible">
      <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8 md:mb-10">
          <h2 className="font-heading font-bold text-stone-800 text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3">
            {heading}
          </h2>
        </div>

        <div
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-5 lg:gap-7"
          role="list"
        >
          {products.map((product) => (
            <div key={product.id} role="listitem" className="relative flex h-full min-w-0 flex-col">
              <ProductCard
                product={product}
                variant="rudraksh"
                size={isMobileCarousel ? 'default' : 'lg'}
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
              />
            </div>
          ))}
        </div>

        {linkTo && linkText ? (
          <div className="mt-8 md:mt-10 flex justify-center">
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base hover:text-primary/80 transition-colors"
            >
              {linkText}
              <FaArrowRight className="text-sm" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
