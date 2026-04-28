import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  enableAnalyticsFromConsent,
  getStoredConsent,
  hydrateAnalyticsIfConsented,
  rejectOptionalCookies,
  trackPageView,
} from '../utils/analytics';
import { useLocation } from 'react-router-dom';

/**
 * GDPR-style choice: essential-only vs analytics (GA4). Loads GA only after opt-in.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    hydrateAnalyticsIfConsented();
    const c = getStoredConsent();
    if (c === null || c === undefined) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const accept = () => {
    enableAnalyticsFromConsent();
    trackPageView(location.pathname + location.search);
    setVisible(false);
  };

  const essentialOnly = () => {
    rejectOptionalCookies();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-100 p-4 md:p-6 bg-gray-900/95 text-white shadow-2xl border-t border-white/10"
      role="dialog"
      aria-labelledby="cookie-consent-title"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-sm md:text-base leading-relaxed">
          <h2 id="cookie-consent-title" className="font-semibold text-base mb-1">
            Cookies & analytics
          </h2>
          <p className="text-white/90">
            We use essential cookies for the site to work. With your permission we also load Google Analytics to
            understand traffic and improve the store. See our{' '}
            <Link to="/privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={essentialOnly}
            className="px-4 py-2.5 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
