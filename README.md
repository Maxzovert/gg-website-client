# Sitemap + Google Search Console Setup (Step by Step)

This guide shows how to:

1. Generate `sitemap.xml` for this Vite app.
2. Add `robots.txt`.
3. Upload both to production.
4. Submit sitemap in Google Search Console.

Use your real domain in all examples below:

- `https://gawriganga.com`

---

## 1) Install sitemap generator

Run this in the project root:

```bash
npm i -D vite-plugin-sitemap
```

---

## 2) Add sitemap plugin in Vite config

Open `vite.config.js` (or `vite.config.ts`) and add `vite-plugin-sitemap`.

Example:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sitemap } from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://gawriganga.com",
      // Add all public routes that should be indexed
      dynamicRoutes: [
        "/",
        "/about",
        "/contact",
        "/rudraksha",
        "/sprays",
        "/accessories",
        "/rashi",
      ],
    }),
  ],
});
```

Notes:

- Keep route paths exactly same as your app routes.
- Do not add private/account-only pages in sitemap.

---

## 3) Add robots.txt

Create file: `public/robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://gawriganga.com/sitemap.xml
```

Why this matters:

- Tells crawlers where sitemap is.
- Gives clear crawl permission for public pages.

---

## 4) Build and verify locally

Run:

```bash
npm run build
```

After build, verify these files exist inside `dist/`:

- `dist/sitemap.xml`
- `dist/robots.txt`

If missing:

- Recheck plugin import/config.
- Make sure `hostname` is set.
- Make sure routes are in `dynamicRoutes`.

---

## 5) Deploy to production

Deploy as usual:

```bash
npm run deploy
```

Then open in browser and confirm:

- `https://gawriganga.com/sitemap.xml`
- `https://gawriganga.com/robots.txt`

Both must return HTTP 200.

---

## 6) Add property in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console/).
2. Click **Add property**.
3. Prefer **Domain property** (`gawriganga.com`) for full coverage.
4. Verify ownership using DNS TXT record in your domain provider panel.
5. Wait for verification success.

Tip: If DNS takes time, wait 5-30 minutes and retry.

---

## 7) Submit sitemap in Search Console

1. Open your property.
2. Go to **Indexing > Sitemaps**.
3. In “Add a new sitemap”, enter:
   - `sitemap.xml`
4. Click **Submit**.

You should see status as “Success” after processing.

---

## 8) Request indexing for important pages

For key pages (Home, Category pages):

1. Use top search bar in Search Console.
2. Paste full URL.
3. Click **Request indexing**.

This can speed up first crawl.

---

## 9) Ongoing SEO checklist

- Keep sitemap updated when new public routes are added.
- Do not include 404, duplicate, or private pages.
- Ensure each indexed page has:
  - Unique `<title>`
  - Unique meta description
  - Canonical URL (if needed)
- Re-submit sitemap only when structure changes (optional, not required daily).

---

## 10) Quick troubleshooting

### “Couldn't fetch” in sitemap report

- Check that `https://gawriganga.com/sitemap.xml` opens publicly.
- Confirm no auth/firewall blocks Googlebot.

### “Submitted URL not found (404)”

- Remove stale route from `dynamicRoutes`.
- Rebuild + redeploy.

### “Submitted URL blocked by robots.txt”

- Check `public/robots.txt` rules.
- Make sure target route is not disallowed.

---

## Optional: Add product URLs dynamically

If product pages are public and SEO-important, include product URLs too (for example `/product/:id`).
This usually requires generating route list from backend data during build or via a server-side sitemap endpoint.
