const COMMUNITY_API =
    "https://faithforge-community-api.faithforgegaming.workers.dev/community";

  const SERVER_RENDERED_WEBSITE_URL =
    "https://faithforge-community-api.faithforgegaming.workers.dev/website-html";

  const SERVER_RENDERED_WEBSITE_SCHEMA_URL =
    "https://faithforge-community-api.faithforgegaming.workers.dev/website-schema";

  const SERVER_RENDERED_WEBSITE_DATA_URL =
    "https://faithforge-community-api.faithforgegaming.workers.dev/website-data?raw=0";

  const COMMUNITY_CACHE_KEY =
    "faithforge_homepage_community_cache";

  const COMMUNITY_CACHE_TIME =
    5 * 60 * 1000;

  let latestYouTubeVideo = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeUrl(value, fallback = "#") {
    try {
      const url = new URL(value, window.location.origin);

      if (
        url.protocol === "https:" ||
        url.protocol === "http:"
      ) {
        return url.href;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  function formatNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
      ? new Intl.NumberFormat("en-US").format(number)
      : "—";
  }

  function formatDateTime(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short"
    }).format(date);
  }

  function formatEventDateParts(event) {
    const rawDate =
      event.startDateTime ||
      event.start ||
      event.startDate;

    const date = rawDate
      ? new Date(rawDate)
      : null;

    if (!date || Number.isNaN(date.getTime())) {
      return {
        month: "TBD",
        day: "—",
        time: "Time to be announced"
      };
    }

    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "America/New_York"
    }).format(date);

    const day = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      timeZone: "America/New_York"
    }).format(date);

    const time = event.allDay
      ? "All-day event"
      : new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
          timeZoneName: "short"
        }).format(date);

    return {
      month,
      day,
      time
    };
  }

  function getCachedCommunityData() {
    try {
      const cached = JSON.parse(
        localStorage.getItem(COMMUNITY_CACHE_KEY)
      );

      if (
        !cached ||
        !cached.savedAt ||
        !cached.data
      ) {
        return null;
      }

      if (
        Date.now() - cached.savedAt >
        COMMUNITY_CACHE_TIME
      ) {
        return null;
      }

      return cached.data;
    } catch {
      return null;
    }
  }

  function saveCommunityData(data) {
    try {
      localStorage.setItem(
        COMMUNITY_CACHE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          data
        })
      );
    } catch {
      // Local storage may be disabled.
    }
  }

  function displayUpcomingEvents(events) {
    const eventList =
      document.getElementById("homepageEventList");

    const upcoming = Array.isArray(events)
      ? events.slice(0, 3)
      : [];

    if (!upcoming.length) {
      eventList.innerHTML =
        '<p class="loading-text">No upcoming events are currently listed.</p>';

      return;
    }

    eventList.innerHTML = upcoming.map(event => {
      const date =
        formatEventDateParts(event);

      const eventUrl =
        safeUrl(event.eventUrl, "/Events/");

      return `
        <a
          class="event-card"
          href="${escapeHtml(eventUrl)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="event-date-box">
            <span class="event-month">
              ${escapeHtml(date.month)}
            </span>

            <span class="event-day">
              ${escapeHtml(date.day)}
            </span>
          </span>

          <span>
            <span class="event-title">
              ${escapeHtml(
                event.title ||
                "FaithForge Gaming Event"
              )}
            </span>

            <span class="event-time">
              ${escapeHtml(date.time)}
            </span>
          </span>
        </a>
      `;
    }).join("");

    updateEventStructuredData(upcoming);
  }

  function updateEventStructuredData(events) {
    if (typeof buildFaithForgeEventSchema !== "function") return;
    document.getElementById("dynamicEventSchema")?.remove();
    const schema = document.getElementById("serverWebsiteSchema");
    if (!schema) return;
    let current = {};
    try { current = JSON.parse(schema.textContent); } catch { /* Keep fresh event data usable. */ }
    schema.textContent = JSON.stringify(mergeFaithForgeEventGraph(current, events));
  }

  function displayLatestYouTubeVideo(video) {
    if (!video?.videoId) {
      return;
    }

    latestYouTubeVideo = video;

    const title =
      document.getElementById("latestYouTubeTitle");

    const date =
      document.getElementById("latestYouTubeDate");

    const thumbnail =
      document.getElementById("latestYouTubeThumbnail");

    title.textContent =
      video.title ||
      "Latest FaithForge Gaming video";

    date.textContent =
      video.publishedAt
        ? `Published ${formatDateTime(video.publishedAt)}`
        : "";

    thumbnail.src =
      safeUrl(
        video.thumbnailUrl,
        "Homepage.webp"
      );

    thumbnail.alt =
      video.title ||
      "Latest FaithForge Gaming YouTube video";
  }

  function playLatestYouTubeVideo() {
    if (!latestYouTubeVideo?.videoId) {
      window.open(
        "https://www.youtube.com/@FaithForgeGaming",
        "_blank",
        "noopener"
      );

      return;
    }

    const preview =
      document.getElementById("latestYouTubePreview");

    preview.className =
      "youtube-player";

    preview.removeAttribute("role");
    preview.removeAttribute("tabindex");

    preview.innerHTML = `
      <iframe
        title="${escapeHtml(
          latestYouTubeVideo.title ||
          "Latest FaithForge Gaming YouTube video"
        )}"
        src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          latestYouTubeVideo.videoId
        )}?autoplay=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  }

  function displayCommunityData(data) {
    document.getElementById("statDiscordMembers").textContent =
      formatNumber(data.discord?.members);

    document.getElementById("statDiscordOnline").textContent =
      formatNumber(data.discord?.online);

    document.getElementById("statFacebookFollowers").textContent =
      formatNumber(data.facebook?.followers);

    document.getElementById("statTikTokFollowers").textContent =
      formatNumber(data.tiktok?.followers);

    document.getElementById("statYouTubeSubscribers").textContent =
      formatNumber(data.youtube?.subscribers);

    document.getElementById("statTwitchFollowers").textContent =
      formatNumber(data.twitch?.followers);

    document.getElementById("statsUpdated").textContent =
      data.updatedAt
        ? `Updated hourly • Last checked ${formatDateTime(data.updatedAt)}`
        : "Community statistics update automatically every hour.";

    displayUpcomingEvents(
      data.calendar?.upcomingEvents
    );

    displayLatestYouTubeVideo(
      data.youtube?.latestVideo
    );
  }

  async function loadCommunityData() {
    const cached =
      getCachedCommunityData();

    if (cached) {
      displayCommunityData(cached);
      return;
    }

    try {
      const response =
        await fetch(COMMUNITY_API, {
          cache: "no-store"
        });

      const data =
        await response.json();

      if (
        !response.ok ||
        data.success === false
      ) {
        throw new Error(
          data.error ||
          data.message ||
          "Unable to load community information."
        );
      }

      saveCommunityData(data);
      displayCommunityData(data);
    } catch (error) {
      console.error(
        "Community API failed:",
        error
      );

      document.getElementById("statsUpdated").textContent =
        "Live statistics are temporarily unavailable.";

      document.getElementById("homepageEventList").innerHTML =
        '<p class="loading-text">Upcoming events could not be loaded right now.</p>';
    }
  }

  const latestYouTubePreview =
    document.getElementById("latestYouTubePreview");

  latestYouTubePreview.addEventListener(
    "click",
    playLatestYouTubeVideo
  );

  latestYouTubePreview.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        playLatestYouTubeVideo();
      }
    }
  );

  document.getElementById(
    "latestYouTubePlayButton"
  ).addEventListener(
    "click",
    event => {
      event.stopPropagation();
      playLatestYouTubeVideo();
    }
  );

  document.addEventListener(
    "DOMContentLoaded",
    loadCommunityData
  );
