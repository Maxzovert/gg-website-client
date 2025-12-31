import React from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ 
  product, 
  variant = 'default', // 'rudraksh', 'spray', 'rashi', 'default'
  calculatePricing,
  getReviewCount,
  getEssence,
  onAddToCart
}) => {
  // Calculate pricing
  const pricing = calculatePricing ? calculatePricing(product.price) : {
    currentPrice: product.price,
    originalPrice: product.price * 1.25,
    discount: 25
  };

  // Get review count
  const reviewCount = getReviewCount ? getReviewCount(product.id) : 5;

  // Get essence for spray variant
  const essence = variant === 'spray' && getEssence ? getEssence(product.subcategory) : null;

  // Determine which badges to show based on variant
  const getBadges = () => {
    const badges = [];

    if (variant === 'rashi') {
      // Rashi shows subcategory, deity, and planet
      if (product.subcategory) {
        badges.push({ text: product.subcategory, type: 'subcategory' });
      }
      if (product.deity) {
        badges.push({ text: product.deity, type: 'deity' });
      }
      if (product.planet) {
        badges.push({ text: product.planet, type: 'planet' });
      }
    } else if (variant === 'spray') {
      // Spray shows subcategory and essence
      if (product.subcategory) {
        badges.push({ text: product.subcategory, type: 'subcategory' });
      }
      if (essence) {
        badges.push({ text: essence, type: 'essence' });
      }
    } else {
      // Rudraksh and default show only subcategory
      if (product.subcategory) {
        badges.push({ text: product.subcategory, type: 'subcategory' });
      }
    }

    return badges;
  };

  const badges = getBadges();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary overflow-hidden hover:shadow-lg hover:border-primary/80 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      {/* Product Image */}
      <div className="aspect-square lg:aspect-[4/3] from-gray-50 to-gray-100 overflow-hidden relative group">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <span className="text-sm">No Image</span>
          </div>
        )}
        {/* Discount Badge */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-3 lg:right-3 bg-black text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2.5 lg:py-1 rounded shadow-lg">
          {pricing.discount}% OFF
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-white flex-1 flex flex-col">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-1.5 mb-1 lg:mb-2">
            {badges.map((badge, index) => {
              // Different badge styles based on type
              let badgeClass = 'inline-block px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 text-[9px] sm:text-[10px] lg:text-xs font-semibold rounded border ';
              
              if (badge.type === 'subcategory') {
                badgeClass += variant === 'rashi' 
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-orange-50 text-orange-700 border-orange-200';
              } else if (badge.type === 'deity' || badge.type === 'planet') {
                badgeClass += 'bg-primary/10 text-primary border-primary/30';
              } else if (badge.type === 'essence') {
                badgeClass += 'bg-purple-50 text-purple-700 border-purple-200';
              }

              return (
                <span key={index} className={badgeClass}>
                  {badge.text}
                </span>
              );
            })}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 line-clamp-2 mb-1 lg:mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Short Description - Only on larger screens (lg and above) */}
        {(product.short_description || product.shortDescription) ? (
          <p className="hidden lg:block text-sm text-gray-500 mb-2 line-clamp-2 leading-snug">
            {product.short_description || product.shortDescription}
          </p>
        ) : null}

        {/* Benefits (for Rashi variant) */}
        {variant === 'rashi' && product.benefits && (
          <p className="hidden sm:block text-xs lg:text-sm text-gray-600 mb-1 sm:mb-2 lg:mb-3 line-clamp-2 leading-snug italic">
            Benefits: {product.benefits}
          </p>
        )}

        {/* Star Rating */}
        <div className="flex items-center gap-0.5 lg:gap-1 mb-1.5 sm:mb-2 lg:mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-primary text-[9px] sm:text-[10px] lg:text-sm fill-current" />
            ))}
          </div>
          <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 font-medium ml-0.5 lg:ml-1">({reviewCount})</span>
        </div>

        {/* Pricing Section */}
        <div className="mt-auto pt-1 sm:pt-1.5 lg:pt-2.5 border-t border-primary/20">
          <div className="flex items-stretch gap-1 sm:gap-2 lg:gap-3">
            {/* Price and Stock - Left Side */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-baseline gap-1 sm:gap-1.5 lg:gap-2 mb-0.5 lg:mb-1">
                <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-primary truncate">
                  ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 line-through font-medium hidden sm:inline">
                  ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center text-[9px] sm:text-[10px] lg:text-xs font-semibold text-primary">
                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-primary rounded-full mr-0.5 sm:mr-1 lg:mr-1.5"></span>
                  <span className="hidden sm:inline">In Stock</span>
                  <span className="sm:hidden">Stock</span>
                </span>
              ) : (
                <span className="inline-flex items-center text-[9px] sm:text-[10px] lg:text-xs font-semibold text-red-600">
                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-red-500 rounded-full mr-0.5 sm:mr-1 lg:mr-1.5"></span>
                  <span className="hidden sm:inline">Out of Stock</span>
                  <span className="sm:hidden">No Stock</span>
                </span>
              )}
            </div>

            {/* Cart Button - Right Side */}
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className="border-2 border-primary text-primary bg-transparent w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Add to cart"
            >
              <FaShoppingCart className="text-xs sm:text-sm md:text-base lg:text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

