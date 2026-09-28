import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/$/, '');

/**
 * Client-side 404 page. Paired with Worker HTTP 404 for unknown URLs / missing products.
 */
const NotFound = () => {
  const url = typeof window !== 'undefined' ? `${SITE}${window.location.pathname}` : `${SITE}/`;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Page Not Found | Gawri Ganga</title>
        <meta
          name="description"
          content="The page you requested does not exist on Gawri Ganga."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={url} />
      </Helmet>
      <div className="text-center max-w-md">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-2">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-600 mb-8">
          This link does not match a product or page on Gawri Ganga. Check the URL or continue shopping.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Go home
          </Link>
          <Link
            to="/rudraksha"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
          >
            Shop Rudraksha
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
