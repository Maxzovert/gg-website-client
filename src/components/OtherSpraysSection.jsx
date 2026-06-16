import React, { useEffect, useState } from 'react';
import SprayProductCard from './SprayProductCard';
import Loader from './Loader';
import { pricingFromProduct } from '../utils/productPricing';
import { getCardReviewCount } from '../utils/reviewDisplayCount';
import { fetchAllProductsByCategory } from '../utils/shopProductFetch';

const OtherSpraysSection = ({ excludeProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const list = await fetchAllProductsByCategory('Sprays');
        if (cancelled) return;
        const others = list.filter((item) => item?.id !== excludeProductId);
        setProducts(others);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeProductId]);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="other-sprays-heading">
      <h2
        id="other-sprays-heading"
        className="mb-5 text-center text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl"
      >
        Explore Other Aura Sprays
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {products.map((product) => (
            <SprayProductCard
              key={product.id}
              product={product}
              calculatePricing={pricingFromProduct}
              getReviewCount={getCardReviewCount}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default OtherSpraysSection;
