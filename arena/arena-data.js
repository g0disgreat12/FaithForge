/* FAITHFORGE ARENA — EDIT YOUR CONTENT HERE
   Repository: g0disgreat12/FaithForge, branch: main
   Website: https://faithforgegaming.com/arena/

   Edit this file in GitHub, then Commit changes. Your existing GitHub Pages
   publishing handles the update. No admin account, token, install, or build step.

   Add an entry by copying one complete { ... }, block inside the matching list.
   Every block ends with a comma so adding another entry is straightforward.
   Keep existing IDs unchanged. New IDs use lowercase words-with-hyphens.
   Use double quotes around text. Use \" inside text if you need a quotation mark.
   Dates: YYYY-MM-DD. Upcoming timestamps: include an offset, e.g. -04:00.
   Scores and priorities are numbers without quotation marks.
   Set page: "" for NEW entries: a detail page is provided automatically.
   The filled-in page paths below link to the prebuilt HTML pages in this package.

   See EDITING.md and entry-templates.txt for copy-and-paste examples.
*/
window.FFG_ARENA = {
  schemaVersion: 1,

  // SITE SETTINGS — your existing channel, Formspree endpoint, and Discord
  settings: {
    "twitchChannel": "faithforgegaming",
    "formspreeEndpoint": "https://formspree.io/f/mrbdwynw",
    "discordUrl": "https://discord.gg/bAQrudk5a9",
    "frequency": "We currently plan at most one community challenge per quarter. Dates and formats are agreed together."
  },

  // GAMES — set status to "open" or "paused"; lower priority appears first
  games: [
    {
      "id": "fortnite",
      "name": "Fortnite",
      "priority": 1,
      "label": "Our main event",
      "status": "open",
      "description": "Our primary game for community competition. Bring your teams and help us shape the next friendly challenge.",
      "formats": [
        "Custom Games Tournament",
        "Team vs Team",
        "Zero Build",
        "Creative Challenges"
      ],
      "hosting": "Custom lobby or agreed Creative map. Teams, scoring, and rules are confirmed together.",
      "image": "https://faithforgegaming.com/Gameswebp/FORTNITE.webp",
      "rulesUrl": "",
      "page": "games/fortnite/"
    },
    {
      "id": "minecraft",
      "name": "Minecraft Minigames",
      "priority": 2,
      "label": "Next in the forge",
      "status": "open",
      "description": "Our next main challenge game behind Fortnite. Compete together on FaithForge’s Multiverse server.",
      "formats": [
        "Bed Wars",
        "Cake Wars",
        "Siege Wars",
        "Forge Brawler",
        "Build Battle",
        "Parkour",
        "Team Minigames"
      ],
      "hosting": "Hosted on the FaithForge Minecraft Multiverse server. Java and Bedrock players are welcome; server access, minigame selection, and event rules are confirmed together.",
      "image": "https://faithforgegaming.com/Gameswebp/MINECRAFT.webp",
      "rulesUrl": "",
      "page": "games/minecraft/"
    },
    {
      "id": "ark-asa",
      "name": "ARK: Survival Ascended",
      "priority": 3,
      "label": "Team challenges",
      "status": "open",
      "description": "Tribe against tribe, community alongside community. Plan a team challenge with shared rules and a clear objective.",
      "formats": [
        "Team vs Team",
        "Base Defense",
        "Resource Race",
        "Custom Objectives"
      ],
      "hosting": "Server, map, tribe sizes, and event settings agreed before play.",
      "image": "https://faithforgegaming.com/Gameswebp/ARK.webp",
      "rulesUrl": "",
      "page": "games/ark-asa/"
    },
    {
      "id": "call-of-duty",
      "name": "Call of Duty",
      "priority": 4,
      "label": "Squad competition",
      "status": "open",
      "description": "Bring your squad for a community match. We’ll agree on the title, game mode, and format together.",
      "formats": [
        "Team vs Team",
        "Private Match",
        "Custom Series"
      ],
      "hosting": "Title, platforms, team sizes, map pool, and scoring confirmed together.",
      "image": "https://faithforgegaming.com/Gameswebp/CALLOFDUTY.webp",
      "rulesUrl": "",
      "page": "games/call-of-duty/"
    },
  ],

  // COMMUNITIES — create an opponent here before adding its match
  communities: [
    {
      "id": "respawn-church",
      "name": "Respawn Church",
      "description": "Our opponent in the October 3, 2026 Fortnite Custom Games tournament. Three FaithForge teams competed, with FFG finishing 6–3.",
      "logo": "https://faithforgegaming.com/arena/logos/respawn.webp",
      "website": "",
      "discord": "",
      "stream": "",
      "page": "communities/respawn-church/"
    },
  ],

  // CAPTAINS — reusable profiles for the teams representing FaithForge
  captains: [
    {
      "id": "mcrevolation",
      "name": "𝕸𝖈𝕽𝖊𝖛𝖔𝖑𝖆𝖙𝖎𝖔𝖓",
      "description": "FaithForge captain at the October 3, 2026 Fortnite tournament.",
      "link": "",
      "page": "captains/mcrevolation/"
    },
    {
      "id": "doctorjsways",
      "name": "DoctorJSWAYS",
      "description": "FaithForge captain at the October 3, 2026 Fortnite tournament.",
      "link": "",
      "page": "captains/doctorjsways/"
    },
    {
      "id": "g0dsblessing",
      "name": "G0dsblessing",
      "description": "FaithForge captain at the October 3, 2026 Fortnite tournament.",
      "link": "",
      "page": "captains/g0dsblessing/"
    },
  ],

  // COMPLETED MATCHES — newest can be added first; results calculate automatically
  matches: [
    {
      "id": "2026-10-03-respawn-church",
      "date": "2026-10-03",
      "gameId": "fortnite",
      "communityId": "respawn-church",
      "format": "Custom Games Tournament",
      "scoreType": "games",
      "scoreDirection": "higher",
      "ffgScore": 6,
      "opponentScore": 3,
      "tiedGames": 0,
      "description": "Nine games. Three FFG captains. Six victories. FaithForge Gaming faced Respawn Church in a Fortnite Custom Games tournament on October 3, 2026. Each FaithForge captain led a team through three games, and FFG finished with six wins and three losses.",
      "vodUrl": "https://youtube.com/live/KrDOQBEX1GI",
      "image": "https://faithforgegaming.com/arena/logos/respawn.webp",
      "captainResults": [
        {
          "captainId": "mcrevolation",
          "wins": 3,
          "losses": 0,
          "ties": 0
        },
        {
          "captainId": "doctorjsways",
          "wins": 2,
          "losses": 1,
          "ties": 0
        },
        {
          "captainId": "g0dsblessing",
          "wins": 1,
          "losses": 2,
          "ties": 0
        }
      ],
      "page": "matches/2026-10-03-respawn-church/"
    },
  ],

  // UPCOMING CHALLENGES — leave empty until a date is agreed
  upcoming: [
  ],
};
