/* ForgedByGrace7 stream player, Twitch status, and recent activity.
   Keep the existing social login: forgedbygrace7.
   Load once with <script src="streaming.js" defer></script>. */
(() => {
  'use strict';

  const streamerLogin = 'forgedbygrace7';
  const streamerDisplayName = 'ForgedByGrace7';
  const twitchUrl = `https://www.twitch.tv/${streamerLogin}`;
  const apiBase = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api';
  const scriptUrl = document.currentScript?.src || location.href;
  const fallbackImage = new URL('assets/forge-bible-bot.png', scriptUrl).href;
  let latestStreamerLiveStream = null;
  let refreshing = false;
  const byId = id => document.getElementById(id);

  function getTwitchParentQuery() {
    return [...new Set(['faithforgegaming.com', 'www.faithforgegaming.com', location.hostname])]
      .filter(Boolean).map(parent => `parent=${encodeURIComponent(parent)}`).join('&');
  }

  function updateStreamerTwitchWindows() {
    if (!/^https?:$/.test(location.protocol)) {
      const notice = byId('embedNotice');
      if (notice) notice.textContent = 'Open this page through a website to load Twitch, or use the Watch on Twitch link below.';
      return;
    }
    const parentQuery = getTwitchParentQuery();
    const video = byId('streamerTwitchVideo');
    const chat = byId('streamerTwitchChat');
    const videoUrl = `https://player.twitch.tv/?channel=${encodeURIComponent(streamerLogin)}&${parentQuery}&autoplay=false&muted=true`;
    const chatUrl = `https://www.twitch.tv/embed/${encodeURIComponent(streamerLogin)}/chat?${parentQuery}&darkpopout`;
    if (video) {
      if (video.getAttribute('src') !== videoUrl) video.src = videoUrl;
      video.hidden = false;
      video.parentElement?.classList.add('is-loaded');
    }
    if (chat) {
      if (chat.getAttribute('src') !== chatUrl) chat.src = chatUrl;
      chat.hidden = false;
    }
    const placeholder = byId('playerPlaceholder');
    const chatPlaceholder = byId('chatPlaceholder');
    if (placeholder) placeholder.hidden = true;
    if (chatPlaceholder) chatPlaceholder.hidden = true;
  }

  async function fetchStreamerJson(path) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${apiBase}/${path}`, {cache: 'no-store', signal: controller.signal});
      if (!response.ok) throw new Error('Stream information unavailable');
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function setStreamerStatus(state, badgeText, metaText, titleText) {
    const badge = byId('streamerLiveBadge');
    if (badge) {
      badge.className = `live-badge ${state}`;
      if (badge.textContent !== badgeText) badge.textContent = badgeText;
    }
    const meta = byId('streamerLiveMeta');
    const title = byId('streamerLiveTitle');
    const watchBtn = byId('streamerWatchBtn');
    if (meta) meta.textContent = metaText;
    if (title) title.textContent = titleText;
    if (watchBtn) watchBtn.href = twitchUrl;
  }

  async function loadStreamerLiveStatus() {
    try {
      const payload = await fetchStreamerJson('twitch-status');
      if (!Array.isArray(payload.channels)) throw new Error('Missing channel data');
      const stream = payload.channels.find(channel => channel && String(channel.login).toLowerCase() === streamerLogin);
      // An absent channel is unknown; only an explicit false means offline.
      if (!stream || typeof stream.live !== 'boolean') throw new Error('Channel unavailable');
      latestStreamerLiveStream = stream.live ? stream : null;
      if (stream.live) {
        const viewers = Number(stream.viewer_count);
        const viewerText = Number.isFinite(viewers) && viewers > 0 ? ` · ${viewers.toLocaleString()} viewers` : '';
        setStreamerStatus('online', 'LIVE NOW', `${stream.game_name || 'Live on Twitch'}${viewerText}`, stream.title || `Join ${streamerDisplayName} live.`);
      } else {
        setStreamerStatus('offline', 'OFFLINE', 'The next conversation is ahead.', `${streamerDisplayName} is currently offline. Follow on Twitch or join The Forge Discord for stream announcements.`);
      }
    } catch {
      latestStreamerLiveStream = null;
      setStreamerStatus('unknown', 'CHECK ON TWITCH', 'Faith, music & variety gaming', 'Live status is unavailable right now. Open Twitch for the latest stream, or join Discord for announcements.');
    }
  }

  function getStreamerGameImage(game) {
    const source = String(game.box_art_url || game.image || '').replace('{width}', '285').replace('{height}', '380');
    try {
      const url = new URL(source, fallbackImage);
      return url.protocol === 'https:' ? url.href : fallbackImage;
    } catch {
      return fallbackImage;
    }
  }

  function renderStreamerRecentGames(games) {
    const grid = byId('streamerRecentGamesGrid');
    if (!grid) return;
    if (!games.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state-card';
      const name = document.createElement('strong');
      name.textContent = `Catch up with ${streamerDisplayName}`;
      const copy = document.createElement('p');
      copy.textContent = 'Music, variety gaming, prayer, and honest faith. ';
      const link = document.createElement('a');
      link.href = `${twitchUrl}/videos`; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = 'Browse recent broadcasts on Twitch ↗';
      copy.append(link); empty.append(name, copy); grid.replaceChildren(empty);
      return;
    }
    const cards = games.slice(0, 4).map(game => {
      // API content is inserted as text, never interpreted as HTML.
      const name = String(game.name || game.game_name || 'Recent stream');
      const card = document.createElement('a');
      card.className = 'streamer-game-card'; card.href = twitchUrl;
      card.target = '_blank'; card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `Watch ${streamerDisplayName}: ${name}`);
      const imageWrap = document.createElement('div'); imageWrap.className = 'streamer-game-logo-wrap';
      const image = document.createElement('img');
      image.src = getStreamerGameImage(game); image.alt = `${name} artwork`;
      image.loading = 'lazy'; image.decoding = 'async';
      image.addEventListener('error', () => {image.src = fallbackImage;}, {once: true});
      imageWrap.append(image);
      const copy = document.createElement('div'); copy.className = 'game-card-copy';
      const heading = document.createElement('strong'); heading.textContent = name;
      const description = document.createElement('span');
      description.textContent = game.last_title || game.description || `Recently streamed by ${streamerDisplayName}.`;
      copy.append(heading, description);
      if (game.last_played) {
        const played = document.createElement('span');
        played.textContent = game.last_played === 'Live now' ? 'Live now' : `Last played: ${game.last_played}`;
        copy.append(played);
      }
      card.append(imageWrap, copy); return card;
    });
    grid.replaceChildren(...cards);
  }

  async function loadStreamerRecentGames() {
    const status = byId('recentGamesStatus');
    let games = [];
    let unavailable = false;
    try {
      const payload = await fetchStreamerJson(`recent-games?login=${streamerLogin}&limit=4`);
      const received = payload.games || payload.recentGames;
      if (!Array.isArray(received)) throw new Error('Missing recent activity');
      games = received.filter(game => game && typeof game === 'object');
    } catch {
      unavailable = true;
    }
    if (latestStreamerLiveStream?.game_name) {
      const liveGame = {
        name: latestStreamerLiveStream.game_name,
        game_id: latestStreamerLiveStream.game_id || '',
        box_art_url: latestStreamerLiveStream.box_art_url || '',
        last_title: latestStreamerLiveStream.title || 'Currently live on Twitch',
        last_played: 'Live now'
      };
      games = [liveGame, ...games.filter(game => {
        const sameId = liveGame.game_id && game.game_id && String(game.game_id) === String(liveGame.game_id);
        const sameName = String(game.name || game.game_name || '').toLowerCase() === String(liveGame.name).toLowerCase();
        return !sameId && !sameName;
      })];
    }
    renderStreamerRecentGames(games);
    if (status) {
      status.textContent = games.length
        ? (unavailable ? 'Showing the current live category. Recent broadcasts are available on Twitch.' : `The latest available Twitch activity from ${streamerDisplayName}.`)
        : unavailable
          ? 'Recent Twitch activity is unavailable right now. Visit the channel for broadcasts and highlights.'
          : 'New Twitch activity will appear here as it becomes available.';
    }
  }

  async function refreshStreamerTwitchSections() {
    if (refreshing || document.hidden) return;
    refreshing = true;
    try {
      await loadStreamerLiveStatus();
      await loadStreamerRecentGames();
    } finally {
      refreshing = false;
    }
  }

  function start() {
    const loadButton = byId('loadStream');
    if (loadButton) loadButton.addEventListener('click', updateStreamerTwitchWindows);
    else updateStreamerTwitchWindows(); // Also supports the original automatic embed markup.
    refreshStreamerTwitchSections();
    setInterval(refreshStreamerTwitchSections, 90000);
    document.addEventListener('visibilitychange', () => {if (!document.hidden) refreshStreamerTwitchSections();});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
