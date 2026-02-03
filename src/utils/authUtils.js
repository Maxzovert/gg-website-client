/**
 * Returns the current site origin for auth redirects.
 * Uses window.location.origin when in browser, else VITE_SITE_URL env fallback.
 * Prevents localhost from redirecting to production after OAuth/login.
 * Normalized: no trailing slash, trimmed.
 */
export const getRedirectURL = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin?.trim() ?? '';
    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
  }
  const env = (import.meta.env?.VITE_SITE_URL ?? '').trim();
  return env.endsWith('/') ? env.slice(0, -1) : env;
};

/**
 * Returns the full OAuth callback URL (origin + /auth/callback).
 * No trailing slash so it matches Supabase Redirect URLs exactly.
 */
export const getAuthCallbackURL = () => {
  const origin = getRedirectURL();
  if (!origin) return '';
  const path = '/auth/callback';
  return `${origin}${path}`;
};
