const CONSENT_KEY = 'gg_cookie_consent';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-7P8LPXZ012';

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
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('config', GA_ID, {
    page_path: path,
    anonymize_ip: true,
  });
}

export function trackPurchase({ transactionId, value, currency = 'INR', items = [] }) {
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
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'login', { method });
}

export function trackBeginCheckout(value, items = []) {
  if (getStoredConsent() !== 'analytics') return;
  ensureGtagStub();
  window.gtag('event', 'begin_checkout', {
    value: Number(value) || 0,
    currency: 'INR',
    items: items.map((i) => ({
      item_id: String(i.product_id ?? i.id ?? ''),
      item_name: i.product_name || i.name || '',
      price: Number(i.product_price ?? i.price) || 0,
      quantity: Number(i.quantity) || 1,
    })),
  });
}
