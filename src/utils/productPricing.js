/**
 * Normalize discount from DB/API. Unset (null/undefined/'') → no UI discount.
 * Note: Number(null) is 0 in JS — we must branch before Number().
 */
export function normalizeDiscountPercent(value) {
  if (value === null || value === undefined || value === '') return 0;
  const d = Number(value);
  if (!Number.isFinite(d) || d <= 0) return 0;
  if (d >= 100) return 99;
  return d;
}

/**
 * `price` is the selling (current) price. `discountPercent` from DB (e.g. 25 => original = price / 0.75).
 */
export function calculateProductPricing(price, discountPercent) {
  const p = Number(price);
  if (!Number.isFinite(p) || p < 0) {
    return { currentPrice: 0, originalPrice: 0, discount: 0 };
  }
  const d = normalizeDiscountPercent(discountPercent);
  if (d <= 0) {
    return { currentPrice: p, originalPrice: p, discount: 0 };
  }
  const originalPrice = p / (1 - d / 100);
  return {
    currentPrice: p,
    originalPrice,
    discount: Math.round(d),
  };
}

function discountRawFromProduct(product) {
  return product?.discount_percent ?? product?.discountPercent;
}

export function pricingFromProduct(product) {
  return calculateProductPricing(product?.price, discountRawFromProduct(product));
}

/** Subtotal at list vs sale; only lines with a positive DB discount show savings. */
export function cartDiscountTotals(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { originalTotal: 0, saleTotal: 0, discountAmount: 0 };
  }
  let originalTotal = 0;
  let saleTotal = 0;
  for (const item of cartItems) {
    const q = Number(item.quantity) || 0;
    if (q <= 0) continue;
    const raw = item.discount_percent ?? item.discountPercent;
    const { currentPrice, originalPrice } = calculateProductPricing(item.price, raw);
    saleTotal += currentPrice * q;
    originalTotal += originalPrice * q;
  }
  return {
    originalTotal,
    saleTotal,
    discountAmount: Math.max(0, originalTotal - saleTotal),
  };
}
