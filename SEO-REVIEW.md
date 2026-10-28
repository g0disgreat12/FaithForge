# FaithForge Gaming — approved SEO update

Updated October 28, 2026. The changes below are prepared and tested in the files. Nothing has been deployed to the website or Cloudflare.

## Completed

- Replaced `/G0dsblessing/` with `/faithforgegaming/` in the sitemap; added `/Doctrine/` and `/Streamer-Shops/`. All **38** listed URLs map to a supplied content page with the same canonical URL, a unique title, a description, and no `noindex` instruction.
- Created real lowercase `/warrior_of_light777/` and `/romans1014xp/` pages. Updated sitemap, directory/dashboard links, and structured-data references, including the additional `/Romans1014XP/` typo. Kept original image paths. Supplied old-page redirect fallbacks and three Cloudflare 301 rules.
- Aligned six older pages' canonical and Open Graph URLs with their trailing-slash folders. Non-Arena Home links now use `/`. Other page paths and all Arena files remain unchanged.
- Corrected a missing Romans profile-image URL in structured data and six inaccurate Open Graph image-dimension values. No images were changed.
- Added a static `WebSite` fallback to Home and a consistent organization ID. Site-name metadata remains available if the community API fails; normal rendering and the API fallback use the same site identity.
- Made the Games and Streamer Shops titles more descriptive using existing subject matter. Enabled large search-image previews on public non-Arena pages that lacked that directive. Dashboard and 404 `noindex` settings remain intact.
- Removed the unused ember-script request from Devotions and Prayers, fixing both null-canvas errors. The shared animation is unchanged.
- Unified event metadata in the Community API, renderer, Home browser script, and Events browser script. The same event has the same ID, description, dates, status, attendance mode, organizer, and location. Replaced conflicting API event microdata with consistent JSON-LD; the API HTML fragment also carries that JSON-LD.
- Home updates its existing event graph instead of adding a second conflicting graph. Its event nodes reflect the events displayed there. Calendar retrieval, visible text, times, filtering, sorting, buttons, and countdown behavior remain unchanged.

## Event metadata rules

The shared implementation is `assets/js/shared/event-schema.js`. Identical copies are included in the two self-contained Worker sources, avoiding a new bundler or deployment dependency.

| Supplied calendar Location | Metadata |
| --- | --- |
| `FFG Discord` | Online, using the existing community Discord invitation |
| `Online: https://meet.google.com/your-meeting` | Online, using the supplied meeting URL |
| `In person: Town Hall, 123 Main Street` | Offline; supplied location text becomes the place name |
| `Hybrid: Town Hall \| https://meet.google.com/your-meeting` | Mixed attendance with physical and virtual locations |
| `FaithForge Gaming` | Location text; attendance unspecified |
| Empty/unknown | No invented venue or attendance mode |

Known online service links and explicit attendance fields are also supported. These examples do not create or edit calendar events. Recognized event statuses are retained; tentative events are not falsely declared confirmed. Google Calendar's exclusive all-day end dates become inclusive dates **only in schema**, leaving schedules/display logic unchanged. No physical address, ticket price, or attendance claim is fabricated.

Accurate Schema.org data is separate from eligibility for Google's event experience. Google excludes virtual-only events from that feature and requires eligible individual event pages. No dedicated event pages or ticket data were invented to qualify. [Google event guidelines](https://developers.google.com/search/docs/appearance/structured-data/event).

## Validation results

- **120/120 screenshots and computed-style comparisons matched** the preceding refactor: 40 pages at 390, 768, and 1440 pixels. Lowercase profiles were compared with their old-path counterparts.
- **22/22 browser interaction comparisons passed** for the existing menus, contact/giveaway switching, event filters/search, dashboard search, and slideshows where present. Both prior client errors are absent.
- **16 event fixtures** matched across browser/API/renderer/normalized-data paths: online, physical, hybrid, unknown, missing, canceled, tentative, all-day, unsafe URL, and rescheduled cases.
- **16 renderer scenarios** preserved visible operations and headers except the version marker: normal, empty, API fallback, and API failure. Four additional rendered Home/Events screenshot comparisons matched.
- Actual browser-generated event JSON-LD matched the API on both pages. Both remained usable with the optional metadata helper deliberately blocked. API HTML and fragment schema matched without changing visible event text.
- Four legacy static redirect pages retained query strings and fragments with JavaScript. The Worker helper passed 12 old-path variants; handler checks confirmed GET/HEAD 301 responses, unchanged POST handling, and asset/Arena pass-through.
- **38 sitemap destinations**, **20 static JSON-LD blocks**, and **41 JavaScript/Worker syntax checks** passed. **214 protected files**, including all Arena files, images, CSS, `embers.js`, `CNAME`, and `robots.txt`, remained byte-identical to the preceding refactor.

Tests used controlled third-party responses and a local HTMLRewriter-compatible shim. They do not certify actual dashboard rules, search indexing, external stream playback, form delivery, or every browser. `SEO-DEPLOYMENT.md` contains the live verification steps.

## Source gap to preserve

Seven Games links point to `/Brn2bEw1Ld/`. The profile appears in public page retrieval, but its HTML/assets were absent from the ZIP. Its links remain unchanged. Preserve any live copy during upload; its source is needed before refactoring or fully auditing it. The sitemap is complete for the supplied indexable pages, not proof that the upload contains every live page.

## Next opportunities requiring content or configuration decisions

1. Review Google Search Console and Bing Webmaster Tools: submit the revised sitemap, inspect canonical selection/indexing, then prioritize queries, impressions, clicks, and mobile performance. Account data was not supplied and no submissions were made.
2. Add useful pages for actively supported servers: joining, setup, rules, play style, current availability, and community activities. Publish real tournament/community recaps linked to creators and games. New visible content/layout needs review first.
3. Add accurate readable text/transcriptions alongside devotion and prayer images, with appropriate author/Scripture context. Preserve the images while agreeing on the presentation.
4. Reconcile the live creator roster with the source files, including Brn2bEw1Ld. Use real activity/member evidence for community-scale claims. No unsupported ranking claims were added.
5. Review renderer outage behavior: it can make two sequential 12-second API attempts, and `DATA_CACHE_SECONDS` is unused. A bounded budget and last-known-good cache could help, but would change freshness/cache behavior; neither was changed here.
6. Confirm dashboard protection for the Community API's administrative `/refresh` action before changing its authorization. No in-code check was present, and the route was never invoked during this work.
7. Measure live image/network performance before conversion or deletion. No image, cache setting, preload rule, or security configuration was altered.

SEO references: [canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [site names](https://developers.google.com/search/docs/appearance/site-names), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
