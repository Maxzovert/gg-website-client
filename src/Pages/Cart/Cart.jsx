import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaTag, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';
import { pricingFromProduct, cartDiscountTotals } from '../../utils/productPricing';

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SUGGESTIONS_COUNT = 8;
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 97) % 100}%`,
  delay: `${(index % 8) * 0.08}s`,
  duration: `${1.2 + (index % 5) * 0.2}s`,
  rotation: `${(index * 37) % 360}deg`,
}));

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const toPaise = (value) => Math.round(Number(value || 0) * 100);
const meetsMinimumOrder = (subtotal, minimum) => {
  const min = Number(minimum || 0);
  const sub = Number(subtotal || 0);
  if (Number.isInteger(min)) {
    return Math.round(sub) >= min;
  }
  return toPaise(sub) >= toPaise(min);
};

function getCouponHeadline(coupon) {
  if (!coupon) return '';
  return String(coupon.discount_type).toLowerCase() === 'percentage'
    ? `${coupon.discount_value}% OFF`
    : `${formatMoney(coupon.discount_value)} OFF`;
}

function isCouponLive(coupon) {
  if (!coupon) return false;
  if (coupon.is_currently_valid !== undefined && coupon.is_currently_valid !== null) {
    return Boolean(coupon.is_currently_valid);
  }
  const now = Date.now();
  const start = coupon.start_date ? new Date(coupon.start_date).getTime() : null;
  const end = coupon.expiry_date ? new Date(coupon.expiry_date).getTime() : null;
  return (!start || now >= start) && (!end || now <= end);
}

function CartMoreProductsSection({ loading, products, calculatePricing, getReviewCount, sectionClassName = '' }) {
  if (!loading && products.length === 0) return null;
  return (
    <section className={`border-t border-gray-200 ${sectionClassName}`}>
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Add more products to your cart
      </h2>
      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <Loader size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((p) => (
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
  );
}

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    includeBlessing,
    setIncludeBlessing,
    blessingCharge,
    OPTIONAL_BLESSING_CHARGE,
  } = useCart();
  const toast = useToast();
  const { isAuthenticated, userId, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletToUse, setWalletToUse] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [privateCouponCode, setPrivateCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponCelebration, setShowCouponCelebration] = useState(false);

  const getReviewCount = useCallback((productId) => {
    const n = Number(productId);
    if (Number.isFinite(n)) return 5 + (n % 3);
    return 5 + (String(productId).length % 3);
  }, []);

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    clearCart();
    toast.success('Cart cleared');
  };

  const totalPrice = getTotalPrice();
  const hasRudrakshaInCart = cartItems.some((item) => {
    const category = String(item.category || '').toLowerCase();
    const name = String(item.name || '').toLowerCase();
    const subcategory = String(item.subcategory || '').toLowerCase();
    return (
      category.includes('rudraksha') ||
      name.includes('rudraksha') ||
      subcategory.includes('mukhi')
    );
  });
  const couponDiscount = Number(appliedCoupon?.discount_amount || 0);
  const subtotalAfterCoupon = Math.max(0, totalPrice - couponDiscount);
  const totalWithBlessing = subtotalAfterCoupon + (hasRudrakshaInCart ? blessingCharge : 0);
  const shippingCharges = totalPrice > 1000 ? 0 : 50;
  const walletAppliedAmount = useWallet
    ? Math.min(walletToUse || walletBalance, walletBalance, totalWithBlessing + shippingCharges)
    : 0;
  const payableAfterWallet = Math.max(0, totalWithBlessing + shippingCharges - walletAppliedAmount);
  const { originalTotal, discountAmount } = cartDiscountTotals(cartItems);
  const selectedCoupon = availableCoupons.find((coupon) => coupon.code === selectedCouponCode) || null;
  const selectedCouponMinAmount = Number(selectedCoupon?.minimum_order_amount || 0);
  const selectedCouponMeetsMinimum =
    !selectedCoupon || meetsMinimumOrder(totalPrice, selectedCouponMinAmount);
  const selectedCouponMissingAmount = Math.max(0, selectedCouponMinAmount - totalPrice);
  const selectedCouponIsLive = !selectedCoupon || isCouponLive(selectedCoupon);

  useEffect(() => {
    if (!hasRudrakshaInCart && includeBlessing) {
      setIncludeBlessing(false);
    }
  }, [hasRudrakshaInCart, includeBlessing, setIncludeBlessing]);

  useEffect(() => {
    const fetchWalletAndCampaigns = async () => {
      if (!isAuthenticated) {
        setWalletBalance(0);
        setUseWallet(false);
        setWalletToUse(0);
        setActiveCampaigns([]);
        return;
      }
      try {
        const [walletRes, campaignsRes] = await Promise.all([
          apiFetch('/api/wallet/balance'),
          apiFetch('/api/cashback-campaigns/active'),
        ]);
        const walletJson = await walletRes.json().catch(() => ({}));
        const campaignsJson = await campaignsRes.json().catch(() => ({}));
        setWalletBalance(Number(walletJson?.data?.balance || 0));
        setActiveCampaigns(Array.isArray(campaignsJson?.data) ? campaignsJson.data : []);
      } catch (_error) {
        setWalletBalance(0);
      }
    };
    fetchWalletAndCampaigns();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await apiFetch('/api/coupons/public');
        const data = await res.json().catch(() => ({}));
        setAvailableCoupons(Array.isArray(data?.data) ? data.data : []);
      } catch (_error) {
        setAvailableCoupons([]);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const res = await apiFetch('/api/products?limit=100');
        const result = res.ok ? await res.json() : { data: [] };
        const list = result.success && Array.isArray(result.data) ? result.data : [];
        if (cancelled) return;
        const cartIds = new Set(cartItems.map((i) => String(i.id)));
        const candidates = list.filter((p) => p?.id != null && !cartIds.has(String(p.id)));
        shuffleInPlace(candidates);
        setSuggestedProducts(candidates.slice(0, SUGGESTIONS_COUNT));
      } catch {
        if (!cancelled) setSuggestedProducts([]);
      } finally {
        if (!cancelled) setSuggestionsLoading(false);
      }
    };
    loadSuggestions();
    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  useEffect(() => {
    setAppliedCoupon(null);
    setSelectedCouponCode('');
    setPrivateCouponCode('');
  }, [cartItems, totalPrice]);

  const applyCouponByCode = async (couponCode) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/cart' } } });
      return;
    }
    setCouponLoading(true);
    try {
      const payloadItems = cartItems.map((item) => ({
        product_id: item.id,
        product_price: item.price,
        quantity: item.quantity,
      }));
      const res = await apiFetch('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code: couponCode,
          items: payloadItems,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Failed to apply coupon');
      }
      setAppliedCoupon({
        code: data.data.code,
        discount_amount: Number(data.data.discount_amount || 0),
      });
      setShowCouponCelebration(true);
      setTimeout(() => setShowCouponCelebration(false), 1800);
      setPrivateCouponCode(data.data.code || '');
      setSelectedCouponCode(data.data.code || selectedCouponCode);
      toast.success(`Coupon ${data.data.code} applied`);
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!selectedCouponCode) {
      toast.info('Please select a coupon first');
      return;
    }
    if (selectedCoupon && !selectedCouponMeetsMinimum) {
      toast.error(
        `Minimum purchase for ${selectedCoupon.code} is ₹${selectedCouponMinAmount.toLocaleString('en-IN')}`,
      );
      return;
    }
    if (selectedCoupon && !selectedCouponIsLive) {
      toast.error('This coupon is not active yet or already expired');
      return;
    }
    await applyCouponByCode(selectedCouponCode);
  };

  const handleApplyPrivateCoupon = async () => {
    const code = String(privateCouponCode || '').trim().toUpperCase();
    if (!code) {
      toast.info('Please enter a coupon code');
      return;
    }
    await applyCouponByCode(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPrivateCouponCode('');
    toast.success('Coupon removed');
  };

  const showEmptyCart = cartItems.length === 0 && !showCheckout;

  if (showEmptyCart) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-linear-to-br from-amber-50 via-white to-orange-50/40">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="rounded-2xl border border-primary/10 bg-white/80 backdrop-blur-sm shadow-lg flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <FaShoppingCart className="text-6xl sm:text-8xl text-primary/20 mb-6" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg shadow-md"
            >
              Start Shopping
            </Link>
          </div>

          <CartMoreProductsSection
            loading={suggestionsLoading}
            products={suggestedProducts}
            calculatePricing={pricingFromProduct}
            getReviewCount={getReviewCount}
            sectionClassName="mt-12 sm:mt-16 pt-8 w-full text-left"
          />
        </div>
      </div>
    );
  }

  return (
    <>
    {showCouponCelebration && (
      <div className="pointer-events-none fixed inset-0 z-100 overflow-hidden">
        {CONFETTI_PIECES.map((piece) => (
          <span
            key={piece.id}
            className="cart-confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              transform: `rotate(${piece.rotation})`,
            }}
          />
        ))}
      </div>
    )}
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-[#f7f7fb] via-white to-[#fff6ec]">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 rounded-3xl border border-black/5 bg-white/90 backdrop-blur-md shadow-[0_10px_40px_rgba(17,24,39,0.06)] p-4 sm:p-6">
          <Link
            to="/"
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold text-sm"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Review your items and checkout securely.
              </p>
            </div>
            <button
              onClick={handleClearCart}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-semibold transition-colors border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg bg-red-50/50"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Free shipping unlocked above ₹1000</span>
                <span className={`font-semibold ${totalPrice > 1000 ? 'text-emerald-600' : 'text-primary'}`}>
                  {totalPrice > 1000 ? 'Unlocked' : `₹${Math.max(0, 1000 - totalPrice).toLocaleString('en-IN')} away`}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-orange-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalPrice / 1000) * 100)}%` }}
                />
              </div>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-black/5 p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 hover:shadow-[0_14px_36px_rgba(17,24,39,0.08)] transition-all"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.slug || item.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-black/5"
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug || item.id}`}
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 hover:text-primary transition-colors mb-1 block line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.subcategory && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-1">
                        {item.subcategory}
                        {item.deity && ` • ${item.deity}`}
                        {item.planet && ` • ${item.planet}`}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                        ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <span className="text-[11px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        per item
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-base md:text-lg font-semibold text-gray-900 min-w-8 sm:min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-xl"
                        disabled={item.quantity >= item.stock}
                      >
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Item Total - Hidden on very small screens */}
                    <div className="text-right hidden xs:block min-w-20">
                      <p className="text-[11px] sm:text-xs text-gray-500">Item total</p>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-1.5 sm:p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 opacity-80 group-hover:opacity-100"
                      aria-label="Remove item"
                    >
                      <FaTrash className="text-sm sm:text-base md:text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_16px_36px_rgba(17,24,39,0.09)] border border-black/5 p-3 sm:p-4 md:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{originalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                    <span>Product discount</span>
                    <span className="text-green-600 font-semibold">
                      -₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCharges === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      `₹${shippingCharges.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                    )}
                  </span>
                </div>
                {availableCoupons.length > 0 && (
                  <div className="rounded-xl border border-black/10 bg-linear-to-br from-white to-amber-50/70 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-primary text-sm" />
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">Coupons & offers</p>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500">{availableCoupons.length} available</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {availableCoupons.map((coupon) => {
                        const isSelected = selectedCouponCode === coupon.code;
                        const minAmount = Number(coupon.minimum_order_amount || 0);
                        const meetsMin = totalPrice >= minAmount;
                        const isLive = isCouponLive(coupon);
                        return (
                          <div
                            key={coupon.id}
                            className={`rounded-lg border transition ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 bg-white hover:border-primary/40'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedCouponCode(coupon.code)}
                              className="text-left w-full p-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900">{coupon.code}</p>
                                  <p className="text-[11px] sm:text-xs text-gray-600">{getCouponHeadline(coupon)}</p>
                                </div>
                                <span
                                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                    !isLive
                                      ? 'bg-amber-100 text-amber-700'
                                      : meetsMin
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-600'
                                  }`}
                                >
                                  {!isLive ? 'Not live' : meetsMin ? 'Eligible' : `Min ${formatMoney(minAmount)}`}
                                </span>
                              </div>
                            </button>

                            {isSelected && (
                              <div className="border-t border-gray-200 bg-white p-2 text-[11px] sm:text-xs text-gray-700">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                  <p>Offer: <span className="font-semibold">{getCouponHeadline(coupon)}</span></p>
                                  <p>Min order: <span className="font-semibold">{formatMoney(minAmount)}</span></p>
                                  <p>
                                    Max off:{' '}
                                    <span className="font-semibold">
                                      {coupon.maximum_discount != null
                                        ? formatMoney(coupon.maximum_discount)
                                        : 'No cap'}
                                    </span>
                                  </p>
                                  <p>
                                    Valid till:{' '}
                                    <span className="font-semibold">
                                      {coupon.expiry_date
                                        ? new Date(coupon.expiry_date).toLocaleDateString('en-IN')
                                        : 'No expiry'}
                                    </span>
                                  </p>
                                </div>
                                {selectedCoupon && !selectedCouponMeetsMinimum && (
                                  <p className="text-red-600 font-semibold mt-2">
                                    Add {formatMoney(selectedCouponMissingAmount)} more to unlock this coupon.
                                  </p>
                                )}
                                {selectedCoupon && !selectedCouponIsLive && (
                                  <p className="text-amber-700 font-semibold mt-2">
                                    This coupon is not active for current date/time.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex gap-2">
                      {!appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !selectedCouponCode || !selectedCouponMeetsMinimum || !selectedCouponIsLive}
                          className="flex-1 px-3 py-2 rounded-lg bg-linear-to-r from-primary to-orange-400 text-white text-xs sm:text-sm disabled:opacity-50 font-semibold shadow-sm"
                        >
                          {couponLoading ? 'Applying...' : 'Apply selected coupon'}
                        </button>
                      ) : (
                        <>
                          <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-2">
                            <FaCheckCircle className="shrink-0" />
                            {appliedCoupon.code} saved {formatMoney(couponDiscount)}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-3 py-2 rounded-lg border border-red-300 text-red-600 text-xs sm:text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                    {!appliedCoupon && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        <p className="text-[11px] sm:text-xs text-gray-600 font-medium mb-2">
                          Have a coupon code?
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={privateCouponCode}
                            onChange={(e) => setPrivateCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter Coupon code"
                            className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPrivateCoupon}
                            disabled={couponLoading || !String(privateCouponCode || '').trim()}
                            className="px-3 py-2 rounded-lg border border-primary text-primary text-xs sm:text-sm disabled:opacity-50 font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 sm:pt-3 md:pt-4">
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600 mb-2">
                      <span>Coupon discount ({appliedCoupon.code})</span>
                      <span className="text-green-600 font-semibold">
                        -₹{couponDiscount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  {hasRudrakshaInCart && (
                    <>
                      <label className="mb-2 sm:mb-3 flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeBlessing}
                          onChange={(e) => setIncludeBlessing(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-primary shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">
                          Add Special Blessing Service (+₹{OPTIONAL_BLESSING_CHARGE})
                        </span>
                      </label>
                      {includeBlessing && (
                        <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600 mb-2">
                          <span>Blessing Service</span>
                          <span>₹{blessingCharge.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </>
                  )}
                  {isAuthenticated && walletBalance > 0 && (
                    <div className="mb-2 rounded-md border border-emerald-200 bg-emerald-50 p-2">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => {
                            setUseWallet(e.target.checked);
                            if (e.target.checked) setWalletToUse(walletBalance);
                          }}
                          className="mt-0.5 h-4 w-4 accent-primary shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">
                          Apply wallet money (Available: ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })})
                        </span>
                      </label>
                      {useWallet && (
                        <div className="mt-1 flex justify-between text-xs sm:text-sm text-emerald-700">
                          <span>Wallet deduction</span>
                          <span>-₹{walletAppliedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                      ₹{payableAfterWallet.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      You save ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (cartItems.length === 0) {
                    toast.info('Your cart is empty. Add items to proceed to checkout.');
                    return;
                  }
                  if (!isAuthenticated) {
                    navigate('/auth', { state: { from: { pathname: '/cart' } } });
                    return;
                  }
                  setShowCheckout(true);
                }}
                disabled={cartItems.length === 0}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-primary to-orange-400 text-white rounded-xl hover:brightness-95 transition-all font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl mb-2 sm:mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block w-full text-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/10 transition-all font-semibold text-xs sm:text-sm md:text-base"
              >
                Continue Shopping
              </Link>
              <p className="text-[11px] sm:text-xs text-gray-500 text-center mt-3">
                Secure checkout • Trusted payment gateway • Easy returns
              </p>
            </div>
          </div>
        </div>

        <CartMoreProductsSection
          loading={suggestionsLoading}
          products={suggestedProducts}
          calculatePricing={pricingFromProduct}
          getReviewCount={getReviewCount}
          sectionClassName="mt-10 sm:mt-14 pt-8 sm:pt-10"
        />
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalAmount={totalPrice}
        couponCode={appliedCoupon?.code || null}
        couponDiscount={couponDiscount}
        blessingCharge={hasRudrakshaInCart ? blessingCharge : 0}
        walletBalance={walletBalance}
        useWallet={useWallet}
        walletAmountToUse={walletAppliedAmount}
        userId={userId}
        userEmail={user?.email}
        userName={user?.full_name}
      />
    </div>
    </>
  );
};

export default Cart;
