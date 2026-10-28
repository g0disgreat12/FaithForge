const seawolfLogin = 'seawolf_30';
    const seawolfDisplayName = 'Seawolf_30';
    let latestSeawolfLiveStream = null;

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
      return `https://player.twitch.tv/?channel=${encodeURIComponent(seawolfLogin)}&${getTwitchParentQuery()}&autoplay=true&muted=false`;
    }

    function getTwitchChatSrc() {
      return `https://www.twitch.tv/embed/${encodeURIComponent(seawolfLogin)}/chat?${getTwitchParentQuery()}&darkpopout`;
    }

    function loadSeawolfTwitchWindows() {
      const playerWrap = document.getElementById('seawolfPlayerWrap');
      const chatFrame = document.getElementById('seawolfChatFrame');

      if (playerWrap && !document.getElementById('seawolfTwitchVideoFrame')) {
        playerWrap.innerHTML = `
          <iframe
            id="seawolfTwitchVideoFrame"
            title="Seawolf_30 Twitch Video Player"
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

    function getSeawolfGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function renderSeawolfRecentGames(games) {
      const grid = document.getElementById('seawolfRecentGamesGrid');
      if (!grid) return;

      if (!games.length) {
        grid.innerHTML = `
          <div class="empty-state-card">
            Recent Twitch games will appear here as Seawolf_30 streams. This section is connected to the FaithForge Twitch API and will update automatically as new Twitch activity is collected.
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map((game) => {
        const name = game.name || game.game_name || 'Recently Streamed Game';
        const image = getSeawolfGameImage(game);
        const description = game.last_title || game.description || `Recently streamed by ${seawolfDisplayName}.`;
        const lastPlayed = game.last_played ? `<span>Last played: ${game.last_played}</span>` : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${seawolfLogin}" target="_blank" rel="noopener" aria-label="Watch ${seawolfDisplayName} play ${name} on Twitch">
            <div class="streamer-game-logo-wrap">
              <img src="${image}" alt="${name} artwork" loading="lazy" decoding="async">
            </div>
            <div class="game-card-copy">
              <strong>${name}</strong>
              <span>${description}</span>
              ${lastPlayed}
            </div>
          </a>
        `;
      }).join('');
    }

    async function loadSeawolfRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(
          `https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games?login=${seawolfLogin}&limit=4`,
          { cache: 'no-store' }
        );

        const payload = await response.json();
        let games = payload.games || payload.recentGames || [];

        if (latestSeawolfLiveStream && latestSeawolfLiveStream.game_name) {
          const liveGame = {
            name: latestSeawolfLiveStream.game_name,
            game_id: latestSeawolfLiveStream.game_id || '',
            box_art_url: latestSeawolfLiveStream.box_art_url || '',
            last_title: latestSeawolfLiveStream.title || 'Currently live on Twitch',
            last_played: 'Live now'
          };

          games = [
            liveGame,
            ...games.filter((game) => {
              const sameGameId = liveGame.game_id && game.game_id && String(game.game_id) === String(liveGame.game_id);
              const sameName = String(game.name || '').toLowerCase() === String(liveGame.name || '').toLowerCase();
              return !sameGameId && !sameName;
            })
          ];
        }

        renderSeawolfRecentGames(games);

        if (status) {
          if (games.length) {
            status.textContent = `These games update from ${seawolfDisplayName}'s recent Twitch activity.`;
          } else {
            status.textContent = 'No recent Twitch games have been collected yet. This section will update automatically as Seawolf_30 streams.';
          }
        }
      } catch (error) {
        renderSeawolfRecentGames([]);

        if (status) {
          status.textContent = 'Recent game tracking is connected, but no Twitch activity could be loaded right now.';
        }
      }
    }

    async function loadSeawolfLiveStatus() {
      const badge = document.getElementById('seawolfLiveBadge');
      const meta = document.getElementById('seawolfLiveMeta');
      const title = document.getElementById('seawolfLiveTitle');
      const playerWrap = document.getElementById('seawolfPlayerWrap');
      const watchBtn = document.getElementById('seawolfWatchBtn');

      if (!badge || !meta || !title || !playerWrap || !watchBtn) return;

      loadSeawolfTwitchWindows();

      try {
        const response = await fetch(
          'https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/twitch-status',
          { cache: 'no-store' }
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.details || payload.error || 'Unable to load Twitch status.');
        }

        const stream = (payload.channels || []).find(
          channel => String(channel.login).toLowerCase() === seawolfLogin
        );

        if (!stream || !stream.live) {
          latestSeawolfLiveStream = null;
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = 'Seawolf_30 is not live right now. Follow on Twitch, check the schedule, or join Discord for the next stream update.';
          loadSeawolfTwitchWindows();
          watchBtn.href = `https://www.twitch.tv/${seawolfLogin}`;
          return;
        }

        latestSeawolfLiveStream = stream;
        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = `https://www.twitch.tv/${seawolfLogin}`;

        loadSeawolfTwitchWindows();
      } catch (error) {
        latestSeawolfLiveStream = null;
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        loadSeawolfTwitchWindows();
      }
    }

    async function refreshSeawolfTwitchSections() {
      await loadSeawolfLiveStatus();
      await loadSeawolfRecentGames();
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadSeawolfTwitchWindows();
      refreshSeawolfTwitchSections();
      setInterval(refreshSeawolfTwitchSections, 90000);
    });
