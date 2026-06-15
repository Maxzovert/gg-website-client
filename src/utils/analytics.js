const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7P8LPXZ012';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '4467576400152637';
const PURCHASE_TRACKED_KEY = 'gg_purchase_tracked_ids';

let analyticsInited = false;

function normalizeItems(items = []) {
  return items.map((i) => ({
    item_id: String(i.product_id ?? i.id ?? ''),
    item_name: i.product_name || i.name || '',
    price: Number(i.product_price ?? i.price) || 0,
    quantity: Number(i.quantity) || 1,
  }));
}

function metaContentsFromItems(items = []) {
  return normalizeItems(items).map((i) => ({
    id: i.item_id,
    quantity: i.quantity,
    item_price: i.price,
  }));
}

function metaParamsFromItems(items, value, currency = 'INR') {
  const normalized = normalizeItems(items);
  return {
    value: Number(value) || 0,
    currency,
    content_ids: normalized.map((i) => i.item_id).filter(Boolean),
    contents: metaContentsFromItems(items),
    content_type: 'product',
    num_items: normalized.reduce((sum, i) => sum + i.quantity, 0),
  };
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

function ensureFbqStub() {
  if (typeof window.fbq === 'function') return;
  const n = (window.fbq = function fbq() {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
}

function initMetaPixel() {
  ensureFbqStub();
  if (window.__ggMetaPixelInited) return;
  window.fbq('init', META_PIXEL_ID);
  window.__ggMetaPixelInited = true;
}

function appendMetaPixelScript() {
  if (document.querySelector('script[src*="fbevents.js"]')) {
    initMetaPixel();
    return;
  }
  ensureFbqStub();
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  s.onload = () => initMetaPixel();
  document.head.appendChild(s);
}

function ensureAnalytics() {
  initAnalytics();
}

function trackMetaPageView() {
  if (typeof window.fbq !== 'function') return;
  initMetaPixel();
  window.fbq('track', 'PageView');
}

function trackMetaEvent(eventName, params = {}, options = {}) {
  if (typeof window.fbq !== 'function') return;
  initMetaPixel();
  if (options.eventID) {
    window.fbq('track', eventName, params, { eventID: options.eventID });
  } else {
    window.fbq('track', eventName, params);
  }
}

function getTrackedPurchaseIds() {
  try {
    const raw = sessionStorage.getItem(PURCHASE_TRACKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markPurchaseTracked(orderId) {
  try {
    const ids = getTrackedPurchaseIds();
    const id = String(orderId);
    if (!ids.includes(id)) {
      ids.push(id);
      sessionStorage.setItem(PURCHASE_TRACKED_KEY, JSON.stringify(ids));
    }
  } catch {
    /* ignore */
  }
}

function hasPurchaseBeenTracked(orderId) {
  return getTrackedPurchaseIds().includes(String(orderId));
}

/** Load GA4 + Meta Pixel scripts (idempotent; no consent gate). */
export function initAnalytics() {
  if (analyticsInited) return;
  analyticsInited = true;
  ensureGtagStub();
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  appendGtagScript();
  appendMetaPixelScript();
}

export function trackPageView(path) {
  ensureAnalytics();
  window.gtag('config', GA_ID, {
    page_path: path,
    anonymize_ip: true,
  });
  trackMetaPageView();
}

export function trackPurchase({ transactionId, value, currency = 'INR', items = [] }) {
  const orderId = String(transactionId ?? '');
  if (!orderId || hasPurchaseBeenTracked(orderId)) return;
  markPurchaseTracked(orderId);

  const normalizedItems = normalizeItems(items);
  ensureAnalytics();
  window.gtag('event', 'purchase', {
    transaction_id: orderId,
    value: Number(value) || 0,
    currency,
    items: normalizedItems,
  });
  trackMetaEvent(
    'Purchase',
    metaParamsFromItems(items, value, currency),
    { eventID: orderId },
  );
}

export function trackLogin(method = 'otp') {
  ensureAnalytics();
  window.gtag('event', 'login', { method });
}

export function trackSignUp(method = 'otp') {
  ensureAnalytics();
  window.gtag('event', 'sign_up', { method });
  trackMetaEvent('CompleteRegistration', { status: true, method });
}

export function trackBeginCheckout(value, items = []) {
  ensureAnalytics();
  const normalizedItems = normalizeItems(items);
  window.gtag('event', 'begin_checkout', {
    value: Number(value) || 0,
    currency: 'INR',
    items: normalizedItems,
  });
  trackMetaEvent('InitiateCheckout', metaParamsFromItems(items, value, 'INR'));
}

export function trackAddPaymentInfo(value, items = [], paymentMethod = '') {
  ensureAnalytics();
  const normalizedItems = normalizeItems(items);
  window.gtag('event', 'add_payment_info', {
    value: Number(value) || 0,
    currency: 'INR',
    payment_type: paymentMethod,
    items: normalizedItems,
  });
  trackMetaEvent('AddPaymentInfo', {
    ...metaParamsFromItems(items, value, 'INR'),
    payment_method: paymentMethod,
  });
}

export function trackViewContent(product, quantity = 1) {
  if (!product) return;
  const id = String(product.id ?? product.product_id ?? '');
  const price = Number(product.price ?? product.product_price) || 0;
  const qty = Number(quantity) || 1;
  const name = product.name || product.product_name || '';
  const value = price * qty;

  ensureAnalytics();
  window.gtag('event', 'view_item', {
    currency: 'INR',
    value,
    items: [{ item_id: id, item_name: name, price, quantity: qty }],
  });
  trackMetaEvent('ViewContent', {
    content_ids: id ? [id] : [],
    content_name: name,
    content_type: 'product',
    value,
    currency: 'INR',
    contents: [{ id, quantity: qty, item_price: price }],
  });
}

export function trackAddToCart(product, quantity = 1) {
  if (!product) return;
  const id = String(product.id ?? product.product_id ?? '');
  const price = Number(product.price ?? product.product_price) || 0;
  const qty = Number(quantity) || 1;
  const name = product.name || product.product_name || '';
  const value = price * qty;

  ensureAnalytics();
  window.gtag('event', 'add_to_cart', {
    currency: 'INR',
    value,
    items: [{ item_id: id, item_name: name, price, quantity: qty }],
  });
  trackMetaEvent('AddToCart', {
    content_ids: id ? [id] : [],
    content_name: name,
    content_type: 'product',
    value,
    currency: 'INR',
    contents: [{ id, quantity: qty, item_price: price }],
  });
}

export function trackLead(payload = {}) {
  ensureAnalytics();
  window.gtag('event', 'generate_lead', payload);
  trackMetaEvent('Lead', payload);
}
