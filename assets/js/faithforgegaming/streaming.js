const faithForgeLogin = 'faithforgegaming';
    const faithForgeDisplayName = 'FaithForgeGaming';
    let latestFaithForgeLiveStream = null;

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

    function updateFaithForgeTwitchWindows() {
      const video = document.getElementById('faithForgeTwitchVideo');
      const chat = document.getElementById('faithForgeTwitchChat');
      const parentQuery = getTwitchParentQuery();

      if (video) {
        video.src = `https://player.twitch.tv/?channel=${encodeURIComponent(faithForgeLogin)}&${parentQuery}&autoplay=true&muted=false`;
      }

      if (chat) {
        chat.src = `https://www.twitch.tv/embed/${encodeURIComponent(faithForgeLogin)}/chat?${parentQuery}&darkpopout`;
      }
    }

    function getFaithForgeGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function renderFaithForgeRecentGames(games) {
      const grid = document.getElementById('faithForgeRecentGamesGrid');
      if (!grid) return;

      if (!games.length) {
        grid.innerHTML = `
          <div class="empty-state-card">
            Recent Twitch games will appear here as FaithForgeGaming streams. This section is connected to the FaithForge Twitch API and will update automatically as new Twitch activity is collected.
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map((game) => {
        const name = game.name || game.game_name || 'Recently Streamed Game';
        const image = getFaithForgeGameImage(game);
        const description = game.last_title || game.description || `Recently streamed by ${faithForgeDisplayName}.`;
        const lastPlayed = game.last_played ? `<span>Last played: ${game.last_played}</span>` : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${faithForgeLogin}" target="_blank" rel="noopener" aria-label="Watch ${faithForgeDisplayName} play ${name} on Twitch">
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

    async function loadFaithForgeRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(
          `https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games?login=${faithForgeLogin}&limit=4`,
          { cache: 'no-store' }
        );

        const payload = await response.json();
        let games = payload.games || payload.recentGames || [];

        if (latestFaithForgeLiveStream && latestFaithForgeLiveStream.game_name) {
          const liveGame = {
            name: latestFaithForgeLiveStream.game_name,
            game_id: latestFaithForgeLiveStream.game_id || '',
            box_art_url: latestFaithForgeLiveStream.box_art_url || '',
            last_title: latestFaithForgeLiveStream.title || 'Currently live on Twitch',
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

        renderFaithForgeRecentGames(games);

        if (status) {
          if (games.length) {
            status.textContent = `These games update from ${faithForgeDisplayName}'s recent Twitch activity.`;
          } else {
            status.textContent = 'No recent Twitch games have been collected yet. This section will update automatically as FaithForgeGaming streams.';
          }
        }
      } catch (error) {
        renderFaithForgeRecentGames([]);

        if (status) {
          status.textContent = 'Recent game tracking is connected, but no Twitch activity could be loaded right now.';
        }
      }
    }

    async function loadFaithForgeLiveStatus() {
      const badge = document.getElementById('faithForgeLiveBadge');
      const meta = document.getElementById('faithForgeLiveMeta');
      const title = document.getElementById('faithForgeLiveTitle');
      const watchBtn = document.getElementById('faithForgeWatchBtn');

      if (!badge || !meta || !title || !watchBtn) return;

      updateFaithForgeTwitchWindows();

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
          channel => String(channel.login).toLowerCase() === faithForgeLogin
        );

        if (!stream || !stream.live) {
          latestFaithForgeLiveStream = null;
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = 'FaithForgeGaming is not live right now. Follow on Twitch, check the schedule, or join Discord for the next stream update.';
          watchBtn.href = 'https://www.twitch.tv/faithforgegaming';
          return;
        }

        latestFaithForgeLiveStream = stream;
        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = 'https://www.twitch.tv/faithforgegaming';

        updateFaithForgeTwitchWindows();
      } catch (error) {
        latestFaithForgeLiveStream = null;
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        updateFaithForgeTwitchWindows();
      }
    }

    async function refreshFaithForgeTwitchSections() {
      await loadFaithForgeLiveStatus();
      await loadFaithForgeRecentGames();
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateFaithForgeTwitchWindows();
      refreshFaithForgeTwitchSections();
      setInterval(refreshFaithForgeTwitchSections, 90000);
    });
