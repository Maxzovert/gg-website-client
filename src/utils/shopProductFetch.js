import { apiFetch } from '../config/api';

const PAGE_SIZE = 100;

/**
 * Fetch every active product in a category (paginated; must match `categories.name` in DB).
 */
export async function fetchAllProductsByCategory(category, options = {}) {
  const { subcategory } = options;
  let offset = 0;
  const all = [];

  for (;;) {
    const params = new URLSearchParams({
      category,
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    if (subcategory && subcategory !== 'all') {
      params.set('subcategory', subcategory);
    }

    const response = await apiFetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const result = await response.json();
    const chunk = result.success && Array.isArray(result.data) ? result.data : [];
    all.push(...chunk);
    if (chunk.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    if (offset > 5000) break;
  }

  return all;
}
