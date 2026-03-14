/**
 * Central API base URL and fetch helper.
 * Use apiFetch for requests that may require auth (adds Bearer token when present).
 */

// In production build, VITE_API_URL must be set (e.g. Docker build-arg or Amplify env).
export const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : '');

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
