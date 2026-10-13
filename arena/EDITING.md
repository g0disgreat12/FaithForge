# Updating FaithForge Arena

Use your normal GitHub editor:

[Edit arena-data.js](https://github.com/g0disgreat12/FaithForge/edit/main/arena/arena-data.js)

Make the change, click **Commit changes**, and allow your existing website deployment to finish. There is no Arena admin account to configure.

## Which file do I edit?

| Change | File / section |
| --- | --- |
| Add a win, loss, tie, recap, or captain result | `arena-data.js` → `matches` |
| Add an opposing community, its bio, logo, or links | `arena-data.js` → `communities` |
| Add a game, change its formats, or pause challenges | `arena-data.js` → `games` |
| Add a captain or update the captain’s bio | `arena-data.js` → `captains` |
| Announce an upcoming challenge | `arena-data.js` → `upcoming` |
| Change your channel, Formspree address, or quarterly message | `arena-data.js` → `settings` |
| Change colors, spacing, or the Arena layout | `arena.css` |
| Change the saved wording, title, or navigation of a page | That page’s `index.html` |
| Change the site’s automatic calculations or search behavior | `arena.js` (normally leave this alone) |

## Add a result

1. If this is a new opponent, add it to `communities` first. Give it a simple unique ID, such as `new-community`.
2. In `matches`, copy one whole `{ ... },` block, or use the match example in `entry-templates.txt`.
3. Change its `id`, date, opponent ID, game ID, format, and scores.
4. Set `page` to `""` for a new entry. Its match detail view will work automatically.
5. Add the recap and an optional replay URL.
6. If you have team details, fill in `captainResults`; otherwise use `[]`.
7. Commit the file.

You do not enter the result twice: **higher FFG score = win, lower = loss, equal = tie**. For time trials or other lower-score events, use `scoreType: "custom"` or `"points"`, and `scoreDirection: "lower"`.

An entire tournament counts **once** in the overall record. A 6–3 game score is one tournament win, not six tournament wins.

## Add or change a game

In `games`, copy a block and update:

- `id`: a unique lowercase name, e.g. `rocket-league`.
- `name`: the public name.
- `priority`: smaller numbers appear first. Fortnite is 1; Minecraft is 2.
- `status`: `"open"` or `"paused"`.
- `formats`: quoted formats separated by commas.
- `description`, `hosting`, optional image and rules URL.
- `page`: use `""` for a new entry.

Open games appear in the challenge form automatically. Paused games remain in the directory and history but are removed from the form’s game choices.

Minecraft’s starting formats reflect the current Servers page: Bed Wars, Cake Wars, Siege Wars, Forge Brawler, Build Battle, Parkour, and team minigames. Confirm the exact event format together before announcing a match.

## Add captain results

Create the captain in `captains` first, then use that ID in a match’s `captainResults`.

For **Games won** scoring, all captain wins must total `ffgScore`, all losses must total `opponentScore`, and all ties must total `tiedGames`. This guards against accidentally entering a wrong score. If you only know the overall score, leave `captainResults: []`.

Captain statistics describe their team’s games, not individual player kills or personal tournament wins.

## Announce the next challenge

Add an entry in `upcoming`. Use a timestamp with an explicit UTC offset:

```js
startsAt: "2027-01-16T20:00:00-05:00",
```

This example means 8 PM Eastern standard time; it is only a template, not a scheduled event. Use the correct offset for your actual event date (`-04:00` during Eastern daylight time, `-05:00` during standard time). Visitors see the equivalent in their local time zone.

Use `communityId: ""` if the opponent is not announced. Once the event is complete, add it under `matches` and remove it from `upcoming`. Past upcoming entries are marked as awaiting a recorded result until removed.

## A few simple editing rules

- Keep existing IDs unchanged; other records and shared links use them.
- Keep quotation marks around text, but not around numeric scores.
- Each entry ends with a comma. Keep the surrounding square brackets.
- Use `""` for an optional empty link and `[]` for an empty list.
- Use complete `https://` links for images, websites, replays, and Discord invites.
- Don’t delete a game, community, or captain while a match still refers to its ID. Pause a game instead, or update the linked records first.
- All content in this file is public. Put public community information here, not private challenge-request details.

## Want another physical HTML page?

It is optional: `page: ""` already gives every new entry a working detail view.

If you want a clean folder URL, copy a similar prebuilt `index.html` to your new folder at the same depth. Change its `<body data-id="...">` to the new record’s ID, update its title/description/canonical URL and saved HTML, then set that entry’s `page` to the matching path inside `arena`, such as `matches/2027-01-example/`. Keep the `data-page` value (`matches`, `games`, `communities`, or `captains`) unchanged.

The existing prebuilt pages already have these settings filled in.
