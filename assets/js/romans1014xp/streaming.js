const streamerLogin = 'romans1014xp';
    const streamerDisplayName = 'Romans1014XP';
    let latestStreamerLiveStream = null;

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

    function updateStreamerTwitchWindows() {
      const video = document.getElementById('streamerTwitchVideo');
      const chat = document.getElementById('streamerTwitchChat');
      const parentQuery = getTwitchParentQuery();

      if (video) {
        video.src = `https://player.twitch.tv/?channel=${encodeURIComponent(streamerLogin)}&${parentQuery}&autoplay=true&muted=false`;
      }

      if (chat) {
        chat.src = `https://www.twitch.tv/embed/${encodeURIComponent(streamerLogin)}/chat?${parentQuery}&darkpopout`;
      }
    }

    function getStreamerGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function renderStreamerRecentGames(games) {
      const grid = document.getElementById('streamerRecentGamesGrid');
      if (!grid) return;

      if (!games.length) {
        grid.innerHTML = `
          <div class="empty-state-card">
            Recent Twitch games will appear here as ${streamerDisplayName} streams. Common streams include 7 Days to Die, WWE 2K26, Use Your Words 2, community games, and indie horror nights.
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map((game) => {
        const name = game.name || game.game_name || 'Recently Streamed Game';
        const image = getStreamerGameImage(game);
        const description = game.last_title || game.description || `Recently streamed by ${streamerDisplayName}.`;
        const lastPlayed = game.last_played ? `<span>Last played: ${game.last_played}</span>` : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${streamerLogin}" target="_blank" rel="noopener" aria-label="Watch ${streamerDisplayName} play ${name} on Twitch">
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

    async function loadStreamerRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(
          `https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games?login=${streamerLogin}&limit=4`,
          { cache: 'no-store' }
        );

        const payload = await response.json();
        let games = payload.games || payload.recentGames || [];

        if (latestStreamerLiveStream && latestStreamerLiveStream.game_name) {
          const liveGame = {
            name: latestStreamerLiveStream.game_name,
            game_id: latestStreamerLiveStream.game_id || '',
            box_art_url: latestStreamerLiveStream.box_art_url || '',
            last_title: latestStreamerLiveStream.title || 'Currently live on Twitch',
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

        renderStreamerRecentGames(games);

        if (status) {
          if (games.length) {
            status.textContent = `These games update from ${streamerDisplayName}'s recent Twitch activity.`;
          } else {
            status.textContent = `No recent Twitch games have been collected yet. This section will update automatically as ${streamerDisplayName} streams.`;
          }
        }
      } catch (error) {
        renderStreamerRecentGames([]);

        if (status) {
          status.textContent = 'Recent game tracking is connected, but no Twitch activity could be loaded right now.';
        }
      }
    }

    async function loadStreamerLiveStatus() {
      const badge = document.getElementById('streamerLiveBadge');
      const meta = document.getElementById('streamerLiveMeta');
      const title = document.getElementById('streamerLiveTitle');
      const watchBtn = document.getElementById('streamerWatchBtn');

      if (!badge || !meta || !title || !watchBtn) return;

      updateStreamerTwitchWindows();

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
          channel => String(channel.login).toLowerCase() === streamerLogin
        );

        if (!stream || !stream.live) {
          latestStreamerLiveStream = null;
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = `${streamerDisplayName} is not live right now. Follow on Twitch, check the schedule, or join Discord for the next stream update.`;
          watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;
          return;
        }

        latestStreamerLiveStream = stream;
        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;

        updateStreamerTwitchWindows();
      } catch (error) {
        latestStreamerLiveStream = null;
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        updateStreamerTwitchWindows();
      }
    }

    async function refreshStreamerTwitchSections() {
      await loadStreamerLiveStatus();
      await loadStreamerRecentGames();
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateStreamerTwitchWindows();
      refreshStreamerTwitchSections();
      setInterval(refreshStreamerTwitchSections, 90000);
    });
