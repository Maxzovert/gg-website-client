/** Max units per line for pre-order when DB stock is 0 (caps cart / PDP quantity). */
const PREORDER_MAX_WHEN_ZERO_STOCK = 10;

function coercePreorderFlag(raw) {
  if (raw === true || raw === 1) return true;
  if (raw === false || raw === 0 || raw == null) return false;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'preorder' || s === 'pre-order';
  }
  return Boolean(raw);
}

/**
 * @param {object | null | undefined} productLike - API product or cart line (snake_case or camelCase).
 * @returns {boolean}
 */
export function isProductPreorder(productLike) {
  if (!productLike || typeof productLike !== 'object') return false;
  const st = productLike.sale_type ?? productLike.saleType;
  if (st != null && String(st).trim() !== '') {
    const s = String(st).trim().toLowerCase().replace(/-/g, '_');
    if (s === 'preorder' || s === 'pre_order') return true;
    if (s === 'order' || s === 'standard' || s === 'regular') return false;
  }
  const v = productLike.is_preorder ?? productLike.isPreorder;
  return coercePreorderFlag(v);
}

/**
 * @param {object | null | undefined} productLike
 * @returns {boolean}
 */
export function productCanBePurchased(productLike) {
  if (!productLike || typeof productLike !== 'object') return false;
  const stock = Number(productLike.stock ?? 0);
  if (stock > 0) return true;
  return isProductPreorder(productLike);
}

/**
 * Upper bound for quantity selector (PDP / cart + button).
 * @param {object | null | undefined} productLike
 * @returns {number}
 */
export function getMaxOrderQuantity(productLike) {
  if (!productLike || typeof productLike !== 'object') return 1;
  const stock = Number(productLike.stock ?? 0);
  if (isProductPreorder(productLike)) {
    if (stock > 0) return stock;
    return PREORDER_MAX_WHEN_ZERO_STOCK;
  }
  return Math.max(stock, 0);
}
