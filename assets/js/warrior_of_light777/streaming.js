const warriorLogin = 'warrior_of_light777';
    const warriorDisplayName = 'Warrior_of_light777';
    let latestWarriorLiveStream = null;

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

    function updateWarriorTwitchWindows() {
      const video = document.getElementById('warriorTwitchVideo');
      const chat = document.getElementById('warriorTwitchChat');
      const parentQuery = getTwitchParentQuery();

      if (video) {
        video.src = `https://player.twitch.tv/?channel=${encodeURIComponent(warriorLogin)}&${parentQuery}&autoplay=true&muted=false`;
      }

      if (chat) {
        chat.src = `https://www.twitch.tv/embed/${encodeURIComponent(warriorLogin)}/chat?${parentQuery}&darkpopout`;
      }
    }

    function getWarriorGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game.image || '/Anvil.webp';
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderWarriorRecentGames(games) {
      const grid = document.getElementById('warriorRecentGamesGrid');
      if (!grid) return;

      if (!games.length) {
        grid.innerHTML = `
          <div class="empty-state-card">
            Recent Twitch games will appear here as Warrior_of_light777 streams. This section is connected to the FaithForge Twitch API and will update automatically as new Twitch activity is collected.
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map((game) => {
        const name = escapeHtml(game.name || game.game_name || 'Recently Streamed Game');
        const image = escapeHtml(getWarriorGameImage(game));
        const description = escapeHtml(game.last_title || game.description || `Recently streamed by ${warriorDisplayName}.`);
        const lastPlayed = game.last_played ? `<span>Last played: ${escapeHtml(game.last_played)}</span>` : '';

        return `
          <a class="streamer-game-card" href="https://www.twitch.tv/${warriorLogin}" target="_blank" rel="noopener" aria-label="Watch ${warriorDisplayName} play ${name} on Twitch">
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

    async function loadWarriorRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(
          `https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games?login=${encodeURIComponent(warriorLogin)}&limit=4`,
          { cache: 'no-store' }
        );

        const payload = await response.json();
        let games = payload.games || payload.recentGames || [];

        if (latestWarriorLiveStream && latestWarriorLiveStream.game_name) {
          const liveGame = {
            name: latestWarriorLiveStream.game_name,
            game_id: latestWarriorLiveStream.game_id || '',
            box_art_url: latestWarriorLiveStream.box_art_url || '',
            last_title: latestWarriorLiveStream.title || 'Currently live on Twitch',
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

        renderWarriorRecentGames(games);

        if (status) {
          if (games.length) {
            status.textContent = `These games update from ${warriorDisplayName}'s recent Twitch activity.`;
          } else {
            status.textContent = 'No recent Twitch games have been collected yet. This section will update automatically as Warrior_of_light777 streams.';
          }
        }
      } catch (error) {
        renderWarriorRecentGames([]);

        if (status) {
          status.textContent = 'Recent game tracking is connected, but no Twitch activity could be loaded right now.';
        }
      }
    }

    async function loadWarriorLiveStatus() {
      const badge = document.getElementById('warriorLiveBadge');
      const meta = document.getElementById('warriorLiveMeta');
      const title = document.getElementById('warriorLiveTitle');
      const watchBtn = document.getElementById('warriorWatchBtn');

      if (!badge || !meta || !title || !watchBtn) return;

      updateWarriorTwitchWindows();

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
          channel => String(channel.login).toLowerCase() === warriorLogin
        );

        if (!stream || !stream.live) {
          latestWarriorLiveStream = null;
          badge.textContent = 'OFFLINE';
          badge.className = 'live-badge offline';
          meta.textContent = 'Currently offline';
          title.textContent = 'Warrior_of_light777 is not live right now. Follow on Twitch, check the schedule, or join Discord for stream updates.';
          watchBtn.href = 'https://www.twitch.tv/warrior_of_light777';
          return;
        }

        latestWarriorLiveStream = stream;
        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = 'https://www.twitch.tv/warrior_of_light777';

        updateWarriorTwitchWindows();
      } catch (error) {
        latestWarriorLiveStream = null;
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
        updateWarriorTwitchWindows();
      }
    }

    async function refreshWarriorTwitchSections() {
      await loadWarriorLiveStatus();
      await loadWarriorRecentGames();
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateWarriorTwitchWindows();
      refreshWarriorTwitchSections();
      setInterval(refreshWarriorTwitchSections, 90000);
    });
