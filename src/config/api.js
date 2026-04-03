/**
 * Central API base URL and fetch helper.
 * Use apiFetch for requests that may require auth (adds Bearer token when present).
 *
 * IMPORTANT:
 * - We NEVER hardcode the API origin here.
 * - Always configure `VITE_API_URL` in your environment (.env, CI/CD, hosting).
 */

const rawApiUrl = import.meta.env.VITE_API_URL

if (!rawApiUrl) {
  // Fail fast in development so you remember to set it.
  // In production this will surface as a clear runtime error instead of silently
  // calling an incorrect origin.
  throw new Error(
    'VITE_API_URL is not defined. Please set it in your .env file (e.g. VITE_API_URL="https://api.yourdomain.com").',
  )
}

export const API_URL = rawApiUrl.replace(/\/$/, '')

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Fetch from API with base URL, credentials, and optional auth token.
 * @param {string} path - Path (e.g. '/api/orders') or full URL
 * @param {RequestInit} options - fetch options (method, body, headers, etc.)
 */
export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
}
