const streamerLogin = 'ninjasaucex';
    const streamerDisplayName = 'NinjaSauceX';
    const apiBase = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev';

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
      return `https://player.twitch.tv/?channel=${encodeURIComponent(streamerLogin)}&${getTwitchParentQuery()}&autoplay=true&muted=false`;
    }

    function getTwitchChatSrc() {
      return `https://www.twitch.tv/embed/${encodeURIComponent(streamerLogin)}/chat?${getTwitchParentQuery()}&darkpopout`;
    }

    function loadNinjaSauceTwitchWindows() {
      const playerWrap = document.getElementById('ninjaSaucePlayerWrap');
      const chatFrame = document.getElementById('ninjaSauceChatFrame');

      if (playerWrap && !document.getElementById('ninjaSauceTwitchVideoFrame')) {
        playerWrap.innerHTML = `
          <iframe
            id="ninjaSauceTwitchVideoFrame"
            title="NinjaSauceX Twitch Video Player"
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
        return String(game.box_art_url).replace('{width}', '285').replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function renderNinjaSauceRecentGames(games) {
      const grid = document.getElementById('ninjaSauceRecentGamesGrid');
      if (!grid) return;

      if (!games || !games.length) {
        grid.innerHTML = `
          <div class="empty-games-box" style="grid-column:1/-1; text-align:center;">
            <strong style="color:#2aa7ff; display:block; margin-bottom:8px;">No recent Twitch games collected yet.</strong>
            <span style="color:rgba(255,255,255,.86); line-height:1.5; display:block;">
              This section is active and will automatically update as ${escapeHTML(streamerDisplayName)} streams games on Twitch.
            </span>
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map((game) => {
        const name = game.name || game.game_name || 'Recently Streamed Game';
        const image = normalizeGameImage({ ...game, name });
        const description = game.last_title || game.description || `Recently streamed by ${streamerDisplayName}.`;
        const lastPlayed = game.last_played ? `<span>Last played: ${escapeHTML(game.last_played)}</span>` : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${streamerLogin}" target="_blank" rel="noopener" aria-label="Watch ${escapeHTML(streamerDisplayName)} play ${escapeHTML(name)} on Twitch">
            <div class="streamer-game-logo-wrap">
              <img src="${escapeHTML(image)}" alt="${escapeHTML(name)} artwork" loading="lazy" decoding="async">
            </div>
            <div class="game-card-copy">
              <strong>${escapeHTML(name)}</strong>
              <span>${escapeHTML(description)}</span>
              ${lastPlayed}
            </div>
          </a>
        `;
      }).join('');
    }

    async function loadNinjaSauceRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(`${apiBase}/api/recent-games?login=${streamerLogin}&limit=4`, { cache: 'no-store' });
        const payload = await response.json();
        const games = payload.games || payload.recentGames || [];

        renderNinjaSauceRecentGames(games);

        if (status) {
          status.textContent = games.length
            ? `These games update from ${streamerDisplayName}'s recent Twitch activity.`
            : `No recent Twitch game history is stored yet. This section will update automatically as ${streamerDisplayName} streams.`;
        }
      } catch (error) {
        renderNinjaSauceRecentGames([]);
        if (status) {
          status.textContent = `Recent Twitch activity will appear here once it is available.`;
        }
      }
    }

    async function loadNinjaSauceLiveStatus() {
      const badge = document.getElementById('ninjaSauceLiveBadge');
      const meta = document.getElementById('ninjaSauceLiveMeta');
      const title = document.getElementById('ninjaSauceLiveTitle');
      const playerWrap = document.getElementById('ninjaSaucePlayerWrap');
      const watchBtn = document.getElementById('ninjaSauceWatchBtn');

      if (!badge || !meta || !title || !playerWrap || !watchBtn) return;

      loadNinjaSauceTwitchWindows();

      try {
        const response = await fetch(`${apiBase}/api/twitch-status`, { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.details || payload.error || 'Unable to load Twitch status.');
        }

        const stream = (payload.channels || []).find(
          channel => String(channel.login).toLowerCase() === streamerLogin
        );

        if (!stream || !stream.live) {
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = `${streamerDisplayName} is not live right now. Follow on Twitch or join FaithForge Discord for stream and community updates.`;
          loadNinjaSauceTwitchWindows();
          watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;
          return;
        }

        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;

        loadNinjaSauceTwitchWindows();
      } catch (error) {
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        loadNinjaSauceTwitchWindows();
      }
    }

    document.addEventListener('DOMContentLoaded', async () => {
      loadNinjaSauceTwitchWindows();
      await loadNinjaSauceLiveStatus();
      await loadNinjaSauceRecentGames();

      setInterval(async () => {
        await loadNinjaSauceLiveStatus();
        await loadNinjaSauceRecentGames();
      }, 90000);
    });
