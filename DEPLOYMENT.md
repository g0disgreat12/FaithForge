# CSS-refactor deployment notes

**Current release: start with `SEO-DEPLOYMENT.md`.** The approved SEO follow-up includes a changed sitemap, lowercase creator routes, two error fixes, and separately packaged Worker updates. The notes below explain the original CSS extraction and asset compatibility. Nothing has been deployed online.

## What to upload

The full ZIP contains the complete website under `FaithForge-main/`. Put the **contents** of that folder in the existing repository/site root; do not nest another `FaithForge-main` folder in the live site.

The current changes-only ZIP includes the combined CSS refactor and approved SEO changes. It is an overlay for the originally supplied website, not a standalone site. Preserve any live files absent from that original upload. No image replacement or deletion is required.

Use one commit/deployment containing the updated HTML and all new assets. If your host requires separate uploads, publish `main.css` and `assets/js/` first, then the changed HTML. A page must never reference assets that have not reached the origin yet.

Keep the current repository revision as the rollback point. Preserve the original image paths, `CNAME`, `robots.txt`, `style.css`, `embers.js`, and all Arena files. Publish the corrected `sitemap.xml` included in the SEO update.

## Cloudflare compatibility

The supplied renderer handles the home-page and Events-page route variants and passes other paths through to the origin. The CSS extraction retains its target IDs, markup classes, JSON-LD placeholders, and API URLs. That extraction alone needs no Worker changes; the approved SEO follow-up now has two Worker replacements and a creator redirect plan described in `SEO-DEPLOYMENT.md`.

The new stylesheet has a new URL, `/main.css`. The old `/style.css` remains unchanged so older cached HTML and Arena still receive their original stylesheet. New scripts also have new paths. No query-string cache-busting behavior is assumed for this first deployment.

The original home-page image preload is preserved. The three Worker source files do not reveal dashboard-controlled Early Hints, Rocket Loader, custom cache keys, security policies, or preload/transform rules. Review those settings against the new CSS and JS paths before publishing. If a rule explicitly preloads `/style.css` for non-Arena pages, review updating it to the matching `/main.css` URL; that dashboard change has not been made here. Do not disable existing optimizations blindly.

After publishing, use the cache-purge method appropriate to your configured cache keys for the changed page URLs. Include the root, explicit `index.html`, and folder variants that you actually cache. Cloudflare cache purges do not clear a visitor's browser cache. Already cached old pages remain self-contained because their original inline code and legacy assets are still available.

For later edits to `main.css` or external scripts, plan both browser and edge-cache invalidation. A `?v=` suffix only works as intended if the relevant cache settings respect it. Choose a release/version approach after checking the current rules; none has been imposed on the site.

## Live checks before considering the release complete

1. Confirm `/main.css` and the new scripts return 200 with CSS/JavaScript content types, not an HTML fallback.
2. Check the home page and `/Events/` with JavaScript disabled. Their served HTML should contain current community counts/event cards and populated server schema, not just loading placeholders.
3. Inspect `X-FaithForge-Renderer`. The supplied renderer reports `homepage; v=2.1.1` or `events; v=2.1.1` on successful rendering. Investigate a bypass result before treating server rendering as verified.
4. Check phone and desktop navigation, event search/filtering, slideshows, contact/giveaway field switching, creator selection, live embeds, and dashboard filtering. Verify real third-party integrations separately from the local fixtures.
5. Measure cold and warm page loads through the real Cloudflare configuration. The consolidated stylesheet is about 259 KB uncompressed and 34 KB using local gzip; actual network compression may differ. Small pages now load a larger shared stylesheet on a cold visit, while subsequent pages can reuse it. Smaller HTML does not guarantee faster first visits.

If there is a release issue, revert the changed HTML to the previous revision and purge the affected cached pages as appropriate. The old stylesheet, images, and Arena files are still present. The new assets can remain while caches expire.

Reference: [Cloudflare cache purging](https://developers.cloudflare.com/cache/how-to/purge-cache/) and [cache keys](https://developers.cloudflare.com/cache/how-to/cache-keys/).
