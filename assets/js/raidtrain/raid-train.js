/*
  RAID TRAIN SETTINGS
  January is not daylight saving time, so the code uses -05:00.
  The page displays ET instead of EST so it remains viewer-friendly.
*/

const eventStart = new Date("2027-01-30T10:30:00-05:00");
const eventEnd = new Date("2027-01-30T22:00:00-05:00");

const raidSchedule = [
  {
    time: "10:30 AM",
    start: "2027-01-30T10:30:00-05:00",
    end: "2027-01-30T11:00:00-05:00",
    login: "faithforgegaming",
    display: "FaithForgeGaming",
    details: "Main Channel Start"
  },
   {
    time: "11:00 AM",
    start: "2027-01-30T11:00:00-05:00",
    end: "2027-01-30T12:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
   {
    time: "12:00 PM",
    start: "2027-01-30T12:00:00-05:00",
    end: "2027-01-30T13:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "IRL",
    openSlot: true
  },
   {
    time: "1:00 PM",
    start: "2027-01-30T13:00:00-05:00",
    end: "2027-01-30T14:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
   {
    time: "2:00 PM",
    start: "2027-01-30T14:00:00-05:00",
    end: "2027-01-30T15:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
   {
    time: "3:00 PM",
    start: "2027-01-30T15:00:00-05:00",
    end: "2027-01-30T16:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
  {
    time: "4:00 PM",
    start: "2027-01-30T16:00:00-05:00",
    end: "2027-01-30T17:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
  {
    time: "5:00 PM",
    start: "2027-01-30T17:00:00-05:00",
    end: "2027-01-30T18:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
  {
    time: "6:00 PM",
    start: "2027-01-30T18:00:00-05:00",
    end: "2027-01-30T19:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
   {
    time: "7:00 PM",
    start: "2027-01-30T19:00:00-05:00",
    end: "2027-01-30T20:00:00-05:00",
    login: "TBD",
    display: "TBD",
    details: "TBD",
    openSlot: true
  },
  {
    time: "8:00 PM",
    start: "2027-01-30T20:00:00-05:00",
    end: "2027-01-30T22:00:00-05:00",
    login: "faithforgegaming",
    display: "FaithForgeGaming",
    details: "Main Channel & Community Event"
  }
];

let raidLiveStatusByLogin = {};

function twitchUrl(login) {
  return `https://www.twitch.tv/${login}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLiveStatusBadge(item) {
  if (item.openSlot || !item.login) {
    return `<span class="live-status-pill offline">Offline</span>`;
  }

  const login = item.login.toLowerCase();
  const status = raidLiveStatusByLogin[login];

  if (!status) {
    return `<span class="live-status-pill checking">Checking...</span>`;
  }

  if (status.error) {
    return `<span class="live-status-pill error">Status Error</span>`;
  }

  return status.live
    ? `<span class="live-status-pill live">Live Now</span>`
    : `<span class="live-status-pill offline">Offline</span>`;
}

function getScheduleState() {
  const now = new Date();

  const current = raidSchedule.find(item => {
    const start = new Date(item.start);
    const end = new Date(item.end);
    return now >= start && now < end;
  });

  const next = raidSchedule.find(item => {
    const start = new Date(item.start);
    return now < start;
  });

  return { now, current, next };
}

function renderSchedule() {
  const table = document.getElementById("scheduleTable");
  const { now, current, next } = getScheduleState();

  table.innerHTML = raidSchedule.map(item => {
    const start = new Date(item.start);
    const end = new Date(item.end);

    let rowClass = "";
    let label = "";

    if (current === item) {
      rowClass = "current";
      label = `<span class="row-label live">CURRENT STOP</span>`;
    } else if (next === item) {
      rowClass = "upnext-row";
      label = `<span class="row-label next">UP NEXT</span>`;
    } else if (now >= end) {
      rowClass = "complete";
      label = `<span class="row-label done">COMPLETED</span>`;
    }

    if (item.openSlot) {
      rowClass += " open-slot";
      if (!label) label = `<span class="row-label open">OPEN SLOT</span>`;
    }

    const action = item.openSlot
      ? `<a class="secondary-btn" href="https://discord.com/channels/1370183268900540567/1442549928533561525" target="_blank" rel="noopener noreferrer">Apply</a>`
      : `<a class="twitch-btn" href="${twitchUrl(item.login)}" target="_blank" rel="noopener noreferrer">Watch</a>`;

    const streamer = item.openSlot
      ? "Open Slot"
      : escapeHtml(item.display);

    return `
      <div class="schedule-row ${rowClass}">
        <div>
          <div class="schedule-time">${item.time} ET</div>
          ${label}
        </div>

        <div class="schedule-streamer">${streamer}</div>

        <div class="schedule-details">${escapeHtml(item.details)}</div>

        <div class="schedule-live-status">${getLiveStatusBadge(item)}</div>

        <div class="schedule-action">${action}</div>
      </div>
    `;
  }).join("");
}

function updateCountdown() {
  const now = new Date();
  const target = eventStart;
  const end = eventEnd;

  const daysEl = document.getElementById("countDays");
  const hoursEl = document.getElementById("countHours");
  const minutesEl = document.getElementById("countMinutes");
  const secondsEl = document.getElementById("countSeconds");
  const messageEl = document.getElementById("countdownMessage");

  if (now >= end) {
    daysEl.textContent = "0";
    hoursEl.textContent = "0";
    minutesEl.textContent = "0";
    secondsEl.textContent = "0";
    messageEl.textContent = "This Raid Train event has wrapped up. Join Discord for future quarterly events.";
    return;
  }

  if (now >= target && now < end) {
    daysEl.textContent = "LIVE";
    hoursEl.textContent = "NOW";
    minutesEl.textContent = "";
    secondsEl.textContent = "";
    messageEl.textContent = "The FaithForge Raid Train is live now. Check the Watch Now section for the current stop.";
    return;
  }

  const distance = target - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;

  messageEl.textContent = "The Raid Train begins Saturday, January 30, 2027 at 10:30 AM ET on the FaithForgeGaming main channel.";
}

function updateDashboardFromSchedule(liveChannel = null) {
  const badge = document.getElementById("raidLiveBadge");
  const title = document.getElementById("raidCurrentTitle");
  const currentText = document.getElementById("raidCurrentStreamer");
  const nextText = document.getElementById("raidNextStreamer");
  const watchBtn = document.getElementById("raidWatchBtn");

  const { now, current, next } = getScheduleState();

  if (liveChannel) {
    const login = String(liveChannel.login || "").toLowerCase();
    const display = liveChannel.display_name || liveChannel.login;

    badge.textContent = "LIVE NOW";
    badge.className = "status-badge live";
    title.textContent = "Watch Now";
    currentText.textContent = `${display} is live now. Join the stream, encourage them in chat, and ride with us to the next stop.`;
    nextText.textContent = next && !next.openSlot
      ? `Up next: ${next.display} at ${next.time} ET`
      : next && next.openSlot
        ? `Up next: Open Slot at ${next.time} ET`
        : "This is the final scheduled stop.";
    watchBtn.href = twitchUrl(login);
    watchBtn.textContent = "Open Live Stream";
    return;
  }

  if (current && !current.openSlot) {
    badge.textContent = "CURRENT STOP";
    badge.className = "status-badge upnext";
    title.textContent = "Current Raid Stop";
    currentText.textContent = `${current.display} is the scheduled current stop. If they are live, open their Twitch channel and join the chat.`;
    nextText.textContent = next
      ? `Up next: ${next.display} at ${next.time} ET`
      : "This is the final scheduled stop.";
    watchBtn.href = twitchUrl(current.login);
    watchBtn.textContent = "Open Current Stream";
    return;
  }

  if (current && current.openSlot) {
    badge.textContent = "OPEN SLOT";
    badge.className = "status-badge offline";
    title.textContent = "Open Slot";
    currentText.textContent = "This time slot is currently open for a FaithForge streamer.";
    nextText.textContent = next
      ? `Up next: ${next.display} at ${next.time} ET`
      : "This is the final scheduled block.";
    watchBtn.href = "https://discord.com/channels/1370183268900540567/1493279687290392658";
    watchBtn.textContent = "Apply / Event Info";
    return;
  }

  if (next) {
    badge.textContent = "UP NEXT";
    badge.className = "status-badge upnext";
    title.textContent = "Next Raid Train Stop";
    currentText.textContent = `${next.display} is scheduled next at ${next.time} ET.`;
    nextText.textContent = next.openSlot
      ? "This is currently an open streamer slot. Check Discord for updates."
      : "Follow the channel early so you are ready when the stream starts.";
    watchBtn.href = next.openSlot
      ? "https://discord.com/channels/1370183268900540567/1493279687290392658"
      : twitchUrl(next.login);
    watchBtn.textContent = next.openSlot ? "Apply / Event Info" : "Open Next Stream";
    return;
  }

  if (now >= eventEnd) {
    badge.textContent = "EVENT ENDED";
    badge.className = "status-badge offline";
    title.textContent = "Raid Train Complete";
    currentText.textContent = "This FaithForge Raid Train event has wrapped up.";
    nextText.textContent = "Join Discord to stay updated on the next quarterly Raid Train.";
    watchBtn.href = "https://discord.gg/bAQrudk5a9";
    watchBtn.textContent = "Join Discord";
    return;
  }

  badge.textContent = "NO ONE LIVE";
  badge.className = "status-badge offline";
  title.textContent = "Watch Now";
  currentText.textContent = "No Raid Train streamer is live yet.";
  nextText.textContent = "Check back soon or join Discord for event updates.";
  watchBtn.href = "https://www.twitch.tv/faithforgegaming";
  watchBtn.textContent = "Open Main Channel";
}

function setFeaturedOffline(message = "The featured Twitch stream will appear here when someone in the Raid Train lineup is live.") {
  const badge = document.getElementById("featuredBadge");
  const name = document.getElementById("featuredName");
  const meta = document.getElementById("featuredMeta");
  const title = document.getElementById("featuredTitle");
  const watchBtn = document.getElementById("featuredWatchBtn");
  const player = document.getElementById("featuredPlayer");

  badge.textContent = "NO ONE LIVE";
  badge.className = "status-badge offline";
  name.textContent = "No Raid Train streamer is live right now.";
  meta.textContent = "Check the schedule for the next stop.";
  title.textContent = "The player will update automatically when someone in the lineup goes live.";
  watchBtn.href = "https://www.twitch.tv/faithforgegaming";
  player.innerHTML = message;
}

function setFeaturedLive(featured) {
  const badge = document.getElementById("featuredBadge");
  const name = document.getElementById("featuredName");
  const meta = document.getElementById("featuredMeta");
  const title = document.getElementById("featuredTitle");
  const watchBtn = document.getElementById("featuredWatchBtn");
  const player = document.getElementById("featuredPlayer");

  const login = String(featured.login || "").toLowerCase();
  const display = featured.display_name || featured.login;

  badge.textContent = "LIVE NOW";
  badge.className = "status-badge live";

  name.textContent = `${display} is live now`;
  meta.textContent = `${featured.game_name || "Live on Twitch"}${featured.viewer_count ? " • " + featured.viewer_count + " viewers" : ""}`;
  title.textContent = featured.title || "Currently streaming now.";
  watchBtn.href = twitchUrl(login);

  player.innerHTML = '<div id="featuredTwitchPlayer" style="width:100%;"></div>';

  new Twitch.Embed("featuredTwitchPlayer", {
    width: "100%",
    height: 380,
    channel: login,
    parent: ["faithforgegaming.com", "www.faithforgegaming.com"],
    layout: "video"
  });
}

async function loadRaidTrainLiveStatus() {
  try {
    const response = await fetch(
      "https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/twitch-status",
      { cache: "no-store" }
    );

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.details || payload.error || "Unable to load Twitch status.");
    }

    const channels = payload.channels || [];

    const channelStatusByLogin = {};

    channels.forEach(channel => {
      const login = String(channel.login || "").toLowerCase();
      if (login) {
        channelStatusByLogin[login] = channel;
      }
    });

    raidLiveStatusByLogin = {};

    raidSchedule.forEach(item => {
      if (!item.login) return;

      const login = item.login.toLowerCase();
      const channel = channelStatusByLogin[login];

      raidLiveStatusByLogin[login] = {
        live: channel ? Boolean(channel.live) : false,
        error: false
      };
    });

    renderSchedule();

    const scheduleLogins = raidSchedule
      .filter(item => item.login)
      .map(item => item.login.toLowerCase());

    const liveChannels = channels.filter(channel =>
      scheduleLogins.includes(String(channel.login || "").toLowerCase()) && channel.live
    );

    let featured = null;

    if (liveChannels.length) {
      const { current } = getScheduleState();

      if (current && current.login) {
        featured = liveChannels.find(channel =>
          String(channel.login || "").toLowerCase() === current.login.toLowerCase()
        );
      }

      if (!featured) {
        featured = liveChannels[0];
      }
    }

    if (featured) {
      setFeaturedLive(featured);
      updateDashboardFromSchedule(featured);
    } else {
      setFeaturedOffline();
      updateDashboardFromSchedule(null);
    }

  } catch (error) {
    const badge = document.getElementById("featuredBadge");
    const name = document.getElementById("featuredName");
    const meta = document.getElementById("featuredMeta");
    const title = document.getElementById("featuredTitle");
    const player = document.getElementById("featuredPlayer");

    badge.textContent = "STATUS ERROR";
    badge.className = "status-badge error";
    name.textContent = "Could not load Twitch status.";
    meta.textContent = "There was a problem reaching the FaithForge Twitch status feed.";
    title.textContent = error.message;
    player.innerHTML = "We could not load the featured Twitch player right now.";

    raidLiveStatusByLogin = {};

    raidSchedule.forEach(item => {
      if (!item.login) return;
      raidLiveStatusByLogin[item.login.toLowerCase()] = {
        live: false,
        error: true
      };
    });

    renderSchedule();
    updateDashboardFromSchedule(null);
  }
}

function copyChatMessage(id) {
  const text = document.getElementById(id).textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Chat message copied!");
    }).catch(() => {
      alert("Copy failed. You can manually highlight and copy the message.");
    });
  } else {
    alert("Copy is not supported on this browser. You can manually highlight and copy the message.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSchedule();
  updateCountdown();
  updateDashboardFromSchedule(null);
  loadRaidTrainLiveStatus();

  setInterval(() => {
    renderSchedule();
    updateCountdown();
    updateDashboardFromSchedule(null);
  }, 1000);

  setInterval(loadRaidTrainLiveStatus, 90000);
});
