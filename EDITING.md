# Editing FaithForge Gaming

The non-Arena site now uses one main stylesheet: **`main.css`**. Page content stays in each page's HTML file. Interactive code lives in clearly named files under `assets/js/`. No build command, package installation, or framework is required to edit or publish the site.

## Which file should I edit?

| What you want to change | File |
| --- | --- |
| Colors, spacing, typography, mobile layouts, cards, backgrounds | `main.css` |
| Wording, ordinary links, images, headings, titles, descriptions | The relevant page's `index.html` |
| Home-page community data and event display | `assets/js/home/community-v2.js` |
| Home-page featured stream | `assets/js/home/live-stream.js` |
| Home-page Bible lookup | `assets/js/home/bible-reader.js` |
| Home-page navigation or particles | `assets/js/home/navigation.js` or `particles.js` |
| Events, search, filters, countdown, calendar data | `assets/js/events/calendar-v2.js` |
| Stream Team roster and live status | `assets/js/streamers/creators-v2.js` |
| Creator progress and quarterly dashboard settings | `assets/js/creatordashboard/dashboard-v2.js` |
| Individual creator streaming behavior | `assets/js/CREATOR/streaming.js` (lowercase folder names) |
| Contact and giveaway form behavior | `assets/js/contact/contact.js` |
| Doctrine-page Bible lookup | `assets/js/doctrine/bible-reader.js` |
| Raid Train settings, roster, schedule, featured stream | `assets/js/raidtrain/raid-train.js` |
| Devotions and Prayers slideshow behavior | `assets/js/shared/daily-slideshow.js` |
| About Us and Staff mobile navigation | `assets/js/shared/simple-navigation.js` |
| Individual creator mobile navigation | `assets/js/shared/creator-navigation.js` |
| Arena | Continue using `arena/EDITING.md`, `arena/arena-data.js`, and `arena/arena.css` |

The current creator content pages are `warrior_of_light777/index.html` and `romans1014xp/index.html`. Their mixed-case predecessors are compatibility redirects; edit the lowercase content files. Keep the old image paths. See `SEO-DEPLOYMENT.md` before copying this case-sensitive tree onto Windows/macOS.

The four `-v2.js` scripts in this table are the current SEO-edited versions. Their older unversioned copies remain only for cached HTML. The browser's common event metadata lives in `assets/js/shared/event-schema.js`; its marked block is also copied into both Cloudflare Workers. Keep those three implementations in sync if classification rules change. These event helpers change search metadata, not the calendar layout or filtering.

Other extracted navigation and particle scripts are in the corresponding page's folder under `assets/js/`.

## Finding the right CSS

The original pages contain genuine design differences. Their existing values have been preserved. Comments beginning `Pages:` identify the pages a rule applies to; shared rules list several pages.

Each non-Arena HTML file has a page class on its opening `<html>` tag. For example:

```html
<html lang="en" class="ffg-aboutus ffg-shared-base">
```

In `main.css`, a rule such as this affects only About Us:

```css
:where(.ffg-aboutus) .about-container {
  max-width: 900px;
}
```

Search for the element's existing class name, such as `about-container`, and check the page names in the nearby comments. Search `ffg-home` for home-page rules, `ffg-events` for Events, or the lowercase folder name for another page. `ffg-not-found` identifies the 404 page.

`ffg-creators` groups the seven individual creator profile pages. `ffg-shared-base` identifies pages that previously loaded the original shared stylesheet. Keep these HTML classes in place. `:where(...)` isolates page rules without increasing their CSS specificity.

Keep the order of existing CSS sections. Later rules and mobile media queries intentionally override earlier ones. When changing one page, check whether the rule is shared with other pages first. It is normal for a page name to appear in several sections: this preserves its original cascade while sharing exact duplicates.

The stylesheet is deliberately readable rather than minified. There is no generated file to rebuild after editing it.

## Files to retain

- `style.css` remains unchanged. Arena and older cached versions of pages still use it. For the refactored non-Arena site, edit `main.css`.
- Keep `arena/arena.css`, `arena/arena.js`, `arena/arena-data.js`, and Arena HTML files in their current locations.
- Keep `embers.js`: multiple pages and Arena still load it.
- Keep the external `<script src="...">` tags in their current order and positions. Do not add `async` or move them into the head without checking their dependencies.
- Keep JSON-LD `<script type="application/ld+json">` blocks in the HTML. They contain search-engine data, not interactive JavaScript.
- Keep Cloudflare's IDs, including `serverWebsiteSchema`, `serverEventsSchema`, `homepageEventList`, `eventsMain`, `nextEventContainer`, and `eventsGrid`.

A small number of inline style attributes and HTML event handlers remain. Some styles are written dynamically by existing scripts. These were preserved to avoid changing precedence and behavior; all embedded `<style>` blocks in the 22 non-Arena pages have been extracted.

## Preview and publish

For local preview, open a terminal in the folder containing `index.html` and run:

```sh
python -m http.server 5500 --bind 127.0.0.1
```

Open `http://127.0.0.1:5500/`. That origin is already allowed by the supplied Raid Train API code. Cloudflare's server-side rendering runs on the configured live domain, so a local preview cannot prove the live Worker setup.

Follow `SEO-DEPLOYMENT.md` for this release, along with the CSS notes in `DEPLOYMENT.md`. The sitemap, lowercase creator pages, event metadata, and two error fixes are now included. Further content, design, image, and Cloudflare cache-policy changes remain separate decisions.
