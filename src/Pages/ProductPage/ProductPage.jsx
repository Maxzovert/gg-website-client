import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loader from '../../components/Loader';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product');
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        setProduct(result.data);
        // Reset image index when product changes
        setSelectedImageIndex(0);
      } else {
        setError('Failed to load product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = (price) => {
    const discountPercent = 25;
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice: originalPrice,
      discount: discountPercent
    };
  };

  const getReviewCount = (productId) => {
    return 5 + (productId % 3);
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product, quantity);
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality (redirect to checkout)
    console.log('Buy now:', product, quantity);
    alert(`Proceeding to checkout with ${quantity} ${product.name}!`);
    // In the future, this would navigate to checkout page
    // navigate('/checkout', { state: { product, quantity } });
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > (product?.stock || 1)) return product?.stock || 1;
      return newQuantity;
    });
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product not found'}</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing(product.price);
  const reviewCount = getReviewCount(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            {/* Thumbnail Images - Left Side on Desktop, Below on Mobile */}
            {hasMultipleImages && (
              <div className="flex flex-row md:flex-col gap-2 sm:gap-3 shrink-0 justify-center md:justify-start order-2 md:order-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-primary/20 group order-1 md:order-2">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />
                  {/* Image Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-black text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded shadow-lg">
                    {pricing.discount}% OFF
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-lg">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Star Rating and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-primary text-base sm:text-lg fill-current" />
                ))}
              </div>
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                {reviewCount} Reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="space-y-2 pb-2 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  ₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                  ₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded">
                  {pricing.discount}% OFF
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                You save ₹{(pricing.originalPrice - pricing.currentPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center text-sm sm:text-base font-semibold text-primary">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center text-sm sm:text-base font-semibold text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div className="pb-4 border-b border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {product.short_description}
                </p>
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.subcategory && (
                <span className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-xs sm:text-sm font-semibold">
                  {product.subcategory}
                </span>
              )}
              {product.deity && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs sm:text-sm font-semibold">
                  {product.deity}
                </span>
              )}
              {product.planet && (
                <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs sm:text-sm font-semibold">
                  {product.planet}
                </span>
              )}
              {product.rarity && (
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs sm:text-sm font-semibold">
                  {product.rarity}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center border-2 border-primary rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 sm:px-4 py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold text-gray-900 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="px-3 sm:px-4 py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buy Now and Add to Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <FaShoppingCart className="text-xl" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Product Description</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">Benefits</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.benefits}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
