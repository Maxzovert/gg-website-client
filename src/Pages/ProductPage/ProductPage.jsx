import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCompass,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useToast } from "../../components/Toaster";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import CheckoutModal from "../../components/CheckoutModal";
import ProductCard from "../../components/ProductCard";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, userId, loading: authLoading } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [elementImages, setElementImages] = useState([]);
  const [benefitImages, setBenefitImages] = useState([]);
  const [staticImagesLoading, setStaticImagesLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // Map API category name to app route for breadcrumbs
  const categoryToPath = {
    Rudrakshas: "/rudraksha",
    Rudraksha: "/rudraksha",
    Sprays: "/sprays",
    Rashi: "/rashi",
    Accessories: "/accessories",
  };

  // Rashi → recommended Rudraksha Mukhi (matches Rashi page logic)
  const rashiToRudrakshaMapping = {
    Aries: ["1 Mukhi", "3 Mukhi", "11 Mukhi"],
    Taurus: ["2 Mukhi", "6 Mukhi", "14 Mukhi"],
    Gemini: ["3 Mukhi", "5 Mukhi", "12 Mukhi"],
    Cancer: ["2 Mukhi", "4 Mukhi", "7 Mukhi"],
    Leo: ["1 Mukhi", "5 Mukhi", "9 Mukhi"],
    Virgo: ["6 Mukhi", "10 Mukhi", "14 Mukhi"],
    Libra: ["2 Mukhi", "7 Mukhi", "11 Mukhi"],
    Scorpio: ["3 Mukhi", "8 Mukhi", "13 Mukhi"],
    Sagittarius: ["4 Mukhi", "9 Mukhi", "12 Mukhi"],
    Capricorn: ["6 Mukhi", "10 Mukhi", "14 Mukhi"],
    Aquarius: ["5 Mukhi", "11 Mukhi", "13 Mukhi"],
    Pisces: ["4 Mukhi", "7 Mukhi", "12 Mukhi"],
  };

  const SUPABASE_STORAGE_BASE = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const buildStaticImgUrl = (folder, file_name) =>
    SUPABASE_STORAGE_BASE
      ? `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/GGIMG/StaticImg/${encodeURIComponent(folder)}/${encodeURIComponent(file_name)}`
      : null;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Fetch Elements and Benifits static images when product is loaded (for rudraksha matching)
  useEffect(() => {
    if (!product) return;

    const fetchStaticImages = async () => {
      setStaticImagesLoading(true);
      try {
        const [elementsRes, benefitsRes] = await Promise.all([
          fetch(`${API_URL}/api/static-images?folder=Elements`),
          fetch(`${API_URL}/api/static-images?folder=Benifits`),
        ]);
        const elementsData = elementsRes.ok ? await elementsRes.json() : [];
        const benefitsData = benefitsRes.ok ? await benefitsRes.json() : [];

        const withUrls = (items) =>
          (items || []).map((item) => ({
            ...item,
            url: item.url || buildStaticImgUrl(item.folder, item.file_name),
          }));

        setElementImages(withUrls(elementsData));
        setBenefitImages(withUrls(benefitsData));
      } catch (err) {
        console.error("Error fetching element/benefit images:", err);
      } finally {
        setStaticImagesLoading(false);
      }
    };

    fetchStaticImages();
  }, [product?.id, API_URL]);

  // Fetch related products (same category, exclude current)
  useEffect(() => {
    if (!product?.category) return;

    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/products?category=${encodeURIComponent(product.category)}`
        );
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && result.data ? result.data : [];
        const related = list
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [product?.id, product?.category, API_URL]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/products/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product");
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        setProduct(result.data);
        // Reset image index when product changes
        setSelectedImageIndex(0);
      } else {
        setError("Failed to load product");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
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
      discount: discountPercent,
    };
  };

  const getReviewCount = (productId) => {
    return 5 + (productId % 3);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (authLoading) {
      toast.info('Please wait, checking authentication...');
      return;
    }
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    // Add to cart first if not already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    if (!existingItem) {
      addToCart(product, quantity);
    }
    // Open checkout modal
    setShowCheckout(true);
  };
  
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} removed from wishlist`);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
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
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Product not found"}
          </h2>
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

  // Derive possible keys to match rudraksha with element/benefit images (e.g. "1 Mukhi" or "1")
  const getMatchKeys = () => {
    const keys = [];
    const sub = (product.subcategory || "").trim();
    const name = (product.name || "").trim();
    if (sub) keys.push(sub, sub.toLowerCase());
    const numMatch = (sub || name).match(/^(\d+)|(\d+)\s*[Mm]ukhi|(\d+)\s*[Ee]lement/);
    const num = numMatch && (numMatch[1] || numMatch[2] || numMatch[3]);
    if (num) keys.push(num, `${num}E`);
    return keys;
  };

  const matchKeys = getMatchKeys();
  const matchedElementImage = elementImages.find((img) =>
    matchKeys.some((k) => String(img.key).toLowerCase() === String(k).toLowerCase())
  );
  const matchedBenefitImage = benefitImages.find((img) =>
    matchKeys.some((k) => String(img.key).toLowerCase() === String(k).toLowerCase())
  );
  const showElementOrBenefit = Boolean(matchedElementImage || matchedBenefitImage);

  // For Rudraksha: which Rashis recommend this product (by matching mukhi in subcategory/name)
  const isRudraksha = product.category === "Rudraksha" || product.category === "Rudrakshas";
  const getRashisForThisProduct = () => {
    if (!isRudraksha) return [];
    const text = `${product.subcategory || ""} ${product.name || ""}`.toLowerCase();
    const rashis = [];
    Object.entries(rashiToRudrakshaMapping).forEach(([rashi, mukhis]) => {
      const matches = mukhis.some((m) => {
        const mLower = m.toLowerCase();
        const num = m.replace(/\s*mukhi$/i, "").trim();
        return (
          text.includes(mLower) ||
          text.includes(num + " mukhi") ||
          text.includes(num + "mukhi")
        );
      });
      if (matches) rashis.push(rashi);
    });
    return rashis;
  };
  const recommendedRashis = getRashisForThisProduct();

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-2 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          {product.category && categoryToPath[product.category] ? (
            <>
              <Link
                to={categoryToPath[product.category]}
                className="hover:text-primary transition-colors capitalize"
              >
                {product.category}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          ) : null}
          <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-none" title={product.name}>
            {product.name}
          </span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left: Image Gallery + Element & Benefits images (vertical, no text) */}
          <div className="flex flex-col gap-4 sm:gap-6">
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
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image + Element & Benefits – same width (flex-1), same box style */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0">
                {/* Main Image */}
                <div className="relative aspect-4/3 max-h-[700px] w-full bg-gray-100 rounded-xl overflow-hidden border-2 border-primary/20 group">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={product.images[selectedImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x600?text=No+Image";
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
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Product Name with Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex-1">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistToggle}
                className="p-2 sm:p-3 transition-all hover:scale-110 shrink-0"
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(product.id) ? (
                  <FaHeart className="text-2xl sm:text-3xl text-primary fill-primary" />
                ) : (
                  <FaRegHeart className="text-2xl sm:text-3xl text-primary hover:text-primary/80" />
                )}
              </button>
            </div>

            {/* Star Rating and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-primary text-base sm:text-lg fill-current"
                  />
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
                  ₹
                  {pricing.currentPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="text-lg sm:text-xl text-gray-400 line-through font-medium">
                  ₹
                  {pricing.originalPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-bold rounded">
                  {pricing.discount}% OFF
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                You save ₹
                {(pricing.originalPrice - pricing.currentPrice).toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}
              </p>
            </div>

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

            {/* Recommended for Rashis (Rudraksha only) */}
            {isRudraksha && recommendedRashis.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 py-2">
                <span className="text-sm font-semibold text-gray-700">Recommended for:</span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedRashis.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/30 rounded-md text-xs font-semibold"
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">(by Rashi)</span>
              </div>
            )}

            {/* Short Description */}
            {product.short_description && (
              <div className="pb-4 border-b border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {product.short_description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700">
                Quantity:
              </label>
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
            </div>

            {/* Buy Now and Add to Cart Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <FaShoppingCart className="text-xl" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Trust / Delivery info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaTruck className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaShieldAlt className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <FaUndo className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">Hassle-free returns</p>
                </div>
              </div>
            </div>

            {/* Check your Rashi – CTA to find Rashi and buy according to it */}
            <Link
              to="/rashi"
              className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border-2 border-primary/30 bg-linear-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/50 transition-all group"
            >
              <div className="p-3 rounded-full bg-primary/20 text-primary shrink-0 group-hover:scale-105 transition-transform">
                <FaCompass className="text-2xl sm:text-3xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-0.5">
                  Find your Rashi & choose the right Rudraksha
                </h3>
                <p className="text-sm text-gray-600">
                  Not sure which Rudraksha suits you? Check your Rashi (zodiac sign) and get personalized recommendations to buy the best Rudraksha for you.
                </p>
              </div>
              <span className="text-primary font-semibold text-sm sm:text-base shrink-0 group-hover:underline">
                Check Rashi →
              </span>
            </Link>

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  Product Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-3">
                  Benefits
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.benefits}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              You may also like
            </h2>
            {relatedLoading ? (
              <div className="flex justify-center py-12">
                <Loader size="md" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="default"
                    calculatePricing={calculatePricing}
                    getReviewCount={getReviewCount}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalAmount={calculateTotalAmount()}
        userId={userId}
      />
    </div>
  );
};

export default ProductPage;
