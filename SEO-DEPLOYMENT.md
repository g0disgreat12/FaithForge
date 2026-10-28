# Publishing the approved SEO update

Prepared October 28, 2026. These files have been tested locally. No website, Worker, Cloudflare rule, or search-console account has been changed online.

## 1. Publish the website files as an overlay

Use `FaithForge-updates-only.zip` to apply the combined CSS refactor and SEO fixes to the supplied original site. `FaithForge-main.zip` includes all supplied original files plus the changes. Both ZIPs contain a `FaithForge-main/` directory: upload its **contents** into the existing website root.

Keep the current repository commit as the rollback point. Preserve existing live files that are absent from this package. In particular, seven Games links point to `/Brn2bEw1Ld/`; that profile appears in public page retrieval but its source was not in the supplied ZIP. Its links have been retained. Do not replace the whole repository with a reduced file list or delete unlisted live pages.

Publish new assets and new lowercase pages before activating redirects. Prefer one atomic repository commit for HTML and assets. If separate uploads are necessary, upload `main.css` and `assets/js/` before the HTML that uses them.

The following are now the actual profile content files:

- `warrior_of_light777/index.html`
- `romans1014xp/index.html`
- `faithforgegaming/index.html`

Old profile addresses have small redirect HTML files. Keep them. Keep the original mixed-case image directories and filenames as well: existing links, cached HTML, and social previews can still request those image URLs. Do not rename creator image assets just to match the lowercase page URL.

**Case-sensitive paths:** the package deliberately includes both lowercase content directories and mixed-case compatibility directories. Use GitHub's web file tools or a case-sensitive checkout/filesystem to publish the complete tree. Extracting onto a case-insensitive filesystem can merge these directories and overwrite a content page with its redirect. The desired GitHub tree must contain both exact path spellings. This is especially relevant on default Windows/macOS filesystems.

## 2. Update the two existing Workers

The separate `FaithForge-Cloudflare-updates.zip` contains complete replacement source for:

| File | Existing Worker | Resulting version |
| --- | --- | --- |
| `communityapi.txt` | Community API | 10.1 |
| `siterender.txt` | Site renderer | 2.1.1 |

Update the Community API first, then the renderer. Keep the existing Worker names, environment variables, secrets, KV bindings, `COMMUNITY_API` service binding, schedules, and existing routes. The Raid Train Worker is unchanged. No new binding, secret, cron, npm install, or build step is needed. Worker source belongs in Cloudflare, not the static website upload.

The changes affect event structured data and narrowly scoped profile redirects. Existing visible rendering targets, fetch timeouts, cache headers, API endpoints, event sorting/filtering, calendar retrieval, CORS, and fail-open behavior are retained. Do not run `/refresh` just for this update; the existing stored calendar data is enough for the new schema generator.

## 3. Enable permanent redirects for old page URLs

The new renderer returns 301 redirects when it receives one of these old page requests. However, the supplied renderer is intended to run on Home and Events routes. Updating its code alone does **not** prove that it will receive old creator URLs.

Use the three narrow Cloudflare Single Redirect rules in `redirect-rules.json` if equivalent permanent redirects do not already exist. Copy each rule's expression and static destination into a separate redirect rule. Use status **301** and turn **Preserve query string** on. The expressions restrict requests to GET/HEAD on the production hosts and exact page paths. They exclude image URLs and Arena paths.

| Old page paths, including the listed no-slash and `index.html` forms | Destination |
| --- | --- |
| `/Warrior_of_light777`, `/Warrior_of_light777/`, `/Warrior_of_light777/index.html` | `https://faithforgegaming.com/warrior_of_light777/` |
| `/romans1014XP`, `/romans1014XP/`, `/romans1014XP/index.html`, plus those same three forms beginning `/Romans1014XP` | `https://faithforgegaming.com/romans1014xp/` |
| `/G0dsblessing`, `/G0dsblessing/`, `/G0dsblessing/index.html` | `https://faithforgegaming.com/faithforgegaming/` |

These are additional rules, not a replacement for your existing ruleset. Retain current HTTPS/hostname redirects, security rules, cache rules, and optimization settings. There is no need to route your entire site through the renderer. If exact old paths already reach that Worker, its tested 301 handler can handle them instead; verify the actual HTTP result.

Static redirect pages remain as a fallback if a request reaches the origin. Their small shared script preserves query strings and fragments; an immediate HTML refresh also works when JavaScript is disabled. An origin HTML redirect is not itself an HTTP 301, so verify the Cloudflare redirects separately.

Cloudflare reference: [Single Redirect settings](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/).

## 4. Preserve the existing cache and preload setup

The current edited browser scripts have fresh URLs:

- `/assets/js/home/community-v2.js`
- `/assets/js/events/calendar-v2.js`
- `/assets/js/streamers/creators-v2.js`
- `/assets/js/creatordashboard/dashboard-v2.js`

The older script URLs remain available for older cached HTML. The new shared event schema and legacy redirect scripts also use new URLs. This release does not rely on cache settings honoring query-string version numbers. `main.css`, `style.css`, images, and Arena files are unchanged from the preceding CSS refactor.

Purge the changed HTML and sitemap using the method appropriate to your existing Cloudflare cache keys, including cached folder/no-slash/`index.html` variants where applicable. If you have custom caching on Worker schema/feed URLs, invalidate those responses or allow their existing cache lifetimes to expire before checking the new metadata. Edge purges do not clear visitors' browser caches.

The original home-page image preload is retained. Dashboard Early Hints, Rocket Loader, CSP, cache-key, and transform settings were not supplied. If a dashboard rule explicitly preloads a stylesheet or script, check that its URL matches the intended page's assets. Do not disable the existing optimizations wholesale. See `DEPLOYMENT.md` for the first CSS-refactor deployment details.

## 5. Verify the live release and submit the sitemap

1. Confirm both lowercase creator pages, `/faithforgegaming/`, `/Doctrine/`, and `/Streamer-Shops/` return 200 and declare their own canonical URLs. Confirm the listed old URLs return 301 directly to the intended page, with query strings retained. Image requests at their original mixed-case paths should still succeed.
2. Confirm the new script URLs and `/main.css` return their correct content types and 200 responses. Check Devotions/Prayers navigation and slideshows; their old null-canvas error should be absent.
3. Inspect the Home and Events **response HTML**, with JavaScript disabled: populated content and event schema should still be present. Successful renderer responses identify version 2.1.1 in `X-FaithForge-Renderer`; investigate a bypass result separately.
4. Inspect event metadata after JavaScript runs as well. There should be one current set of event nodes per page, with stable IDs and the same attendance/location classification as the API. Check actual streaming embeds and external form delivery separately from local fixture tests.
5. Submit or resubmit `https://faithforgegaming.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. In Search Console, inspect the corrected profile URLs, the newly listed pages, Home, and Servers. Check the user-declared and Google-selected canonical, indexing availability, and mobile rendering. These account actions have not been performed here.

The sitemap contains 38 canonical, indexable pages from the supplied source. It excludes the Creator Dashboard, 404, and old redirect URLs. No artificial `lastmod` dates were added. Sitemaps and structured data help discovery and interpretation; they do not guarantee ranking or rich-result eligibility.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Rollback

Keep the lower-case destination pages available while permanent redirects may be cached. If a release issue occurs, revert the affected content/scripts or Worker version while retaining working destination URLs. Reverting only the redirects cannot undo a 301 already cached by a browser. The original assets and legacy script URLs remain in this package.
