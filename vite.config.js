import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// Sitemap is served dynamically by the Worker (/sitemap.xml) from /api/seo/sitemap-urls.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  void env.VITE_SITE_URL;

  return {
    plugins: [
      react(),
      tailwindcss(),
      cloudflare(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/react-router')) {
              return 'router';
            }
            if (id.includes('node_modules/react-icons')) {
              return 'icons';
            }
          },
        },
      },
    },
  }
})
