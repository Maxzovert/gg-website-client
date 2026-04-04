import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { apiFetch } from '../../config/api.js';

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SUGGESTIONS_COUNT = 8;

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

  const calculatePricing = useCallback((price) => {
    const discountPercent = 25;
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice,
      discount: discountPercent,
    };
  }, []);

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
  const totalWithBlessing = totalPrice + (hasRudrakshaInCart ? blessingCharge : 0);
  const shippingCharges = totalPrice > 1000 ? 0 : 50;
  const walletAppliedAmount = useWallet
    ? Math.min(walletToUse || walletBalance, walletBalance, totalWithBlessing + shippingCharges)
    : 0;
  const payableAfterWallet = Math.max(0, totalWithBlessing + shippingCharges - walletAppliedAmount);
  const discountPercent = 25;
  const originalTotal = totalPrice / (1 - discountPercent / 100);
  const discountAmount = originalTotal - totalPrice;

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

  const showEmptyCart = cartItems.length === 0 && !showCheckout;

  if (showEmptyCart) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-linear-to-br from-orange-50/30 to-white">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            className="mb-6 sm:mb-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FaShoppingCart className="text-6xl sm:text-8xl text-gray-300 mb-6" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg"
            >
              Start Shopping
            </Link>
          </div>

          <CartMoreProductsSection
            loading={suggestionsLoading}
            products={suggestedProducts}
            calculatePricing={calculatePricing}
            getReviewCount={getReviewCount}
            sectionClassName="mt-12 sm:mt-16 pt-8 w-full text-left"
          />
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="mb-4 sm:mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Shopping Cart
            </h1>
            <button
              onClick={handleClearCart}
              className="text-sm sm:text-base text-red-600 hover:text-red-700 font-medium transition-colors"
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
          <div className="lg:col-span-2 space-y-2 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md border border-primary/20 p-2 sm:p-4 md:p-6 flex gap-2 sm:gap-4"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0"
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
                      to={`/product/${item.id}`}
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
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                      ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  {/* Quantity Controls and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                    <div className="flex items-center border-2 border-primary rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-base md:text-lg font-semibold text-gray-900 min-w-8 sm:min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Item Total - Hidden on very small screens */}
                    <div className="text-right hidden xs:block">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-primary/20 p-3 sm:p-4 md:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{originalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Discount (25%)</span>
                  <span className="text-green-600 font-semibold">
                    -₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
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
                <div className="border-t border-gray-200 pt-2 sm:pt-3 md:pt-4">
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
                  <p className="text-xs text-gray-500 mt-1">
                    You save ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
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
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl mb-2 sm:mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block w-full text-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all font-semibold text-xs sm:text-sm md:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <CartMoreProductsSection
          loading={suggestionsLoading}
          products={suggestedProducts}
          calculatePricing={calculatePricing}
          getReviewCount={getReviewCount}
          sectionClassName="mt-10 sm:mt-14 pt-8 sm:pt-10"
        />
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalAmount={totalPrice}
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
