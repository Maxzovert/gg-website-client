import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || 'https://www.gawriganga.com').replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      cloudflare(),
      Sitemap({
        hostname: siteUrl,
        // Public routes only. Avoid auth/cart/profile or other private pages.
        dynamicRoutes: [
          '/sprays',
          '/rudraksha',
          '/tulsimala',
          '/rashi',
          '/accessories',
          '/about',
          '/contact',
          '/terms-of-service',
          '/refund-cancellation',
          '/terms-and-conditions',
          '/shipping-policy',
          '/privacy-policy',
        ],
        exclude: ['/auth', '/auth/callback', '/cart', '/wishlist', '/profile'],
        readable: true,
      }),
    ],
  }
})