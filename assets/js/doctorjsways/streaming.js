const streamerLogin = 'doctorjsways';
    const streamerDisplayName = 'DoctorJSWAYS';
    const apiBase = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev';

    function escapeHTML(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

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

    function getTwitchVideoSrc(login) {
      return `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&${getTwitchParentQuery()}&autoplay=true&muted=false`;
    }

    function getTwitchChatSrc(login) {
      return `https://www.twitch.tv/embed/${encodeURIComponent(login)}/chat?${getTwitchParentQuery()}&darkpopout`;
    }

    function loadDoctorTwitchWindows() {
      const video = document.getElementById('doctorTwitchVideo');
      const chat = document.getElementById('doctorTwitchChat');

      if (video && !video.src) {
        video.src = getTwitchVideoSrc(streamerLogin);
      }

      if (chat && !chat.src) {
        chat.src = getTwitchChatSrc(streamerLogin);
      }
    }

    function normalizeGameImage(game) {
      if (game.box_art_url) {
        return String(game.box_art_url).replace('{width}', '285').replace('{height}', '380');
      }

      const localMap = {
        'minecraft': '/Gameswebp/MINECRAFT.webp',
        'call of duty': '/Gameswebp/CALLOFDUTY.webp',
        'call of duty: warzone': '/Gameswebp/CALLOFDUTY.webp',
        'fortnite': '/Gameswebp/FORTNITE.webp',
        'arc raiders': '/Gameswebp/ARCRAIDERS.webp'
      };

      const key = String(game.name || game.game_name || '').toLowerCase();
      return localMap[key] || game.image || '/Anvil.webp';
    }

    function renderDoctorRecentGames(games) {
      const grid = document.getElementById('doctorRecentGamesGrid');
      if (!grid) return;

      if (!games || !games.length) {
        grid.innerHTML = `
          <div class="empty-games-box" style="grid-column:1/-1; text-align:center;">
            <strong style="color:#f5c518; display:block; margin-bottom:8px;">No recent Twitch games collected yet.</strong>
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

    async function loadDoctorRecentGames() {
      const status = document.getElementById('recentGamesStatus');

      try {
        const response = await fetch(`${apiBase}/api/recent-games?login=${streamerLogin}&limit=4`, { cache: 'no-store' });
        const payload = await response.json();
        const games = payload.games || payload.recentGames || [];

        renderDoctorRecentGames(games);

        if (status) {
          status.textContent = games.length
            ? `These games update from ${streamerDisplayName}' recent Twitch activity.`
            : `No recent Twitch game history is stored yet. This section will update automatically as ${streamerDisplayName} streams.`;
        }
      } catch (error) {
        renderDoctorRecentGames([]);
        if (status) {
          status.textContent = `Recent Twitch activity could not be loaded right now, but this section will update automatically when the API responds.`;
        }
      }
    }

    async function loadDoctorLiveStatus() {
      const badge = document.getElementById('doctorLiveBadge');
      const meta = document.getElementById('doctorLiveMeta');
      const title = document.getElementById('doctorLiveTitle');
      const watchBtn = document.getElementById('doctorWatchBtn');
      const chatLabel = document.getElementById('doctorChatLabel');

      loadDoctorTwitchWindows();

      if (!badge || !meta || !title || !watchBtn) return;

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
          title.textContent = `${streamerDisplayName} is not live right now. Follow on Twitch, check the schedule, or join Discord for the next stream update.`;
          watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;

          if (chatLabel) {
            chatLabel.textContent = `Chat is loaded from ${streamerDisplayName}' Twitch channel.`;
          }

          return;
        }

        badge.textContent = 'LIVE NOW';
        badge.className = 'live-badge online';
        meta.textContent = `${stream.game_name || 'Live on Twitch'}${stream.viewer_count ? ' • ' + stream.viewer_count + ' viewers' : ''}`;
        title.textContent = stream.title || 'Currently streaming now.';
        watchBtn.href = `https://www.twitch.tv/${streamerLogin}`;

        if (chatLabel) {
          chatLabel.textContent = `${streamerDisplayName}' chat is live with the stream.`;
        }
      } catch (error) {
        badge.textContent = 'STATUS ERROR';
        badge.className = 'live-badge offline';
        meta.textContent = 'Could not load Twitch status';
        title.textContent = error.message;
      }
    }

    document.addEventListener('DOMContentLoaded', async () => {
      loadDoctorTwitchWindows();
      await loadDoctorLiveStatus();
      await loadDoctorRecentGames();

      setInterval(async () => {
        await loadDoctorLiveStatus();
        await loadDoctorRecentGames();
      }, 90000);
    });
