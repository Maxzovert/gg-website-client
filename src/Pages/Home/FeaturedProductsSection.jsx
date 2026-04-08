import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingCart, FaStar } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct } from '../../utils/productPricing';
import { useCart } from '../../context/CartContext';

const FEATURED_COUNT = 7;
const ROTATE_INTERVAL_MS = 4500;

function formatInr(value) {
  return `Rs. ${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;
}

function shuffleList(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/products?featured=true&limit=50');
        if (!response.ok) throw new Error('Failed to fetch featured products');
        const result = await response.json();
        const list = result?.success && Array.isArray(result.data) ? result.data : [];
        const featuredOnly = list.filter((item) => item?.is_featured === true);
        setProducts(shuffleList(featuredOnly).slice(0, FEATURED_COUNT));
      } catch (_error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (products.length <= 1) return undefined;

    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [products]);

  useEffect(() => {
    if (activeIndex >= products.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, products.length]);

  const heroProduct = products[activeIndex];
  const restProducts = useMemo(
    () => products.filter((_, index) => index !== activeIndex).slice(0, 6),
    [products, activeIndex],
  );

  if (loading) {
    return (
      <section className="bg-[#FFFAEB] py-8 md:py-14">
        <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
          <Loader />
        </div>
      </section>
    );
  }

  if (!heroProduct) return null;

  const heroPricing = pricingFromProduct(heroProduct);
  const heroImage = heroProduct.images?.[0];

  return (
    <section
      className="relative overflow-hidden bg-[#FFFAEB] py-8 md:py-14"
      aria-labelledby="featured-products-heading"
    >
      <div className="pointer-events-none absolute left-0 top-0 h-44 w-44 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-3 md:mb-9">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <FaStar className="text-amber-500" aria-hidden />
              Curated picks
            </p>
            <h2 id="featured-products-heading" className="font-heading text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl md:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link
            to="/rudraksha"
            className="hidden items-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5 sm:inline-flex"
          >
            Explore all
            <FaArrowRight aria-hidden />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <article className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl lg:col-span-7">
            <div className="relative h-full min-h-[410px] sm:min-h-[520px] w-full overflow-hidden">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={heroProduct.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-stone-100 text-sm font-semibold text-stone-500">
                  Featured pick
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-900/35 to-transparent" />

              {heroPricing.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {heroPricing.discount}% OFF
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.28em] text-amber-200">
                  Spotlight product
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-white sm:mt-2 sm:text-3xl line-clamp-2">{heroProduct.name}</h3>
                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-stone-200 sm:text-base">
                  {heroProduct.short_description || heroProduct.description || 'Premium spiritual product.'}
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{formatInr(heroPricing.currentPrice)}</p>
                    {heroPricing.discount > 0 && (
                      <p className="text-sm text-stone-300 line-through">{formatInr(heroPricing.originalPrice)}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <button
                      type="button"
                      onClick={() => addToCart(heroProduct, 1)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/95 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-stone-900 transition hover:bg-white"
                    >
                      <FaShoppingCart aria-hidden />
                      Add to cart
                    </button>
                    <Link
                      to={`/product/${heroProduct.slug || heroProduct.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-primary/90"
                    >
                      View details
                      <FaArrowRight aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {products.length > 1 && (
              <div className="absolute right-3 top-3 sm:right-4 sm:top-4 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/35 px-2 py-1 sm:px-2.5 backdrop-blur">
                {products.map((product, idx) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition ${
                      idx === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Show featured product ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {restProducts.map((product) => {
              const pricing = pricingFromProduct(product);
              const image = product.images?.[0];

              return (
                <article
                  key={product.id}
                  className="group grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)] items-start sm:items-center gap-2.5 sm:gap-3 rounded-2xl border-2 border-amber-200/90 bg-white/90 p-2.5 sm:p-3 shadow-sm transition hover:border-primary/35 hover:shadow-md"
                >
                  <Link to={`/product/${product.slug || product.id}`} className="h-[72px] w-[72px] sm:h-20 sm:w-20 overflow-hidden rounded-lg sm:rounded-xl bg-stone-100">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <Link to={`/product/${product.slug || product.id}`} className="line-clamp-2 text-xs sm:text-base font-semibold text-stone-900 block">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-primary">{formatInr(pricing.currentPrice)}</p>
                    {pricing.discount > 0 && (
                      <p className="text-[11px] sm:text-xs text-stone-500">
                        <span className="line-through">{formatInr(pricing.originalPrice)}</span>
                        <span className="ml-1 font-semibold text-emerald-700">{pricing.discount}% off</span>
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-primary/5 px-2 py-1 text-[11px] sm:text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        <FaShoppingCart aria-hidden />
                        Add to cart
                      </button>
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/80 bg-amber-50 px-2 py-1 text-[11px] sm:text-xs font-semibold text-amber-800 transition hover:border-amber-400 hover:bg-amber-100"
                      >
                        View details
                        <FaArrowRight aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            to="/rudraksha"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
          >
            Explore all
            <FaArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
