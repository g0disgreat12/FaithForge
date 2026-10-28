# FaithForge website refactor — initial-stage record

**This is the historical CSS-extraction record, before the approved SEO follow-up.** Current metadata, URL, script-error, and Worker changes are documented in `SEO-REVIEW.md`; publish using `SEO-DEPLOYMENT.md`. Statements below about preserved metadata and pre-existing errors describe the initial stage only.

Prepared from the supplied `FaithForge-main.zip` after reviewing all three supplied Cloudflare source files. The result is a reviewable, locally tested website package. Nothing has been published.

## Changes completed

- Extracted all 24 embedded style blocks from the 22 non-Arena HTML pages into one readable `main.css`.
- Isolated page differences with zero-specificity `:where(...)` page selectors. Shared identical CSS rules retain the original order for each page.
- Reduced the extracted CSS sequence from 1,750 effective rule entries to 1,343 shared entries. The malformed trailing duplicate in the original Games CSS was already ignored by the browser; the effective styling was preserved.
- Extracted 38 executable script blocks into 30 named JavaScript files. Only exact duplicate scripts were shared. The code bodies and script execution order are preserved.
- Added the editing, deployment, and SEO review guides. No build step is required.

The new `/main.css` URL avoids reusing the smaller legacy stylesheet's cached URL for the new HTML. The old `/style.css` remains unchanged for Arena and cached older pages. The new main stylesheet is about 259 KB uncompressed, or 34 KB using local gzip. Actual Cloudflare transfer size depends on its compression and cache settings.

## Measured sizes

Measurements exclude the new guides. They describe source file sizes, not measured live loading speed.

| Measure | Original | Refactored | Reduction |
| --- | ---: | ---: | ---: |
| Non-Arena HTML (22 pages) | 899,137 bytes | 367,261 bytes | 59.2% |
| All HTML (40 pages) | 1,026,460 bytes | 494,584 bytes | 51.8% |
| All HTML, CSS, and JavaScript | 1,106,907 bytes | 1,072,188 bytes | 3.1% |
| All original site files plus new code | 77,772,722 bytes | 77,738,003 bytes | 34,719 bytes |

The full ZIP remains approximately the same size because images dominate the website's bytes. The documentation adds some bytes back. Consolidating CSS improves editing and enables cross-page reuse, but can add cold-load cost to smaller pages. Live performance must be measured before claiming a speed improvement.

## Validation completed

- 40 pages compared at widths of 390, 768, and 1440 pixels: **120 of 120 full-page screenshots matched byte-for-byte**. Animations were disabled and third-party content was controlled for deterministic comparison.
- All 22 changed pages compared with JavaScript enabled and deterministic API fixtures. Mobile menus, contact/giveaway switching, event searching/filtering, dashboard searching, and manual slideshow navigation were exercised where present. Output, requests, and existing errors matched their original counterparts.
- All 30 extracted JavaScript files passed syntax checks. Each extracted script body matches its original body, and the original script order is retained.
- The supplied renderer was exercised through a local HTMLRewriter-compatible test shim with normal data, empty events, the community-endpoint fallback, and API failure. Its target operations and response headers matched between original and refactored HTML in all 16 scenarios/version/page combinations.
- Four additional rendered-content comparisons covered home and Events at mobile and desktop widths, using the actual supplied rendering functions with fixture data.
- Titles, meta content, canonical URLs, JSON-LD, IDs, and form destinations were compared and preserved.
- All original non-HTML files and all Arena files are byte-for-byte unchanged. No missing local resources were found in the 120-page-view comparison.

The two existing null-canvas errors on Devotions and Prayers remain and are described in `SEO-REVIEW.md`. The test environment does not certify actual Twitch/YouTube playback, form delivery, live Google indexing, dashboard-level Cloudflare rules, or behavior in every browser. The live deployment checks are in `DEPLOYMENT.md`.

## Recommendations recorded at the initial stage

The sitemap/canonical changes, consistent event metadata, and two ember-script errors were subsequently approved and completed. Renderer outage/cache behavior, refresh protection, and new visible content remain separate decisions. See the current `SEO-REVIEW.md`.
