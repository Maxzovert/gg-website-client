import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './Toaster';
import { pricingFromProduct } from '../utils/productPricing';

const ProductCard = ({ 
  product, 
  variant = 'default', // 'rudraksh', 'spray', 'rashi', 'default'
  size = 'default', // 'default' | 'lg' — larger image, type, and actions
  calculatePricing,
  getReviewCount,
  getEssence,
  onAddToCart
}) => {
  const large = size === 'lg';
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const inWishlist = isInWishlist(product.id);
  // Calculate pricing
  const pricing = calculatePricing ? calculatePricing(product) : pricingFromProduct(product);

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

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use cart context if available, otherwise use prop callback
    if (addToCart) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } else if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className={`bg-white shadow-sm border border-primary overflow-hidden hover:shadow-lg hover:border-primary/80 transition-all duration-300 transform hover:-translate-y-1 flex flex-col ${large ? 'rounded-2xl' : 'rounded-xl'}`}
    >
      {/* Product Image */}
      <div className={`from-gray-50 to-gray-100 overflow-hidden relative group ${large ? 'aspect-square min-h-56 sm:min-h-64 md:min-h-68 lg:min-h-72' : 'aspect-square lg:aspect-4/3'}`}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <span className={large ? 'text-base' : 'text-sm'}>No Image</span>
          </div>
        )}
        {/* Discount Badge */}
        {pricing.discount > 0 && (
          <div className={`absolute bg-black text-white font-bold rounded shadow-lg ${large ? 'top-2 right-2 sm:top-2.5 sm:right-2.5 text-[11px] sm:text-xs md:text-sm px-2 py-1 sm:px-2.5 sm:py-1' : 'top-1 right-1 sm:top-2 sm:right-2 lg:top-3 lg:right-3 text-[9px] sm:text-[10px] lg:text-xs px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2.5 lg:py-1'}`}
          >
            {pricing.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={`bg-white flex-1 flex flex-col ${large ? 'p-3 sm:p-4 md:p-5' : 'p-2 sm:p-2.5 md:p-3 lg:p-4'}`}
      >
        {/* Badges */}
        {badges.length > 0 && (
          <div className={`flex flex-wrap ${large ? 'gap-1 sm:gap-1.5 mb-2 sm:mb-2.5' : 'gap-0.5 sm:gap-1 lg:gap-1.5 mb-1 lg:mb-2'}`}
          >
            {badges.map((badge, index) => {
              // Different badge styles based on type
              let badgeClass = large
                ? 'inline-block px-2 py-1 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs md:text-sm font-semibold rounded border '
                : 'inline-block px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 text-[9px] sm:text-[10px] lg:text-xs font-semibold rounded border ';
              
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
        <h3 className={`font-bold text-gray-900 line-clamp-2 leading-tight ${large ? 'text-sm sm:text-base md:text-lg mb-2 sm:mb-2.5' : 'text-xs sm:text-sm lg:text-base mb-1 lg:mb-2'}`}
        >
          {product.name}
        </h3>

        {/* Short Description - Only on larger screens (lg and above) */}
        {(product.short_description || product.shortDescription) ? (
          <p className={`hidden lg:block text-gray-500 mb-2 line-clamp-2 leading-snug ${large ? 'text-base' : 'text-sm'}`}
          >
            {product.short_description || product.shortDescription}
          </p>
        ) : null}

        {/* Benefits (for Rashi variant) */}
        {variant === 'rashi' && product.benefits && (
          <p className={`hidden sm:block text-gray-600 line-clamp-2 leading-snug italic ${large ? 'text-sm lg:text-base mb-2 sm:mb-3 lg:mb-3' : 'text-xs lg:text-sm mb-1 sm:mb-2 lg:mb-3'}`}
          >
            Benefits: {product.benefits}
          </p>
        )}

        {/* Star Rating */}
        <div className={`flex items-center ${large ? 'gap-1 sm:gap-1.5 mb-2 sm:mb-3' : 'gap-0.5 lg:gap-1 mb-1.5 sm:mb-2 lg:mb-3'}`}
        >
          <div className="flex items-center gap-0.5 sm:gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-primary fill-current ${large ? 'text-xs sm:text-sm md:text-base' : 'text-[9px] sm:text-[10px] lg:text-sm'}`}
              />
            ))}
          </div>
          <span className={`text-gray-500 font-medium ${large ? 'text-xs sm:text-sm ml-1' : 'text-[9px] sm:text-[10px] lg:text-xs ml-0.5 lg:ml-1'}`}
          >
            ({reviewCount})
          </span>
        </div>

        {/* Pricing Section */}
        <div className={`mt-auto border-t border-primary/20 ${large ? 'pt-2 sm:pt-3' : 'pt-1 sm:pt-1.5 lg:pt-2.5'}`}
        >
          <div className={`flex items-stretch ${large ? 'gap-2 sm:gap-3' : 'gap-1 sm:gap-2 lg:gap-3'}`}
          >
            {/* Price and Stock - Left Side */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className={`flex items-baseline ${large ? 'gap-1.5 sm:gap-2 mb-1 sm:mb-1.5' : 'gap-1 sm:gap-1.5 lg:gap-2 mb-0.5 lg:mb-1'}`}
              >
                <span className={`font-bold text-primary truncate ${large ? 'text-sm sm:text-base md:text-lg lg:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-xl'}`}
                >
                  ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                {pricing.discount > 0 && (
                  <span className={`text-gray-400 line-through font-medium hidden sm:inline ${large ? 'text-xs sm:text-sm md:text-base' : 'text-[9px] sm:text-[10px] md:text-xs lg:text-sm'}`}
                  >
                    ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>
              {product.stock > 0 ? (
                <span className={`inline-flex items-center font-semibold text-primary ${large ? 'text-xs sm:text-sm' : 'text-[9px] sm:text-[10px] lg:text-xs'}`}
                >
                  <span className={`bg-primary rounded-full ${large ? 'w-1.5 h-1.5 mr-1 sm:mr-1.5' : 'w-1 h-1 lg:w-1.5 lg:h-1.5 mr-0.5 sm:mr-1 lg:mr-1.5'}`}
                  />
                  <span className="hidden sm:inline">In Stock</span>
                  <span className="sm:hidden">Stock</span>
                </span>
              ) : (
                <span className={`inline-flex items-center font-semibold text-red-600 ${large ? 'text-xs sm:text-sm' : 'text-[9px] sm:text-[10px] lg:text-xs'}`}
                >
                  <span className={`bg-red-500 rounded-full ${large ? 'w-1.5 h-1.5 mr-1 sm:mr-1.5' : 'w-1 h-1 lg:w-1.5 lg:h-1.5 mr-0.5 sm:mr-1 lg:mr-1.5'}`}
                  />
                  <span className="hidden sm:inline">Out of Stock</span>
                  <span className="sm:hidden">No Stock</span>
                </span>
              )}
            </div>

            {/* Heart and Cart Buttons */}
            <div className={`flex items-center ${large ? 'gap-2 sm:gap-2.5' : 'gap-1 sm:gap-2'}`}
            >
              {/* Heart Button */}
              <button
                onClick={handleWishlistClick}
                className={`transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer z-10 hover:scale-110 ${large ? 'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14' : 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12'}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? (
                  <FaHeart className={`text-primary fill-primary ${large ? 'text-sm sm:text-base md:text-lg lg:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-xl'}`} />
                ) : (
                  <FaRegHeart className={`text-primary hover:text-primary/80 ${large ? 'text-sm sm:text-base md:text-lg lg:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-xl'}`} />
                )}
              </button>
              
              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className={`border-2 border-primary text-primary bg-transparent rounded-md sm:rounded-lg hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer z-10 ${large ? 'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14' : 'w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12'}`}
                aria-label="Add to cart"
              >
                <FaShoppingCart className={large ? 'text-sm sm:text-base md:text-lg lg:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-xl'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

