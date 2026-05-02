/**
 * Display-only review count for product cards when the API does not expose a real total.
 * Numeric IDs keep the legacy `5 + (id % 3)` pattern; UUID/string IDs use a stable hash so the UI never shows NaN.
 */
export function getCardReviewCount(productId) {
  const n = Number(productId);
  if (Number.isFinite(n)) return 5 + (Math.trunc(n) % 3);
  const s = String(productId ?? '');
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return 5 + (Math.abs(h) % 3);
}
