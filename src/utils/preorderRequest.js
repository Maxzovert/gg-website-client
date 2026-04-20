import { apiFetch } from '../config/api';

export async function submitPreorderRequest({ product, quantity, email }) {
  if (!product?.id) {
    throw new Error('Product is required');
  }

  const response = await apiFetch('/api/preorders', {
    method: 'POST',
    body: JSON.stringify({
      product_id: product.id,
      product_name: product.name,
      product_price: Number(product.price || 0),
      quantity: Number(quantity || 1),
      email,
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || 'Failed to save preorder request');
  }
  return payload?.data || null;
}
