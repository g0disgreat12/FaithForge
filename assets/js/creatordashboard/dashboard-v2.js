/*
      ============================================================
      FAITHFORGE STREAM TEAM DASHBOARD — UPDATE ONLY THIS SECTION
      ============================================================

      1) UPDATE A STREAMER
         The first number is completed long-form videos.
         The second number is completed short-form videos.

         "2026-Q4": quarterProgress(1, 4)

         Optional proof links:
         "2026-Q4": quarterProgress(1, 4, {
           longFormLinks: ["https://..."],
           shortLinks: ["https://...", "https://..."]
         })

      2) ADD A NEW STREAMER
         Copy one creator({...}) block, paste it at the end of STREAMERS,
         add a comma after the prior block, and replace the profile details.
         If a creator has no progress entry for a quarter, the site safely
         shows 0 completed rather than breaking.

      3) START A NEW QUARTER
         Add the new quarter to QUARTERS, then change DEFAULT_QUARTER_ID.
         Do not delete prior quarter entries. They remain searchable and
         viewable in the quarter selector.

      Only content completion is entered manually. Community participation,
      merch access, and Christ-honoring conduct remain team expectations for
      personal conversation and are intentionally not scored here.
      ============================================================
    */

    var DEFAULT_QUARTER_ID = "2026-Q4";

    var QUARTERS = {
      "2026-Q4": {
        label: "Q4 2026",
        apiValue: "Q4 2026",
        start: "2026-10-01",
        end: "2026-12-31",
        longFormRequired: 1,
        shortsRequired: 6
      }

      /*
      EXAMPLE FOR THE NEXT QUARTER:

      ,"2026-Q4": {
        label: "Q4 2026",
        apiValue: "Q4 2026",
        start: "2026-10-01",
        end: "2026-12-31",
        longFormRequired: 1,
        shortsRequired: 6
      }
      */
    };

    function quarterProgress(longFormDone, shortsDone, options) {
      var extras = options || {};

      return {
        longFormDone: Number(longFormDone || 0),
        shortsDone: Number(shortsDone || 0),
        bonusLongFormDone: Number(extras.bonusLongFormDone || 0),
        longFormLinks: Array.isArray(extras.longFormLinks) ? extras.longFormLinks : [],
        shortLinks: Array.isArray(extras.shortLinks) ? extras.shortLinks : [],
        note: extras.note || ""
      };
    }

    function creator(details) {
      return Object.assign({
        login: "",
        name: "",
        handle: "",
        image: "/Anvil.webp",
        fallbackImage: "/Anvil.webp",
        platform: "Twitch",
        profileUrl: "",
        twitchUrl: "",
        joinedDate: "",
        notes: "",
        progress: {}
      }, details || {});
    }

    var STREAMERS = [
      creator({
        login: "faithforgegaming",
        name: "FaithForgeGaming",
        handle: "FaithForgeGaming",
        image: "/Anvil.webp",
        platform: "Twitch / YouTube / TikTok / Rumble / Kick",
        profileUrl: "/faithforgegaming/",
        twitchUrl: "https://www.twitch.tv/faithforgegaming",
        notes: "Main FaithForge channel. Use this if the main brand channel has its own quarterly requirements.",
        progress: {
          "2026-Q4": quarterProgress(1, 6)
        }
      }),

      creator({
        login: "mooncalfmage",
        name: "Mooncalfmage",
        handle: "Mooncalfmage",
        image: "/mooncalfmage/mooncalfmage.webp",
        platform: "Twitch / YouTube / TikTok",
        profileUrl: "/mooncalfmage/",
        twitchUrl: "https://www.twitch.tv/mooncalfmage",
        progress: {
          "2026-Q4": quarterProgress(0, 0)
        }
      }),

      creator({
        login: "romans1014xp",
        name: "Romans1014XP",
        handle: "Romans1014XP",
        image: "/romans1014XP/romans1014XP.webp",
        platform: "Twitch / YouTube / TikTok / Instagram / Facebook",
        profileUrl: "/romans1014xp/",
        twitchUrl: "https://www.twitch.tv/romans1014xp",
        progress: {
          "2026-Q4": quarterProgress(0, 4)
        }
      }),

      creator({
        login: "doctorjsways",
        name: "DoctorJSWAYS",
        handle: "DoctorJSWAYS",
        image: "/DoctorJSWAYS/DoctorJSWAYS1.webp",
        platform: "Twitch / YouTube / TikTok",
        profileUrl: "/DoctorJSWAYS/",
        twitchUrl: "https://www.twitch.tv/doctorjsways",
        progress: {
          "2026-Q4": quarterProgress(1, 0)
        }
      }),

      creator({
        login: "seawolf_30",
        name: "Seawolf_30",
        handle: "Seawolf_30",
        image: "/Seawolf_30/Seawolf.webp",
        platform: "Twitch / YouTube",
        profileUrl: "/Seawolf_30/",
        twitchUrl: "https://www.twitch.tv/seawolf_30",
        progress: {
          "2026-Q4": quarterProgress(0, 0)
        }
      }),

      creator({
        login: "ninjasaucex",
        name: "NinjaSauceX",
        handle: "NinjaSauceX",
        image: "/NinjaSauceX/NinjaSauceX.webp",
        platform: "Twitch / YouTube",
        profileUrl: "/NinjaSauceX/",
        twitchUrl: "https://www.twitch.tv/ninjasaucex",
        progress: {
          "2026-Q4": quarterProgress(0, 0)
        }
      }),

      creator({
        login: "warrior_of_light777",
        name: "warrior_of_light777",
        handle: "warrior_of_light777",
        image: "/Warrior_of_light777/warrior_of_light.webp",
        platform: "Twitch / YouTube / TikTok",
        profileUrl: "/warrior_of_light777/",
        twitchUrl: "https://www.twitch.tv/warrior_of_light777",
        progress: {
          "2026-Q4": quarterProgress(1, 0)
        }
      })

      /*
      NEW STREAMER TEMPLATE:

      ,creator({
        login: "twitch_login",
        name: "Display Name",
        handle: "SocialHandle",
        image: "/CreatorFolder/avatar.webp",
        platform: "Twitch / YouTube / TikTok",
        profileUrl: "/CreatorFolder/",
        twitchUrl: "https://www.twitch.tv/twitch_login",
        joinedDate: "2026-09-01",
        progress: {
          "2026-Q4": quarterProgress(0, 0)
        }
      })
      */
    ];

    /*
      ============================================================
      END OF MANUAL UPDATE SECTION
      ============================================================
    */

    var STREAM_STATUS_ENDPOINT = "https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/twitch-status";
    var RECENT_GAMES_ENDPOINT = "https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games";
    var QUARTER_STATS_ENDPOINT = "https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/quarter-stats";

    var statusByLogin = new Map();
    var recentGamesByLogin = new Map();
    var quarterStatsByLogin = new Map();

    var activeQuarterId = QUARTERS[DEFAULT_QUARTER_ID] ? DEFAULT_QUARTER_ID : Object.keys(QUARTERS)[0];
    var lastStatusLoadedAt = null;
    var lastRecentLoadedAt = null;
    var lastStatsLoadedAt = null;

    function escapeHTML(value) {
      return String(value === undefined || value === null ? "" : value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function safeUrl(value) {
      var url = String(value || "").trim();
      if (!url) return "";
      if (url.startsWith("/")) return url;

      try {
        var parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "";
      } catch (error) {
        return "";
      }
    }

    function normalizeLogin(value) {
      return String(value || "").trim().toLowerCase();
    }

    function normalizeSearch(value) {
      return String(value || "")
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(Number(value || 0), min), max);
    }

    function formatNumber(value, maximumFractionDigits) {
      var number = Number(value || 0);
      if (!Number.isFinite(number)) return "0";

      return number.toLocaleString(undefined, {
        maximumFractionDigits: maximumFractionDigits === undefined ? 0 : maximumFractionDigits
      });
    }

    function formatHours(value) {
      var number = Number(value || 0);
      if (!Number.isFinite(number) || number <= 0) return "0";
      return formatNumber(number, Number.isInteger(number) ? 0 : 1);
    }

    function formatDateTime(value) {
      if (!value) return "—";
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString();
    }

    function formatShortDate(value) {
      if (!value) return "—";
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }

    function getQuarter() {
      return QUARTERS[activeQuarterId] || QUARTERS[DEFAULT_QUARTER_ID];
    }

    function getProgress(streamer) {
      return streamer.progress[activeQuarterId] || quarterProgress(0, 0);
    }

    function getStreamerStatus(login) {
      return statusByLogin.get(normalizeLogin(login)) || {
        login: normalizeLogin(login),
        live: false,
        display_name: "",
        game_name: "",
        title: "",
        viewer_count: 0,
        started_at: "",
        game_id: "",
        box_art_url: "",
        thumbnail_url: ""
      };
    }

    function getRecentGames(login) {
      return recentGamesByLogin.get(normalizeLogin(login)) || [];
    }

    function getQuarterStats(login) {
      return quarterStatsByLogin.get(normalizeLogin(login)) || {
        login: normalizeLogin(login),
        streamCount: 0,
        liveHours: 0,
        avgViewers: 0,
        peakViewers: 0,
        snapshotCount: 0,
        lastLiveAt: "",
        topGame: "",
        latestTitle: "",
        latestGame: "",
        latestViewerCount: 0,
        latestCheckedAt: "",
        latestStartedAt: ""
      };
    }

    function hasRealStats(stats) {
      return Number(stats.snapshotCount || 0) > 0 ||
        Number(stats.streamCount || 0) > 0 ||
        Number(stats.liveHours || 0) > 0;
    }

    function getGameName(game) {
      return game && (game.name || game.game_name || game.category) || "—";
    }

    function getGameTitle(game) {
      return game && (game.last_title || game.title || game.description) || "";
    }

    function getGameLastPlayed(game) {
      return game && (
        game.last_played ||
        game.lastLive ||
        game.last_live_at ||
        game.played_at ||
        game.last_streamed_at
      ) || "";
    }

    function getContentCompletion(streamer) {
      var quarter = getQuarter();
      var progress = getProgress(streamer);
      var longDone = clamp(progress.longFormDone, 0, quarter.longFormRequired);
      var shortsDone = clamp(progress.shortsDone, 0, quarter.shortsRequired);
      var totalDone = longDone + shortsDone;
      var totalRequired = quarter.longFormRequired + quarter.shortsRequired;

      return {
        longDone: longDone,
        shortsDone: shortsDone,
        totalDone: totalDone,
        totalRequired: totalRequired,
        complete: longDone >= quarter.longFormRequired && shortsDone >= quarter.shortsRequired,
        percent: totalRequired ? Math.round((totalDone / totalRequired) * 100) : 100
      };
    }

    function renderBadge(label, className) {
      return '<span class="badge ' + escapeHTML(className || "") + '">' + escapeHTML(label) + "</span>";
    }

    function renderBadges(streamer) {
      var status = getStreamerStatus(streamer.login);
      var content = getContentCompletion(streamer);
      var badges = [];

      if (status.live) badges.push(renderBadge("Live Now", "live"));
      badges.push(content.complete
        ? renderBadge("Content Complete", "complete")
        : renderBadge(content.percent + "% Content", "progress"));

      return badges.join("");
    }

    function renderChecklist(title, doneCount, requiredCount, links, itemLabel) {
      var items = [];

      for (var index = 0; index < requiredCount; index += 1) {
        var isDone = index < doneCount;
        var link = safeUrl((links || [])[index]);
        var label = itemLabel + " " + (index + 1);

        items.push(
          '<div class="check-item ' + (isDone ? "done" : "") + '">' +
            '<span class="check-icon" aria-hidden="true">' + (isDone ? "✓" : "○") + "</span>" +
            "<span>" + escapeHTML(label) + "</span>" +
            (link ? '<a href="' + escapeHTML(link) + '" target="_blank" rel="noopener noreferrer">View</a>' : "") +
          "</div>"
        );
      }

      return (
        '<section class="checklist">' +
          "<h5>" + escapeHTML(title) + "</h5>" +
          items.join("") +
        "</section>"
      );
    }

    function renderRecentGames(streamer) {
      var games = getRecentGames(streamer.login);

      if (!games.length) {
        return (
          '<div class="recent-item">' +
            "<strong>Recent Games</strong>" +
            "No recent game history is available yet." +
          "</div>"
        );
      }

      return games.slice(0, 3).map(function (game) {
        var title = getGameTitle(game);
        var lastPlayed = getGameLastPlayed(game);

        return (
          '<div class="recent-item">' +
            "<strong>" + escapeHTML(getGameName(game)) + "</strong>" +
            (title ? escapeHTML(title) : "No saved stream title") +
            (lastPlayed ? "<br>Last played: " + escapeHTML(formatShortDate(lastPlayed)) : "") +
          "</div>"
        );
      }).join("");
    }

    function renderStreamerCard(streamer) {
      var quarter = getQuarter();
      var progress = getProgress(streamer);
      var content = getContentCompletion(streamer);
      var status = getStreamerStatus(streamer.login);
      var stats = getQuarterStats(streamer.login);
      var profileUrl = safeUrl(streamer.profileUrl);
      var twitchUrl = safeUrl(streamer.twitchUrl);
      var imageUrl = safeUrl(streamer.image) || "/Anvil.webp";
      var fallbackUrl = safeUrl(streamer.fallbackImage) || "/Anvil.webp";
      var currentGame = status.live ? (status.game_name || "Live on Twitch") : (stats.latestGame || "—");
      var streamTitle = status.live ? (status.title || "Currently live") : (stats.latestTitle || "—");

      var checklistHTML =
        renderChecklist(
          "Quality Long-Form Video",
          content.longDone,
          quarter.longFormRequired,
          progress.longFormLinks,
          "Long-form video"
        ) +
        renderChecklist(
          "Shorts / Reels / TikToks",
          content.shortsDone,
          quarter.shortsRequired,
          progress.shortLinks,
          "Short-form video"
        );

      var migrationNote = "";

      if (progress.bonusLongFormDone > 0) {
        migrationNote =
          '<div class="migration-note">' +
            "<strong>Preserved previous progress:</strong> " +
            formatNumber(progress.bonusLongFormDone) +
            " additional long-form completion from the former merch track remains recorded, " +
            "but it is no longer required under the universal standard." +
          "</div>";
      }

      return (
        '<article class="streamer-card panel" data-login="' + escapeHTML(streamer.login) + '">' +
          '<div class="streamer-top">' +
            '<img class="streamer-avatar" src="' + escapeHTML(imageUrl) + '" alt="' + escapeHTML(streamer.name) +
              ' avatar" onerror="this.onerror=null;this.src=\'' + escapeHTML(fallbackUrl) + '\';">' +
            "<div>" +
              '<div class="streamer-name-row">' +
                '<h2 class="streamer-name">' + escapeHTML(streamer.name) + "</h2>" +
                renderBadges(streamer) +
              "</div>" +
              '<p class="streamer-meta">' +
                "@" + escapeHTML(streamer.handle) + " • " + escapeHTML(streamer.platform) +
                (profileUrl ? ' • <a href="' + escapeHTML(profileUrl) + '">Creator Page</a>' : "") +
                (twitchUrl ? ' • <a href="' + escapeHTML(twitchUrl) + '" target="_blank" rel="noopener noreferrer">Twitch</a>' : "") +
              "</p>" +
            "</div>" +
          "</div>" +

          '<div class="analytics-strip">' +
            '<div class="metric ' + (status.live ? "live-metric" : "") + '">' +
              "<span>Live Status</span>" +
              "<strong>" + (status.live ? "Live" : "Offline") + "</strong>" +
              "<small>" + (status.live ? "Currently streaming" : "Not live right now") + "</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Current Viewers</span>" +
              "<strong>" + (status.live ? formatNumber(status.viewer_count) : "—") + "</strong>" +
              "<small>Visible while live</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Quarter Streams</span>" +
              "<strong>" + formatNumber(stats.streamCount) + "</strong>" +
              "<small>" + (hasRealStats(stats) ? "From quarter snapshots" : "No live snapshot yet") + "</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Live Hours</span>" +
              "<strong>" + formatHours(stats.liveHours) + "</strong>" +
              "<small>Estimated by 15-min checks</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Average Viewers</span>" +
              "<strong>" + formatNumber(stats.avgViewers, 1) + "</strong>" +
              "<small>Average live snapshot</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Peak Viewers</span>" +
              "<strong>" + formatNumber(stats.peakViewers) + "</strong>" +
              "<small>Highest live snapshot</small>" +
            "</div>" +
            '<div class="metric">' +
              "<span>Top Game</span>" +
              "<strong>" + escapeHTML(stats.topGame || currentGame || "—") + "</strong>" +
              "<small>Most frequent category</small>" +
            "</div>" +
            '<div class="metric ' + (hasRealStats(stats) ? "" : "warning") + '">' +
              "<span>Last Live</span>" +
              "<strong>" + escapeHTML(formatShortDate(stats.lastLiveAt)) + "</strong>" +
              "<small>" + (hasRealStats(stats) ? "From quarter analytics" : "No live snapshot yet") + "</small>" +
            "</div>" +
          "</div>" +

          '<div class="requirement-wrap">' +
            '<div class="progress-header">' +
              "<h3>" + escapeHTML(quarter.label) + " Content Progress</h3>" +
              "<span>" + content.totalDone + "/" + content.totalRequired + " complete • " + content.percent + "%</span>" +
            "</div>" +
            '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
              content.percent + '" aria-label="' + escapeHTML(streamer.name) + ' content completion">' +
              '<div class="progress-fill" style="width:' + content.percent + '%"></div>' +
            "</div>" +

            '<div class="requirements-layout">' +
              '<section class="track-section">' +
                '<div class="track-head">' +
                  "<h4>Universal Quarterly Requirement</h4>" +
                  (content.complete
                    ? renderBadge("Complete", "complete")
                    : renderBadge("In Progress", "progress")) +
                "</div>" +
                '<p class="track-subtitle">' +
                  "Required for every FFG streamer: " + quarter.longFormRequired +
                  " quality long-form video and " + quarter.shortsRequired +
                  " short-form videos. Content may build the creator's own channel and does not have to be about FFG." +
                "</p>" +
                '<div class="mini-grid">' +
                  '<div class="mini-card"><span>Long Form</span><strong>' +
                    content.longDone + "/" + quarter.longFormRequired + "</strong></div>" +
                  '<div class="mini-card"><span>Short Form</span><strong>' +
                    content.shortsDone + "/" + quarter.shortsRequired + "</strong></div>" +
                "</div>" +
                '<div class="checklist-grid">' + checklistHTML + "</div>" +
                migrationNote +
              "</section>" +
            "</div>" +
          "</div>" +

          '<div class="recent-box">' +
            "<h4>Cloudflare / Twitch Activity</h4>" +
            '<div class="recent-list">' +
              '<div class="recent-item">' +
                "<strong>Current / Latest Stream</strong>" +
                escapeHTML(streamTitle) +
                (status.live && status.started_at ? "<br>Started: " + escapeHTML(formatDateTime(status.started_at)) : "") +
              "</div>" +
              renderRecentGames(streamer) +
            "</div>" +
          "</div>" +

          (progress.note
            ? '<div class="notes"><strong>Quarter note:</strong> ' + escapeHTML(progress.note) + "</div>"
            : "") +
          (streamer.notes
            ? '<div class="notes"><strong>Creator note:</strong> ' + escapeHTML(streamer.notes) + "</div>"
            : "") +
        "</article>"
      );
    }

    function normalizeStatusChannel(rawChannel) {
      var channel = rawChannel || {};
      var login = normalizeLogin(
        channel.login ||
        channel.user_login ||
        channel.channel_login ||
        channel.channel ||
        channel.name
      );

      return {
        login: login,
        display_name: channel.display_name || channel.user_name || login,
        live: Boolean(channel.live || channel.type === "live" || channel.is_live),
        game_name: channel.game_name || channel.game || channel.category || "",
        title: channel.title || channel.stream_title || "",
        viewer_count: Number(channel.viewer_count || channel.viewers || 0) || 0,
        started_at: channel.started_at || "",
        game_id: channel.game_id || "",
        box_art_url: channel.box_art_url || channel.game_box_art_url || "",
        thumbnail_url: channel.thumbnail_url || ""
      };
    }

    function applyStatusPayload(payload) {
      var rawChannels = Array.isArray(payload.channels)
        ? payload.channels
        : (Array.isArray(payload.data) ? payload.data : []);

      rawChannels.forEach(function (rawChannel) {
        var status = normalizeStatusChannel(rawChannel);
        if (status.login) statusByLogin.set(status.login, status);
      });

      lastStatusLoadedAt = payload.cached_at || new Date().toISOString();
    }

    function applyQuarterStatsPayload(payload) {
      var stats = Array.isArray(payload.stats)
        ? payload.stats
        : (Array.isArray(payload.data) ? payload.data : []);

      stats.forEach(function (item) {
        var login = normalizeLogin(item.login || item.user_login || item.channel_login || item.name);
        if (!login) return;

        quarterStatsByLogin.set(login, {
          login: login,
          quarter: item.quarter || payload.quarter || getQuarter().apiValue,
          snapshotCount: Number(item.snapshotCount ?? item.snapshot_count ?? 0),
          streamCount: Number(item.streamCount ?? item.stream_count ?? 0),
          liveHours: Number(item.liveHours ?? item.live_hours ?? 0),
          avgViewers: Number(item.avgViewers ?? item.avg_viewers ?? 0),
          peakViewers: Number(item.peakViewers ?? item.peak_viewers ?? 0),
          lastLiveAt: item.lastLiveAt || item.last_live_at || "",
          topGame: item.topGame || item.top_game || "",
          topGameSnapshots: Number(item.topGameSnapshots ?? item.top_game_snapshots ?? 0),
          latestTitle: item.latestTitle || item.latest_title || "",
          latestGame: item.latestGame || item.latest_game || "",
          latestViewerCount: Number(item.latestViewerCount ?? item.latest_viewer_count ?? 0),
          latestCheckedAt: item.latestCheckedAt || item.latest_checked_at || "",
          latestStartedAt: item.latestStartedAt || item.latest_started_at || "",
          latestThumbnailUrl: item.latestThumbnailUrl || item.latest_thumbnail_url || ""
        });
      });

      lastStatsLoadedAt = payload.cached_at || new Date().toISOString();
    }

    function applyRecentGamesPayload(payload) {
      if (payload.channels && typeof payload.channels === "object") {
        Object.entries(payload.channels).forEach(function (entry) {
          recentGamesByLogin.set(
            normalizeLogin(entry[0]),
            Array.isArray(entry[1]) ? entry[1].slice(0, 4) : []
          );
        });
      }

      if (payload.login && Array.isArray(payload.games)) {
        recentGamesByLogin.set(normalizeLogin(payload.login), payload.games.slice(0, 4));
      }

      lastRecentLoadedAt = payload.cached_at || new Date().toISOString();
    }

    async function fetchJson(url) {
      var response = await fetch(url, { cache: "no-store" });
      var payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.details || payload.error || "Request failed: " + response.status);
      }

      return payload;
    }

    async function refreshStatuses() {
      var payload = await fetchJson(STREAM_STATUS_ENDPOINT);
      applyStatusPayload(payload);
    }

    async function refreshRecentGames() {
      try {
        var allPayload = await fetchJson(RECENT_GAMES_ENDPOINT + "?limit=4");
        applyRecentGamesPayload(allPayload);
      } catch (error) {
        console.warn("All recent-games request failed. Trying individual creators.", error);

        await Promise.allSettled(STREAMERS.map(async function (streamer) {
          var payload = await fetchJson(
            RECENT_GAMES_ENDPOINT + "?login=" + encodeURIComponent(streamer.login) + "&limit=4"
          );
          applyRecentGamesPayload(payload);
        }));
      }
    }

    async function refreshQuarterStats() {
      var quarter = getQuarter();
      var payload = await fetchJson(
        QUARTER_STATS_ENDPOINT + "?quarter=" + encodeURIComponent(quarter.apiValue || quarter.label)
      );
      applyQuarterStatsPayload(payload);
    }

    function updateDataNote(state, message) {
      var dataNote = document.getElementById("dataNote");
      var statusTime = lastStatusLoadedAt ? formatDateTime(lastStatusLoadedAt) : "not loaded";
      var recentTime = lastRecentLoadedAt ? formatDateTime(lastRecentLoadedAt) : "not loaded";
      var statsTime = lastStatsLoadedAt ? formatDateTime(lastStatsLoadedAt) : "not loaded";

      dataNote.innerHTML =
        "<strong>Live data:</strong> " + escapeHTML(message) +
        "<br><span>Status: " + escapeHTML(statusTime) +
        " • Recent games: " + escapeHTML(recentTime) +
        " • Quarter analytics: " + escapeHTML(statsTime) + "</span>";

      if (state === "error") {
        dataNote.style.borderColor = "rgba(255,116,116,.45)";
        dataNote.style.background = "rgba(255,116,116,.08)";
      } else {
        dataNote.style.borderColor = "rgba(121,191,255,.30)";
        dataNote.style.background = "rgba(121,191,255,.08)";
      }
    }

    function initializeEmptyMaps() {
      STREAMERS.forEach(function (streamer) {
        var login = normalizeLogin(streamer.login);

        if (!statusByLogin.has(login)) {
          statusByLogin.set(login, {
            login: login,
            live: false,
            display_name: streamer.name,
            game_name: "",
            title: "",
            viewer_count: 0,
            started_at: "",
            game_id: "",
            box_art_url: "",
            thumbnail_url: ""
          });
        }

        if (!quarterStatsByLogin.has(login)) {
          quarterStatsByLogin.set(login, getQuarterStats(login));
        }
      });
    }

    async function refreshAll() {
      var button = document.getElementById("refreshButton");
      button.disabled = true;
      button.textContent = "Loading";
      updateDataNote("loading", "Refreshing Twitch status, recent games, and " + getQuarter().label + " analytics...");

      var results = await Promise.allSettled([
        refreshStatuses(),
        refreshRecentGames(),
        refreshQuarterStats()
      ]);

      var failed = results.filter(function (result) {
        return result.status === "rejected";
      });

      if (failed.length) {
        console.error("Some dashboard data failed to refresh:", failed);
        updateDataNote("error", "Some live analytics could not load. Manual progress and all roster tools still work.");
      } else {
        var liveCount = STREAMERS.filter(function (streamer) {
          return getStreamerStatus(streamer.login).live;
        }).length;

        updateDataNote(
          "success",
          "All available data loaded. " + liveCount + " official FaithForge " +
          (liveCount === 1 ? "creator is" : "creators are") + " live right now."
        );
      }

      button.disabled = false;
      button.textContent = "Refresh";
      renderDashboard();
    }

    function buildSearchText(streamer) {
      var progress = getProgress(streamer);
      var content = getContentCompletion(streamer);
      var status = getStreamerStatus(streamer.login);
      var stats = getQuarterStats(streamer.login);
      var games = getRecentGames(streamer.login).map(function (game) {
        return getGameName(game) + " " + getGameTitle(game);
      }).join(" ");

      return normalizeSearch([
        streamer.name,
        streamer.handle,
        streamer.login,
        streamer.platform,
        streamer.notes,
        getQuarter().label,
        status.live ? "live now online" : "offline",
        status.game_name,
        status.title,
        content.complete ? "content complete requirements complete" : "content needs work in progress",
        content.percent,
        progress.longFormDone,
        progress.shortsDone,
        stats.streamCount,
        stats.liveHours,
        stats.avgViewers,
        stats.peakViewers,
        stats.topGame,
        stats.latestTitle,
        stats.latestGame,
        games
      ].join(" "));
    }

    function getFilteredStreamers() {
      var search = normalizeSearch(document.getElementById("searchInput").value);
      var searchTokens = search ? search.split(/\s+/) : [];
      var statusFilter = document.getElementById("statusFilter").value;
      var sortValue = document.getElementById("sortSelect").value;

      var streamers = STREAMERS.filter(function (streamer) {
        var content = getContentCompletion(streamer);
        var status = getStreamerStatus(streamer.login);
        var stats = getQuarterStats(streamer.login);
        var haystack = buildSearchText(streamer);
        var matchesSearch = searchTokens.every(function (token) {
          return haystack.includes(token);
        });

        if (!matchesSearch) return false;
        if (statusFilter === "live") return status.live;
        if (statusFilter === "contentComplete") return content.complete;
        if (statusFilter === "contentNeeds") return !content.complete;
        if (statusFilter === "hasStats") return hasRealStats(stats);
        if (statusFilter === "noStats") return !hasRealStats(stats);
        return true;
      });

      streamers.sort(function (a, b) {
        var aContent = getContentCompletion(a);
        var bContent = getContentCompletion(b);
        var aStatus = getStreamerStatus(a.login);
        var bStatus = getStreamerStatus(b.login);
        var aStats = getQuarterStats(a.login);
        var bStats = getQuarterStats(b.login);

        if (sortValue === "live") {
          return Number(bStatus.live) - Number(aStatus.live) ||
            Number(bStatus.viewer_count || 0) - Number(aStatus.viewer_count || 0) ||
            a.name.localeCompare(b.name);
        }

        if (sortValue === "least") {
          return aContent.percent - bContent.percent || a.name.localeCompare(b.name);
        }

        if (sortValue === "most") {
          return bContent.percent - aContent.percent || a.name.localeCompare(b.name);
        }

        if (sortValue === "hours") {
          return Number(bStats.liveHours || 0) - Number(aStats.liveHours || 0) || a.name.localeCompare(b.name);
        }

        if (sortValue === "streams") {
          return Number(bStats.streamCount || 0) - Number(aStats.streamCount || 0) || a.name.localeCompare(b.name);
        }

        if (sortValue === "average") {
          return Number(bStats.avgViewers || 0) - Number(aStats.avgViewers || 0) || a.name.localeCompare(b.name);
        }

        if (sortValue === "peak") {
          return Number(bStats.peakViewers || 0) - Number(aStats.peakViewers || 0) || a.name.localeCompare(b.name);
        }

        if (sortValue === "lastLive") {
          return (Date.parse(bStats.lastLiveAt || 0) || 0) - (Date.parse(aStats.lastLiveAt || 0) || 0) ||
            a.name.localeCompare(b.name);
        }

        return a.name.localeCompare(b.name);
      });

      return streamers;
    }

    function getQuarterTimingText() {
      var quarter = getQuarter();
      var now = new Date();
      var start = new Date(quarter.start + "T00:00:00");
      var end = new Date(quarter.end + "T23:59:59");
      var day = 24 * 60 * 60 * 1000;

      if (now < start) {
        return Math.ceil((start - now) / day) + " days until this quarter begins.";
      }

      if (now > end) {
        return "Quarter ended " + formatShortDate(quarter.end) + ".";
      }

      return Math.max(0, Math.ceil((end - now) / day)) + " days remaining • " + STREAMERS.length + " creators.";
    }

    function updateSummary() {
      var contentComplete = 0;
      var longFormDone = 0;
      var shortsDone = 0;
      var liveNow = 0;
      var totalStreams = 0;
      var totalHours = 0;
      var weightedViewerSum = 0;
      var viewerWeight = 0;
      var peakViewer = 0;
      var peakWho = "Highest live snapshot.";

      STREAMERS.forEach(function (streamer) {
        var content = getContentCompletion(streamer);
        var status = getStreamerStatus(streamer.login);
        var stats = getQuarterStats(streamer.login);
        var weight = Number(stats.snapshotCount || 0);
        var peak = Number(stats.peakViewers || 0);

        if (content.complete) contentComplete += 1;
        longFormDone += content.longDone;
        shortsDone += content.shortsDone;

        if (status.live) liveNow += 1;

        totalStreams += Number(stats.streamCount || 0);
        totalHours += Number(stats.liveHours || 0);

        if (weight > 0) {
          weightedViewerSum += Number(stats.avgViewers || 0) * weight;
          viewerWeight += weight;
        }

        if (peak > peakViewer) {
          peakViewer = peak;
          peakWho = streamer.name;
        }
      });

      var quarter = getQuarter();
      var teamAverage = viewerWeight ? weightedViewerSum / viewerWeight : 0;

      document.getElementById("summaryQuarter").textContent = quarter.label;
      document.getElementById("summaryQuarterDetail").textContent = getQuarterTimingText();
      document.getElementById("summaryLiveNow").textContent = liveNow;
      document.getElementById("summaryContentComplete").textContent = contentComplete + "/" + STREAMERS.length;
      document.getElementById("summaryContentDetail").textContent = "Creators who finished all 7 required pieces.";
      document.getElementById("summaryLongForm").textContent =
        longFormDone + "/" + (STREAMERS.length * quarter.longFormRequired);
      document.getElementById("summaryLongFormDetail").textContent = "Quality long-form videos completed.";
      document.getElementById("summaryShortForm").textContent =
        shortsDone + "/" + (STREAMERS.length * quarter.shortsRequired);
      document.getElementById("summaryShortFormDetail").textContent = "Shorts, Reels, and TikToks completed.";
      document.getElementById("summaryStreams").textContent = formatNumber(totalStreams);
      document.getElementById("summaryHours").textContent = formatHours(totalHours);
      document.getElementById("summaryAverage").textContent = formatNumber(teamAverage, 1);
      document.getElementById("summaryPeak").textContent = formatNumber(peakViewer);
      document.getElementById("summaryPeakWho").textContent = peakViewer ? peakWho : "Highest live snapshot.";
    }

    function renderDashboard() {
      var grid = document.getElementById("dashboardGrid");
      var streamers = getFilteredStreamers();
      var searchValue = document.getElementById("searchInput").value.trim();
      var resultsLine = document.getElementById("resultsLine");

      updateSummary();

      resultsLine.innerHTML =
        "Showing <strong>" + streamers.length + "</strong> of <strong>" + STREAMERS.length +
        "</strong> official creators for <strong>" + escapeHTML(getQuarter().label) + "</strong>" +
        (searchValue ? ' matching “' + escapeHTML(searchValue) + '”' : "") + ".";

      if (!streamers.length) {
        grid.innerHTML =
          '<div class="no-results panel">' +
            "<strong>No creators match this search and filter.</strong><br>" +
            "Try clearing the search or choosing All Streamers." +
          "</div>";
        return;
      }

      grid.innerHTML = streamers.map(renderStreamerCard).join("");
    }

    function populateQuarterSelect() {
      var select = document.getElementById("quarterSelect");
      var quarterIds = Object.keys(QUARTERS).sort(function (a, b) {
        return new Date(QUARTERS[b].start) - new Date(QUARTERS[a].start);
      });

      select.innerHTML = quarterIds.map(function (quarterId) {
        return '<option value="' + escapeHTML(quarterId) + '">' +
          escapeHTML(QUARTERS[quarterId].label) +
          (quarterId === DEFAULT_QUARTER_ID ? " • Current" : "") +
          "</option>";
      }).join("");

      select.value = activeQuarterId;
    }

    async function changeQuarter() {
      activeQuarterId = document.getElementById("quarterSelect").value;
      quarterStatsByLogin.clear();
      lastStatsLoadedAt = null;
      initializeEmptyMaps();
      renderDashboard();
      updateDataNote("loading", "Loading " + getQuarter().label + " analytics...");

      try {
        await refreshQuarterStats();
        updateDataNote("success", getQuarter().label + " analytics loaded. Twitch status and recent games remain current.");
      } catch (error) {
        console.error("Quarter analytics could not load:", error);
        updateDataNote("error", getQuarter().label + " analytics could not load. Manual progress remains available.");
      }

      renderDashboard();
    }

    document.getElementById("searchInput").addEventListener("input", renderDashboard);
    document.getElementById("statusFilter").addEventListener("change", renderDashboard);
    document.getElementById("sortSelect").addEventListener("change", renderDashboard);
    document.getElementById("quarterSelect").addEventListener("change", changeQuarter);
    document.getElementById("refreshButton").addEventListener("click", refreshAll);

    document.getElementById("clearSearch").addEventListener("click", function () {
      var searchInput = document.getElementById("searchInput");
      searchInput.value = "";
      searchInput.focus();
      renderDashboard();
    });

    document.addEventListener("keydown", function (event) {
      var searchInput = document.getElementById("searchInput");

      if (event.key === "/" && document.activeElement !== searchInput) {
        event.preventDefault();
        searchInput.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        renderDashboard();
      }
    });

    populateQuarterSelect();
    initializeEmptyMaps();
    renderDashboard();
    refreshAll();

    setInterval(async function () {
      try {
        await refreshStatuses();
        renderDashboard();
      } catch (error) {
        console.warn("Live status refresh failed.", error);
      }
    }, 90000);

    setInterval(async function () {
      await Promise.allSettled([
        refreshRecentGames(),
        refreshQuarterStats()
      ]);
      renderDashboard();
    }, 300000);
