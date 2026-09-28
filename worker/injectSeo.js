/**
 * Rewrite SPA index.html head so crawlers see per-URL SEO without JavaScript.
 */
export function injectSeoIntoHtml(
  htmlResponse,
  { title, description, url, image, keywords, status = 200, jsonLd = [] },
) {
  const pageTitle = title || 'Gawri Ganga';
  const pageDesc = description || '';
  const pageUrl = url || '';
  const pageImage = image || '';
  const schemas = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean);

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(pageTitle);
      },
    })
    .on('meta', {
      element(el) {
        const name = el.getAttribute('name');
        const property = el.getAttribute('property');
        if (name === 'description') el.setAttribute('content', pageDesc);
        if (name === 'keywords' && keywords) el.setAttribute('content', keywords);
        if (property === 'og:title' || name === 'twitter:title') el.setAttribute('content', pageTitle);
        if (property === 'og:description' || name === 'twitter:description') {
          el.setAttribute('content', pageDesc);
        }
        if (property === 'og:url') el.setAttribute('content', pageUrl);
        if (property === 'og:image' || name === 'twitter:image') el.setAttribute('content', pageImage);
        if (property === 'og:image:alt' || name === 'twitter:image:alt') {
          el.setAttribute('content', pageTitle);
        }
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', pageUrl);
      },
    })
    .on('head', {
      element(el) {
        for (const schema of schemas) {
          const json = JSON.stringify(schema).replace(/</g, '\\u003c');
          el.append(`\n<script type="application/ld+json">${json}</script>\n`, { html: true });
        }
      },
    });

  const rewritten = rewriter.transform(htmlResponse);

  const headers = new Headers(rewritten.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set(
    'cache-control',
    status === 404 ? 'no-store' : 'public, max-age=0, must-revalidate',
  );

  return new Response(rewritten.body, { status, headers });
}

/** Cache headers for hashed Vite assets and static public files. */
export function withAssetCacheHeaders(response, pathname) {
  if (!response) return response;
  const headers = new Headers(response.headers);
  const isHashedAsset = /\/assets\/.+\.[a-zA-Z0-9_-]+\.(js|css|woff2?|ttf|eot)$/.test(pathname);
  const isImage = /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i.test(pathname);

  if (isHashedAsset) {
    headers.set('cache-control', 'public, max-age=31536000, immutable');
  } else if (isImage) {
    headers.set('cache-control', 'public, max-age=86400, stale-while-revalidate=604800');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
