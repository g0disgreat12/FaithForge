const MOON_LOGIN = 'mooncalfmage';
    const MOON_DISPLAY_NAME = 'Moonpie';
    const TWITCH_API_BASE = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev';
    const REFRESH_INTERVAL_MS = 90000;

    let latestMoonLiveStream = null;

    function getTwitchParents() {
      const parents = new Set(['faithforgegaming.com', 'www.faithforgegaming.com']);
      const currentHost = window.location.hostname;

      if (currentHost) {
        parents.add(currentHost);
      }

      return Array.from(parents).filter(Boolean);
    }

    function getTwitchParentQuery() {
      return getTwitchParents()
        .map(parent => `parent=${encodeURIComponent(parent)}`)
        .join('&');
    }

    function getTwitchVideoSrc() {
      return `https://player.twitch.tv/?channel=${encodeURIComponent(MOON_LOGIN)}&${getTwitchParentQuery()}&autoplay=true&muted=false`;
    }

    function getTwitchChatSrc() {
      return `https://www.twitch.tv/embed/${encodeURIComponent(MOON_LOGIN)}/chat?${getTwitchParentQuery()}&darkpopout`;
    }

    function loadMoonTwitchWindows() {
      const playerWrap = document.getElementById('moonPlayerWrap');
      const chatFrame = document.getElementById('moonChatFrame');

      if (playerWrap && !document.getElementById('moonTwitchVideoFrame')) {
        playerWrap.innerHTML = `
          <iframe
            id="moonTwitchVideoFrame"
            title="mooncalfmage Twitch Video Player"
            src="${getTwitchVideoSrc()}"
            allowfullscreen
            scrolling="no"
            allow="autoplay; fullscreen">
          </iframe>
        `;
      }

      if (chatFrame && !chatFrame.src) {
        chatFrame.src = getTwitchChatSrc();
      }
    }

    function escapeHTML(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function normalizeGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function renderMoonRecentGames(games) {
      const grid = document.getElementById('moonRecentGamesGrid');
      if (!grid) return;

      if (!games || !games.length) {
        grid.innerHTML = `
          <div class="recent-empty-card">
            <strong>No Twitch game history collected yet.</strong>
            <span>This section is fully active and will update automatically after ${escapeHTML(MOON_DISPLAY_NAME)} goes live or changes games on Twitch.</span>
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map(game => {
        const name = game.name || game.game_name || 'Recently Streamed Game';
        const image = normalizeGameImage({ ...game, name });
        const description = game.last_title || game.title || `Recently streamed by ${MOON_DISPLAY_NAME}.`;
        const safeName = escapeHTML(name);
        const safeImage = escapeHTML(image);
        const safeDescription = escapeHTML(description);
        const activityLabel = game.live
          ? '<span>Live now on Twitch</span>'
          : game.last_played
            ? `<span>Last played: ${escapeHTML(game.last_played)}</span>`
            : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${MOON_LOGIN}" target="_blank" rel="noopener" aria-label="Watch ${escapeHTML(MOON_LOGIN)} play ${safeName} on Twitch">
            <div class="streamer-game-logo-wrap">
              <img src="${safeImage}" alt="${safeName} artwork" loading="lazy" decoding="async">
            </div>
            <div class="game-card-copy">
              <strong>${safeName}</strong>
              <span>${safeDescription}</span>
              ${activityLabel}
            </div>
          </a>
        `;
      }).join('');
    }

    async function loadMoonRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(
          `${TWITCH_API_BASE}/api/recent-games?login=${encodeURIComponent(MOON_LOGIN)}&limit=4`,
          { cache: 'no-store' }
        );

        const payload = await response.json();
        const games = payload.games || payload.recentGames || [];

        if (response.ok && games.length) {
          renderMoonRecentGames(games);

          if (status) {
            status.textContent = `These games are pulled from ${MOON_DISPLAY_NAME}'s saved Twitch activity and update automatically as she streams.`;
          }
          return;
        }

        if (latestMoonLiveStream && latestMoonLiveStream.game_name) {
          renderMoonRecentGames([latestMoonLiveStream]);

          if (status) {
            status.textContent = `${MOON_DISPLAY_NAME} is live now. Showing the current Twitch game while recent history is being saved.`;
          }
          return;
        }

        renderMoonRecentGames([]);

        if (status) {
          status.textContent = `No recent Twitch game history has been collected yet. This will update automatically after ${MOON_DISPLAY_NAME} streams.`;
        }
      } catch (error) {
        if (latestMoonLiveStream && latestMoonLiveStream.game_name) {
          renderMoonRecentGames([latestMoonLiveStream]);

          if (status) {
            status.textContent = `${MOON_DISPLAY_NAME} is live now. Showing the current Twitch game while recent history is being checked.`;
          }
          return;
        }

        renderMoonRecentGames([]);

        if (status) {
          status.textContent = 'Recent Twitch game history could not load right now. This section will keep checking automatically.';
        }
      }
    }

    async function loadMoonLiveStatus() {
      const badge = document.getElementById('moonLiveBadge');
      const meta = document.getElementById('moonLiveMeta');
      const title = document.getElementById('moonLiveTitle');
      const playerWrap = document.getElementById('moonPlayerWrap');
      const watchBtn = document.getElementById('moonWatchBtn');

      if (!badge || !meta || !title || !playerWrap || !watchBtn) return;

      loadMoonTwitchWindows();

      try {
        const response = await fetch(
          `${TWITCH_API_BASE}/api/twitch-status`,
          { cache: 'no-store' }
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.details || payload.error || 'Unable to load Twitch status.');
        }

        const stream = (payload.channels || []).find(
          channel => String(channel.login).toLowerCase() === MOON_LOGIN
        );

        if (!stream || !stream.live) {
          latestMoonLiveStream = null;
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = 'mooncalfmage is not live right now. Follow on Twitch, check the schedule, or join Discord for the next stream update.';
          loadMoonTwitchWindows();
          watchBtn.href = `https://www.twitch.tv/${MOON_LOGIN}`;
          return;
        }

        latestMoonLiveStream = {
          ...stream,
          live: true,
          name: stream.game_name,
          last_title: stream.title || 'Currently live on Twitch'
        };

        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = `https://www.twitch.tv/${MOON_LOGIN}`;

        loadMoonTwitchWindows();
      } catch (error) {
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        loadMoonTwitchWindows();
      }
    }

    async function refreshMoonTwitchSections() {
      await loadMoonLiveStatus();
      await loadMoonRecentGames();
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadMoonTwitchWindows();
      refreshMoonTwitchSections();
      setInterval(refreshMoonTwitchSections, REFRESH_INTERVAL_MS);
    });
