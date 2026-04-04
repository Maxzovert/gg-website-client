/**
 * Normalize discount from DB/API: 0 means no display discount; cap below 100 to avoid divide-by-zero.
 */
export function normalizeDiscountPercent(value) {
  const d = Number(value);
  if (!Number.isFinite(d) || d <= 0) return 0;
  if (d >= 100) return 99;
  return d;
}

/**
 * `price` is the selling (current) price. `discountPercent` is the markdown from "original" (e.g. 25 => original = price / 0.75).
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

export function pricingFromProduct(product) {
  return calculateProductPricing(product?.price, product?.discount_percent);
}

/** Subtotal at list/original prices vs current prices for cart lines (uses `discount_percent` per item). */
export function cartDiscountTotals(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { originalTotal: 0, saleTotal: 0, discountAmount: 0 };
  }
  let originalTotal = 0;
  let saleTotal = 0;
  for (const item of cartItems) {
    const q = Number(item.quantity) || 0;
    if (q <= 0) continue;
    const { currentPrice, originalPrice } = calculateProductPricing(
      item.price,
      item.discount_percent,
    );
    saleTotal += currentPrice * q;
    originalTotal += originalPrice * q;
  }
  return {
    originalTotal,
    saleTotal,
    discountAmount: Math.max(0, originalTotal - saleTotal),
  };
}
