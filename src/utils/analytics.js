const CONSENT_KEY = 'gg_cookie_consent';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7P8LPXZ012';

function hasFbq() {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

function trackMetaEvent(eventName, payload = {}) {
  if (!hasFbq()) return;
  window.fbq('track', eventName, payload);
}

function normalizeItems(items = []) {
  return items.map((i) => ({
    item_id: String(i.product_id ?? i.id ?? ''),
    item_name: i.product_name || i.name || '',
    price: Number(i.product_price ?? i.price) || 0,
    quantity: Number(i.quantity) || 1,
  }));
}

export function getStoredConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function appendGtagScript() {
  if (document.querySelector(`script[src*="gtag/js?id=${GA_ID}"]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Call after user accepts analytics cookies */
export function enableAnalyticsFromConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, 'analytics');
  } catch {
    /* ignore */
  }
  ensureGtagStub();
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  appendGtagScript();
}

export function rejectOptionalCookies() {
  try {
    localStorage.setItem(CONSENT_KEY, 'essential');
  } catch {
    /* ignore */
  }
}

/** Restore GA on return visits if user already opted in */
export function hydrateAnalyticsIfConsented() {
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  appendGtagScript();
}

export function trackPageView(path) {
  if (hasFbq()) {
    window.fbq('track', 'PageView');
  }
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('config', GA_ID, {
    page_path: path,
    anonymize_ip: true,
  });
}

export function trackPurchase({ transactionId, value, currency = 'INR', items = [] }) {
  trackMetaEvent('Purchase', {
    value: Number(value) || 0,
    currency,
    content_type: 'product',
    contents: normalizeItems(items).map((i) => ({
      id: i.item_id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: normalizeItems(items).reduce((sum, i) => sum + i.quantity, 0),
    order_id: String(transactionId),
  });
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'purchase', {
    transaction_id: String(transactionId),
    value: Number(value) || 0,
    currency,
    items: items.map((i) => ({
      item_id: String(i.product_id ?? i.id ?? ''),
      item_name: i.product_name || i.name || '',
      price: Number(i.product_price ?? i.price) || 0,
      quantity: Number(i.quantity) || 1,
    })),
  });
}

export function trackLogin(method = 'otp') {
  trackMetaEvent('CompleteRegistration', { status: true, method });
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'login', { method });
}

export function trackSignUp(method = 'otp') {
  trackMetaEvent('CompleteRegistration', { status: true, method });
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'sign_up', { method });
}

export function trackBeginCheckout(value, items = []) {
  const normalizedItems = normalizeItems(items);
  trackMetaEvent('InitiateCheckout', {
    value: Number(value) || 0,
    currency: 'INR',
    content_type: 'product',
    contents: normalizedItems.map((i) => ({
      id: i.item_id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: normalizedItems.reduce((sum, i) => sum + i.quantity, 0),
  });
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'begin_checkout', {
    value: Number(value) || 0,
    currency: 'INR',
    items: normalizedItems,
  });
}

export function trackViewContent(product, quantity = 1) {
  if (!product) return;
  const price = Number(product.price) || 0;
  trackMetaEvent('ViewContent', {
    content_ids: [String(product.id ?? product.slug ?? product.name ?? '')],
    content_name: product.name || '',
    content_category: product.category || '',
    content_type: 'product',
    value: price * (Number(quantity) || 1),
    currency: 'INR',
  });
}

export function trackAddToCart(product, quantity = 1) {
  if (!product) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;
  trackMetaEvent('AddToCart', {
    content_ids: [String(product.id ?? product.slug ?? product.name ?? '')],
    content_name: product.name || '',
    content_category: product.category || '',
    content_type: 'product',
    value: price * qty,
    currency: 'INR',
    contents: [
      {
        id: String(product.id ?? product.slug ?? product.name ?? ''),
        quantity: qty,
        item_price: price,
      },
    ],
  });
}

export function trackLead(payload = {}) {
  trackMetaEvent('Lead', payload);
}
