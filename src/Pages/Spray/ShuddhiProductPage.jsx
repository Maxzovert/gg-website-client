import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaPlus, FaMinus, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { apiFetch } from '../../config/api';
import { pricingFromProduct } from '../../utils/productPricing';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import Loader from '../../components/Loader';
import shuddhiBg from '../../assets/Sprayelem/shuddhi/shuddhibg.png';
import bigLeave from '../../assets/Sprayelem/shuddhi/bigleave.png';
import smallLeave from '../../assets/Sprayelem/shuddhi/smallleave.png';
import halfLeaf from '../../assets/Sprayelem/shuddhi/half.png';
import soil from '../../assets/Sprayelem/shuddhi/soil.png';
import soilStroke from '../../assets/Sprayelem/shuddhi/soilstroke.png';

const ShuddhiProductPage = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSort, setReviewSort] = useState('recent');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/products?category=Sprays&search=Shuddhi');
        if (!response.ok) throw new Error('Failed to load Shuddhi');
        const result = await response.json();
        const list = Array.isArray(result?.data) ? result.data : [];
        const matched = list.find((item) => `${item?.name || ''}`.toLowerCase().includes('shuddhi')) || list[0] || null;
        if (!matched) return setError('Shuddhi product not found');
        setProduct(matched);
      } catch (_err) {
        setError('Unable to load Shuddhi right now');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const pricing = useMemo(() => (product ? pricingFromProduct(product) : null), [product]);
  const inWishlist = product ? isInWishlist(product.id) : false;
  const productImage = product?.images?.[0] || 'https://via.placeholder.com/1200x900?text=Shuddhi';

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewSort === 'highest') return list.sort((a, b) => b.rating - a.rating);
    if (reviewSort === 'lowest') return list.sort((a, b) => a.rating - b.rating);
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [reviews, reviewSort]);
  const averageRating = sortedReviews.length
    ? (sortedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / sortedReviews.length).toFixed(1)
    : '0.0';

  const fetchReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await apiFetch(`/api/reviews/product/${productId}`);
      const json = await res.json();
      setReviews(json.success && Array.isArray(json.data) ? json.data : []);
    } catch (_err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) fetchReviews(product.id);
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to cart!`);
  };
  const handleWishlist = () => {
    if (!product) return;
    const added = toggleWishlist(product);
    if (added) toast.success(`${product.name} added to wishlist!`);
    else toast.info(`${product.name} removed from wishlist`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!isAuthenticated) return toast.info('Please login to submit your review.');
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating < 1) return toast.error('Please add name, rating, and comment.');
    setReviewSubmitting(true);
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          reviewer_name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        setReviewName('');
        setReviewComment('');
        setReviewRating(0);
        setReviewHover(0);
        await fetchReviews(product.id);
        toast.success('Thank you! Your review has been submitted.');
      } else {
        toast.error(json.message || 'Failed to submit review.');
      }
    } catch (_err) {
      toast.error('Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader size="lg" /></div>;
  if (error || !product || !pricing) {
    return (
      <section className="mx-auto max-w-[1920px] px-4 py-16 text-center sm:px-6 lg:px-10 xl:px-14">
        <h1 className="text-2xl font-bold text-[#486323]">Shuddhi</h1>
        <p className="mt-3 text-gray-600">{error || 'Product not available'}</p>
        <Link to="/sprays" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#597B2C] px-5 py-2.5 text-sm font-semibold text-white">
          <FaArrowLeft />
          Back to Sprays
        </Link>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <img src={shuddhiBg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-white/42" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src={bigLeave} alt="" className="absolute left-0 top-10 hidden w-[280px] opacity-50 lg:block" />
        <img src={smallLeave} alt="" className="absolute right-4 top-20 hidden w-[170px] opacity-50 lg:block" />
        <img src={halfLeaf} alt="" className="absolute left-6 top-[46%] hidden w-[120px] opacity-45 lg:block" />
        <img src={soilStroke} alt="" className="absolute right-10 bottom-16 hidden w-[180px] opacity-40 lg:block" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        <Link to="/sprays" className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#486323]/35 bg-white px-4 py-2 text-sm font-semibold text-[#486323]">
          <FaArrowLeft />
          Back to Sprays
        </Link>

        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,820px)_minmax(0,420px)] xl:items-start xl:justify-center xl:gap-3">
          <div className="min-w-0 space-y-6">
            <div className="mx-auto w-fit overflow-hidden rounded-3xl border border-[#cfe1b8] bg-white/95 p-4">
              <div className="relative overflow-hidden rounded-2xl">
                <img src={halfLeaf} alt="" className="pointer-events-none absolute -left-4 top-10 hidden w-16 opacity-50 md:block" />
                <img src={soil} alt="" className="pointer-events-none absolute -right-6 bottom-0 hidden w-28 opacity-35 md:block" />
                <img src={productImage} alt={product.name} className="mx-auto block h-auto w-full max-w-[760px] object-contain" />
              </div>
            </div>
          </div>

          <aside className="min-w-0">
            <div className="sticky top-24 rounded-3xl border border-[#cfe1b8] bg-white/97 p-5 shadow-[0_12px_30px_rgba(72,99,35,0.18)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#486323]">Aura Spray</p>
              <h1 className="mt-1 text-3xl font-bold text-[#486323]">{product.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f0f8e7] px-3 py-1 text-xs font-semibold text-[#486323]">{product.category || 'Sprays'}</span>
                {product.subcategory ? <span className="rounded-full bg-[#f0f8e7] px-3 py-1 text-xs font-semibold text-[#486323]">{product.subcategory}</span> : null}
              </div>
              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-[#597B2C]" />)}
                <span className="ml-1 text-sm text-gray-500">{averageRating} ({sortedReviews.length})</span>
              </div>
              <p className="mt-4 wrap-break-word text-sm leading-relaxed text-[#4b5e31]">
                {product.short_description || product.shortDescription || 'Shuddhi aura spray for purification, freshness, and clear spiritual ambience.'}
              </p>
              <div className="mt-4 border-t border-[#dfeccf] pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#486323]">₹{pricing.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  {pricing.discount > 0 ? <span className="text-sm text-gray-400 line-through">₹{pricing.originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> : null}
                </div>
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-[#486323]' : 'text-red-600'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#486323]">Quantity</p>
                <div className="inline-flex items-center rounded-xl border border-[#cfe1b8]">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-10 w-10 text-[#486323]"><FaMinus className="mx-auto text-xs" /></button>
                  <span className="min-w-12 text-center font-semibold text-[#486323]">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="h-10 w-10 text-[#486323]"><FaPlus className="mx-auto text-xs" /></button>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button onClick={handleWishlist} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#cfe1b8] text-[#486323]">
                  {inWishlist ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                </button>
                <button onClick={handleAddToCart} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#597B2C] px-5 py-3 text-sm font-semibold text-white">
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-[#cfe1b8] bg-white/97 p-4 shadow-[0_12px_30px_rgba(72,99,35,0.16)]">
                <div className="mb-2 flex items-center gap-2 text-[#486323]"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f8e7]"><FaLeaf /></span><h3 className="text-sm font-bold">Benefits</h3></div>
                <p className="wrap-break-word text-sm leading-relaxed text-[#4b5e31]">{product.benefits || 'Supports purification, freshness, and positive spiritual flow.'}</p>
              </div>
              <div className="rounded-3xl border border-[#cfe1b8] bg-white/97 p-4 shadow-[0_12px_30px_rgba(72,99,35,0.16)]">
                <div className="mb-2 flex items-center gap-2 text-[#486323]"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f8e7]"><FaTruck /></span><h3 className="text-sm font-bold">Delivery</h3></div>
                <p className="wrap-break-word text-sm leading-relaxed text-[#4b5e31]">Fast dispatch with secure packaging to preserve fragrance profile.</p>
              </div>
              <div className="rounded-3xl border border-[#cfe1b8] bg-white/97 p-4 shadow-[0_12px_30px_rgba(72,99,35,0.16)]">
                <div className="mb-2 flex items-center gap-2 text-[#486323]"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f8e7]"><FaShieldAlt /></span><h3 className="text-sm font-bold">Quality Promise</h3></div>
                <p className="wrap-break-word text-sm leading-relaxed text-[#4b5e31]">Consistent aroma profile for daily rituals and mindful routines.</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-6 grid max-w-[1500px] grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#cfe1b8] bg-white/95 p-6 shadow-[0_10px_24px_rgba(72,99,35,0.12)]">
            <div className="mb-4 border-b border-[#dfeccf] pb-3">
              <h3 className="text-2xl font-bold text-[#486323]">Product Information</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#70865a]">Details and Specifications</p>
            </div>
            <div className="rounded-xl bg-[#f6fcea] p-4">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#70865a]">Description</p>
              <p className="wrap-break-word text-base leading-relaxed text-[#4b5e31]">{product.description || product.short_description || 'A purifying aura spray designed to refresh and uplift your space.'}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-[#cfe1b8] bg-white/95 p-6 shadow-[0_10px_24px_rgba(72,99,35,0.12)]">
            <div className="mb-4 border-b border-[#dfeccf] pb-3">
              <h3 className="text-2xl font-bold text-[#486323]">How to Use</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#70865a]">Simple Ritual Steps</p>
            </div>
            <ol className="space-y-3 wrap-break-word text-base text-[#4b5e31]">
              <li className="rounded-xl bg-[#f6fcea] p-3"><span className="font-semibold text-[#486323]">Step 1:</span> Spray 2-3 pumps in room, aura, or meditation space.</li>
              <li className="rounded-xl bg-[#f6fcea] p-3"><span className="font-semibold text-[#486323]">Step 2:</span> Breathe deeply and invite freshness and clarity.</li>
              <li className="rounded-xl bg-[#f6fcea] p-3"><span className="font-semibold text-[#486323]">Step 3:</span> Reuse before prayer, yoga, journaling, or sleep.</li>
            </ol>
          </div>
        </div>

        <section className="relative mx-auto mt-6 max-w-[1500px] rounded-3xl border border-[#cfe1b8] bg-white/97 p-6">
          <img src={bigLeave} alt="" className="pointer-events-none absolute -right-10 -top-8 hidden w-52 opacity-[0.14] lg:block" />
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#486323]">Customer Reviews</h3>
              <p className="text-sm text-[#4b5e31]">{averageRating} average rating from {sortedReviews.length} review{sortedReviews.length === 1 ? '' : 's'}</p>
            </div>
            <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="rounded-lg border border-[#cfe1b8] bg-white px-3 py-2 text-sm text-[#486323] outline-none">
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-[#cfe1b8] bg-[#f8fdef] p-4">
            <p className="mb-3 text-sm font-semibold text-[#486323]">Write a review</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your Name" className="rounded-lg border border-[#cfe1b8] bg-white px-3 py-2 text-sm outline-none" />
              <div className="flex items-center gap-1 rounded-lg border border-[#cfe1b8] bg-white px-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                    <FaStar className={(reviewHover || reviewRating) >= star ? 'text-[#597B2C]' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} placeholder="Share your experience with Shuddhi..." className="mt-3 w-full rounded-lg border border-[#cfe1b8] bg-white px-3 py-2 text-sm outline-none" />
            <button type="submit" disabled={reviewSubmitting} className="mt-3 rounded-lg bg-[#597B2C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {reviewsLoading ? (
            <div className="flex justify-center py-4"><Loader /></div>
          ) : sortedReviews.length === 0 ? (
            <p className="text-sm text-[#4b5e31]">No reviews yet. Be the first to review this spray.</p>
          ) : (
            <div className="space-y-3">
              {sortedReviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-[#dfeccf] bg-white p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#486323]">{r.reviewer_name || 'Verified Buyer'}</p>
                    <p className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''}</p>
                  </div>
                  <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={Number(r.rating) >= star ? 'text-[#597B2C]' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="wrap-break-word text-sm leading-relaxed text-[#4b5e31]">{r.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default ShuddhiProductPage;
