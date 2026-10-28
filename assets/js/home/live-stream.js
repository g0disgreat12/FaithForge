const STREAM_STATUS_ENDPOINT =
    "https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/twitch-status";

  /*
   * This is the same approved FaithForge team list used by the Streamers page.
   * Only creators on this list are eligible for the homepage featured player.
   */
  const FAITHFORGE_STREAMERS = [
    {
      login: "faithforgegaming",
      name: "FaithForgeGaming",
      twitch: "https://www.twitch.tv/faithforgegaming"
    },
    {
      login: "doctorjsways",
      name: "DoctorJSWAYS",
      twitch: "https://www.twitch.tv/doctorjsways"
    },
    {
      login: "seawolf_30",
      name: "Seawolf_30",
      twitch: "https://www.twitch.tv/seawolf_30"
    },
    {
      login: "mooncalfmage",
      name: "Mooncalfmage",
      twitch: "https://www.twitch.tv/mooncalfmage"
    },
    {
      login: "ninjasaucex",
      name: "NinjaSauceX",
      twitch: "https://www.twitch.tv/ninjasaucex"
    },
    {
      login: "romans1014xp",
      name: "Romans1014XP",
      twitch: "https://www.twitch.tv/romans1014xp"
    },
    {
      login: "warrior_of_light777",
      name: "warrior_of_light777",
      twitch: "https://www.twitch.tv/warrior_of_light777"
    }
  ];

  let currentFeaturedChannel = null;

  function normalizeTwitchLogin(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function getFaithForgeStreamer(login) {
    const normalized =
      normalizeTwitchLogin(login);

    return FAITHFORGE_STREAMERS.find(
      streamer => streamer.login === normalized
    ) || null;
  }

  function getTwitchParents() {
    const parents =
      new Set([
        "faithforgegaming.com",
        "www.faithforgegaming.com"
      ]);

    const currentHost =
      window.location.hostname;

    if (currentHost) {
      parents.add(currentHost);
    }

    return Array.from(parents)
      .filter(Boolean);
  }

  function getTwitchParentQuery() {
    return getTwitchParents()
      .map(parent =>
        `parent=${encodeURIComponent(parent)}`
      )
      .join("&");
  }

  function getTwitchVideoSrc(login) {
    return (
      "https://player.twitch.tv/?" +
      `channel=${encodeURIComponent(login)}` +
      `&${getTwitchParentQuery()}` +
      "&autoplay=true" +
      "&muted=false"
    );
  }

  function normalizeStatusChannel(rawChannel) {
    const login =
      normalizeTwitchLogin(
        rawChannel?.login ||
        rawChannel?.user_login ||
        rawChannel?.channel_login ||
        rawChannel?.channel ||
        rawChannel?.name
      );

    return {
      login,
      display_name:
        rawChannel?.display_name ||
        rawChannel?.user_name ||
        rawChannel?.displayName ||
        login,

      live: Boolean(
        rawChannel?.live ||
        rawChannel?.type === "live" ||
        rawChannel?.is_live
      ),

      game_name:
        rawChannel?.game_name ||
        rawChannel?.game ||
        rawChannel?.category ||
        "",

      title:
        rawChannel?.title ||
        rawChannel?.stream_title ||
        "",

      viewer_count:
        Number(
          rawChannel?.viewer_count ||
          rawChannel?.viewers ||
          0
        ) || 0,

      started_at:
        rawChannel?.started_at ||
        ""
    };
  }

  function getApprovedLiveChannels(payload) {
    const rawChannels =
      Array.isArray(payload?.channels)
        ? payload.channels
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    const approvedLogins =
      new Set(
        FAITHFORGE_STREAMERS.map(
          streamer => streamer.login
        )
      );

    return rawChannels
      .map(normalizeStatusChannel)
      .filter(status =>
        status.login &&
        status.live &&
        approvedLogins.has(status.login)
      );
  }

  function chooseHomepageFeaturedStreamer(liveChannels) {
    const officialChannel =
      liveChannels.find(
        status =>
          status.login === "faithforgegaming"
      );

    if (officialChannel) {
      return officialChannel;
    }

    return [...liveChannels]
      .sort((left, right) =>
        (right.viewer_count || 0) -
        (left.viewer_count || 0)
      )[0] || null;
  }

  function formatTwitchViewers(count) {
    const viewers =
      Number(count || 0);

    return (
      `${viewers.toLocaleString("en-US")} ` +
      `${viewers === 1 ? "viewer" : "viewers"}`
    );
  }

  function showTwitchOfflineState() {
    const badge =
      document.getElementById(
        "streamersFeaturedBadge"
      );

    const name =
      document.getElementById(
        "streamersFeaturedName"
      );

    const meta =
      document.getElementById(
        "streamersFeaturedMeta"
      );

    const title =
      document.getElementById(
        "streamersFeaturedTitle"
      );

    const watchButton =
      document.getElementById(
        "streamersFeaturedWatchBtn"
      );

    const player =
      document.getElementById(
        "streamersFeaturedPlayer"
      );

    currentFeaturedChannel =
      null;

    badge.textContent =
      "NO ONE LIVE";

    badge.className =
      "featured-status-badge offline";

    name.textContent =
      "No FaithForge creator is live right now.";

    meta.textContent =
      "Follow our creators and check back for the next stream.";

    title.textContent =
      "";

    watchButton.href =
      "https://www.twitch.tv/faithforgegaming";

    watchButton.textContent =
      "Watch on Twitch";

    player.innerHTML =
      "";

    player.classList.add(
      "is-hidden"
    );
  }

  function showTwitchLiveState(status) {
    const streamer =
      getFaithForgeStreamer(status.login);

    if (!streamer) {
      showTwitchOfflineState();
      return;
    }

    const badge =
      document.getElementById(
        "streamersFeaturedBadge"
      );

    const name =
      document.getElementById(
        "streamersFeaturedName"
      );

    const meta =
      document.getElementById(
        "streamersFeaturedMeta"
      );

    const title =
      document.getElementById(
        "streamersFeaturedTitle"
      );

    const watchButton =
      document.getElementById(
        "streamersFeaturedWatchBtn"
      );

    const player =
      document.getElementById(
        "streamersFeaturedPlayer"
      );

    badge.textContent =
      "LIVE NOW";

    badge.className =
      "featured-status-badge online";

    name.textContent =
      `${streamer.name} is live now`;

    meta.textContent =
      `${status.game_name || "Live on Twitch"} • ` +
      formatTwitchViewers(status.viewer_count);

    title.textContent =
      status.title ||
      "Currently streaming live.";

    watchButton.href =
      streamer.twitch;

    watchButton.textContent =
      `Watch ${streamer.name}`;

    player.classList.remove(
      "is-hidden"
    );

    if (
      currentFeaturedChannel ===
      streamer.login
    ) {
      return;
    }

    currentFeaturedChannel =
      streamer.login;

    player.innerHTML = `
      <iframe
        title="${escapeHtml(streamer.name)} Twitch video player"
        src="${escapeHtml(getTwitchVideoSrc(streamer.login))}"
        allowfullscreen
        scrolling="no"
        allow="autoplay; fullscreen"
      ></iframe>
    `;
  }

  function showTwitchErrorState(error) {
    console.error(
      "FaithForge Twitch status error:",
      error
    );

    const badge =
      document.getElementById(
        "streamersFeaturedBadge"
      );

    const name =
      document.getElementById(
        "streamersFeaturedName"
      );

    const meta =
      document.getElementById(
        "streamersFeaturedMeta"
      );

    const title =
      document.getElementById(
        "streamersFeaturedTitle"
      );

    const player =
      document.getElementById(
        "streamersFeaturedPlayer"
      );

    currentFeaturedChannel =
      null;

    badge.textContent =
      "STATUS UNAVAILABLE";

    badge.className =
      "featured-status-badge offline";

    name.textContent =
      "Featured streamer status could not be loaded.";

    meta.textContent =
      "Visit our Streamers page to see the full FaithForge creator team.";

    title.textContent =
      "";

    player.innerHTML =
      "";

    player.classList.add(
      "is-hidden"
    );
  }

  async function loadStreamersFeaturedLive() {
    try {
      const response =
        await fetch(
          STREAM_STATUS_ENDPOINT,
          {
            cache: "no-store"
          }
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.details ||
          payload.error ||
          "Unable to load Twitch status."
        );
      }

      const liveChannels =
        getApprovedLiveChannels(payload);

      const featured =
        chooseHomepageFeaturedStreamer(
          liveChannels
        );

      if (!featured) {
        showTwitchOfflineState();
        return;
      }

      showTwitchLiveState(featured);
    } catch (error) {
      showTwitchErrorState(error);
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      loadStreamersFeaturedLive();

      setInterval(
        loadStreamersFeaturedLive,
        90000
      );
    }
  );
