/** Current site origin for auth redirects (browser or VITE_SITE_URL). */
export const getRedirectURL = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin?.trim() ?? '';
    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
  }
  const env = (import.meta.env?.VITE_SITE_URL ?? '').trim();
  return env.endsWith('/') ? env.slice(0, -1) : env;
};

/** OAuth callback URL (origin + /auth/callback). */
export const getAuthCallbackURL = () => {
  const origin = getRedirectURL();
  return origin ? `${origin}/auth/callback` : '';
};
