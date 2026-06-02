const CONSENT_KEY = 'gg_cookie_consent';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7P8LPXZ012';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '4467576400152637';

function hasAnalyticsConsent() {
  return getStoredConsent() === 'analytics';
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

function trackMetaPageView() {
  if (!hasAnalyticsConsent() || typeof window.fbq !== 'function') return;
  initMetaPixel();
  window.fbq('track', 'PageView');
}

function trackMetaEvent(eventName, params = {}) {
  if (!hasAnalyticsConsent() || typeof window.fbq !== 'function') return;
  initMetaPixel();
  window.fbq('track', eventName, params);
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
  appendMetaPixelScript();
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
  appendMetaPixelScript();
}

export function trackPageView(path) {
  if (!hasAnalyticsConsent()) return;
  ensureGtagStub();
  window.gtag('config', GA_ID, {
    page_path: path,
    anonymize_ip: true,
  });
  trackMetaPageView();
}

export function trackPurchase({ transactionId, value, currency = 'INR', items = [] }) {
  const normalizedItems = normalizeItems(items);
  if (!hasAnalyticsConsent()) return;
  ensureGtagStub();
  window.gtag('event', 'purchase', {
    transaction_id: String(transactionId),
    value: Number(value) || 0,
    currency,
    items: normalizedItems,
  });
  trackMetaEvent('Purchase', {
    value: Number(value) || 0,
    currency,
    content_ids: normalizedItems.map((i) => i.item_id).filter(Boolean),
    content_type: 'product',
    num_items: normalizedItems.reduce((sum, i) => sum + i.quantity, 0),
  });
}

export function trackLogin(method = 'otp') {
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'login', { method });
}

export function trackSignUp(method = 'otp') {
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'sign_up', { method });
}

export function trackBeginCheckout(value, items = []) {
  const normalizedItems = normalizeItems(items);
  if (!hasAnalyticsConsent()) return;
  ensureGtagStub();
  window.gtag('event', 'begin_checkout', {
    value: Number(value) || 0,
    currency: 'INR',
    items: normalizedItems,
  });
  trackMetaEvent('InitiateCheckout', {
    value: Number(value) || 0,
    currency: 'INR',
    content_ids: normalizedItems.map((i) => i.item_id).filter(Boolean),
    content_type: 'product',
    num_items: normalizedItems.reduce((sum, i) => sum + i.quantity, 0),
  });
}

export function trackViewContent(product, quantity = 1) {
  if (!hasAnalyticsConsent() || !product) return;
  const id = String(product.id ?? product.product_id ?? '');
  const price = Number(product.price ?? product.product_price) || 0;
  trackMetaEvent('ViewContent', {
    content_ids: id ? [id] : [],
    content_name: product.name || product.product_name || '',
    content_type: 'product',
    value: price * (Number(quantity) || 1),
    currency: 'INR',
  });
}

export function trackAddToCart(product, quantity = 1) {
  if (!hasAnalyticsConsent() || !product) return;
  const id = String(product.id ?? product.product_id ?? '');
  const price = Number(product.price ?? product.product_price) || 0;
  const qty = Number(quantity) || 1;
  trackMetaEvent('AddToCart', {
    content_ids: id ? [id] : [],
    content_name: product.name || product.product_name || '',
    content_type: 'product',
    value: price * qty,
    currency: 'INR',
  });
}

export function trackLead(payload = {}) {
  if (!hasAnalyticsConsent()) return;
  trackMetaEvent('Lead', payload);
}
