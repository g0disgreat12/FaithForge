const STREAM_STATUS_ENDPOINT = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/twitch-status';
    const RECENT_GAMES_ENDPOINT = 'https://faithforge-raidtrain-api.faithforgegaming.workers.dev/api/recent-games';

    /*
      TO ADD MORE STREAMERS:
      1. Add the streamer to STREAMERS below.
      2. Add their Twitch login to your Cloudflare Worker team list if the Worker uses a hard-coded list.
      3. Create their personal page for SEO.
      4. Add a static creator card above for better search value.
    */
    const STREAMERS = [
      {
        login: 'faithforgegaming',
        name: 'FaithForgeGaming',
        subtitle: 'G0dsblessing',
        image: 'G0dsblessing.webp',
        page: '/faithforgegaming/',
        twitch: 'https://www.twitch.tv/faithforgegaming',
        fallbackGame: 'FaithForge Gaming',
        fallbackTitle: 'Christian gaming, community streams, events, and FaithForge adventures',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@FaithForgeGaming' },
          { label: 'Rumble', url: 'https://rumble.com/user/FaithForgeGaming/live' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@faithforge.gaming?is_from_webapp=1&sender_device=pc' },
          { label: 'Kick', url: 'https://kick.com/faithforgegaming/about' },
          { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100070219355952' },
          { label: 'Instagram', url: 'https://www.instagram.com/faithforgegaming' },
          { label: 'Spotify', url: 'https://open.spotify.com/show/033UeDLy6gsvn61Q0KrgXJ?si=LMZjsYerTOed3RTE5KskPQ&nd=1&dlsi=b7bcd52d0c0f4549' }          
        ]
      },
      {
        login: 'doctorjsways',
        name: 'DoctorJSWAYS',
        subtitle: 'Family friendly Christ-centered gaming',
        image: '/DoctorJSWAYS/DoctorJSWAYS1.webp',
        page: '/DoctorJSWAYS/',
        twitch: 'https://www.twitch.tv/doctorjsways',
        fallbackGame: 'Fortnite / Variety Gaming',
        fallbackTitle: 'Family friendly and Christ-centered gaming content',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@DoctorJSW' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@doctorjsways?_t=ZP-90qlk47XjQt&_r=1' }
        ]
      },
      {
        login: 'seawolf_30',
        name: 'Seawolf_30',
        subtitle: 'Cozy community adventures',
        image: '/Seawolf_30/Seawolf.webp',
        page: '/Seawolf_30/',
        twitch: 'https://www.twitch.tv/seawolf_30?sr=a',
        fallbackGame: 'Cozy / Community Gaming',
        fallbackTitle: 'Heartfelt adventures, laughter, creativity, and shared stories',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@TRCCozyCorner' },
          { label: 'YouTube VODS', url: 'https://www.youtube.com/@Seawolf_30VODS' }
        ]
      },
      {
        login: 'mooncalfmage',
        name: 'Mooncalfmage',
        subtitle: 'Cozy survival gamer',
        image: '/mooncalfmage/mooncalfmage.webp',
        page: '/mooncalfmage/',
        twitch: 'https://www.twitch.tv/mooncalfmage',
        fallbackGame: 'Cozy / Survival Gaming',
        fallbackTitle: 'Family friendly cozy and survival gaming while representing Christ',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@mooncalfmage' },
          { label: 'Instagram', url: 'https://www.instagram.com/mooncalfmage/reel/DQcJURbEb_U' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@mooncalfmage?_r=1&_t=ZP-91tHTKgA4xq' }
        ]
      },
      {
        login: 'ninjasaucex',
        name: 'NinjaSauceX',
        subtitle: 'Born-again gamer',
        image: '/NinjaSauceX/NinjaSauceX.webp',
        page: '/NinjaSauceX/',
        twitch: 'https://www.twitch.tv/ninjasaucex',
        fallbackGame: 'FPS / PVE Variety Gaming',
        fallbackTitle: 'Non-toxic, PG-rated, encouraging gaming and community',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@ninjasaucexgaming' },
          { label: 'YouTube TQOutside', url: 'https://www.youtube.com/@TQOutside' }
        ]
      },
      {
        login: 'romans1014xp',
        name: 'Romans1014XP',
        subtitle: 'Born-again gamer',
        image: '/romans1014XP/romans1014XP.webp',
        page: '/romans1014xp/',
        twitch: 'https://www.twitch.tv/romans1014xp',
        fallbackGame: 'Variety Gaming',
        fallbackTitle: 'Non-toxic, encouraging gaming and community',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@romans1014xp' },
        ]
      },
    {
        login: 'warrior_of_light777',
        name: 'warrior_of_light777',
        subtitle: 'Old-school gamer',
        image: '/Warrior_of_light777/warrior_of_light.webp',
        page: '/warrior_of_light777/',
        twitch: 'https://www.twitch.tv/warrior_of_light777',
        fallbackGame: 'Old-school gamer / Variety Gaming',
        fallbackTitle: 'Old-school gamer, community builder, and Christ-centered community',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@warrior_of_light777' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@warrior_of_light777' },
          { label: 'Blessing Boat Discord', url: 'https://discord.gg/FXkxK3AadR' }
        ]
      }
    ];

    let statusByLogin = new Map();
    let recentGamesByLogin = new Map();
    let recentGamesFetchedAt = new Map();
    let selectedLogin = 'faithforgegaming';
    let userPickedStreamer = false;
    let embeddedLogin = null;
    let recentGamesRequestCounter = 0;

    function normalizeLogin(value) {
      return String(value || '').trim().toLowerCase();
    }

    function escapeHTML(value) {
      return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function escapeAttribute(value) {
      return escapeHTML(value);
    }

    function getStreamer(login) {
      return STREAMERS.find(streamer => streamer.login === normalizeLogin(login)) || STREAMERS[0];
    }

    function getStatus(login) {
      const streamer = getStreamer(login);

      return statusByLogin.get(normalizeLogin(login)) || {
        login: streamer.login,
        display_name: streamer.name,
        live: false,
        game_name: '',
        title: '',
        viewer_count: 0,
        started_at: '',
        game_id: '',
        box_art_url: ''
      };
    }

    function getRecentGames(login) {
      return recentGamesByLogin.get(normalizeLogin(login)) || [];
    }

    function getBestRecentGame(login) {
      const games = getRecentGames(login);
      return games.length ? games[0] : null;
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

    function getVideoSrc(login) {
      return `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&${getTwitchParentQuery()}&autoplay=true&muted=false`;
    }

    function getChatSrc(login) {
      return `https://www.twitch.tv/embed/${encodeURIComponent(login)}/chat?${getTwitchParentQuery()}&darkpopout`;
    }

    function formatViewers(count) {
      const number = Number(count || 0);

      if (!number) {
        return '0 viewers';
      }

      return `${number.toLocaleString()} ${number === 1 ? 'viewer' : 'viewers'}`;
    }

    function getGameName(game) {
      return game?.name || game?.game_name || game?.category || '';
    }

    function getGameTitle(game) {
      return game?.last_title || game?.title || game?.description || '';
    }

    function getGameLastPlayed(game) {
      return game?.last_played || game?.lastLive || game?.last_live_at || game?.played_at || '';
    }

    function getGameImage(game) {
      if (game?.box_art_url) {
        return String(game.box_art_url)
          .replace('{width}', '285')
          .replace('{height}', '380');
      }

      return game?.image || game?.thumbnail_url || '/Anvil.webp';
    }

    function setStatusNote(message) {
      const statusNote = document.getElementById('statusNote');

      if (statusNote) {
        statusNote.textContent = message;
      }
    }

    function normalizeStatusChannel(rawChannel) {
      const login = normalizeLogin(
        rawChannel.login ||
        rawChannel.user_login ||
        rawChannel.channel_login ||
        rawChannel.channel ||
        rawChannel.name
      );

      const streamer = getStreamer(login);

      return {
        login,
        display_name: rawChannel.display_name || rawChannel.user_name || streamer.name || login,
        live: Boolean(rawChannel.live || rawChannel.type === 'live' || rawChannel.is_live),
        game_name: rawChannel.game_name || rawChannel.game || rawChannel.category || '',
        title: rawChannel.title || rawChannel.stream_title || '',
        viewer_count: Number(rawChannel.viewer_count || rawChannel.viewers || 0) || 0,
        started_at: rawChannel.started_at || '',
        game_id: rawChannel.game_id || '',
        box_art_url: rawChannel.box_art_url || rawChannel.game_box_art_url || ''
      };
    }

    function applyStatusPayload(payload) {
      const rawChannels = Array.isArray(payload.channels)
        ? payload.channels
        : Array.isArray(payload.data)
          ? payload.data
          : [];

      const nextStatusMap = new Map();

      rawChannels.forEach(rawChannel => {
        const status = normalizeStatusChannel(rawChannel);

        if (!status.login) return;

        nextStatusMap.set(status.login, status);
      });

      STREAMERS.forEach(streamer => {
        if (!nextStatusMap.has(streamer.login)) {
          nextStatusMap.set(streamer.login, {
            login: streamer.login,
            display_name: streamer.name,
            live: false,
            game_name: '',
            title: '',
            viewer_count: 0,
            started_at: '',
            game_id: '',
            box_art_url: ''
          });
        }
      });

      statusByLogin = nextStatusMap;
    }

    function getSortedStreamers() {
      return STREAMERS
        .map((streamer, index) => ({
          streamer,
          index,
          status: getStatus(streamer.login)
        }))
        .sort((a, b) => {
          if (a.status.live && b.status.live) {
            return (b.status.viewer_count || 0) - (a.status.viewer_count || 0) || a.index - b.index;
          }

          if (a.status.live !== b.status.live) {
            return a.status.live ? -1 : 1;
          }

          return a.index - b.index;
        });
    }

    function chooseAutoStreamer() {
      const faithForgeStatus = getStatus('faithforgegaming');

      if (faithForgeStatus.live) {
        return 'faithforgegaming';
      }

      const highestLive = getSortedStreamers().find(item => item.status.live);

      if (highestLive) {
        return highestLive.streamer.login;
      }

      return 'faithforgegaming';
    }

    function getRosterStatusLine(streamer, status) {
      const recentGame = getBestRecentGame(streamer.login);

      if (status.live) {
        const game = status.game_name || 'Live on Twitch';
        const title = status.title || 'Currently streaming now';
        return `LIVE • ${game} • ${title}`;
      }

      if (recentGame) {
        const game = getGameName(recentGame) || streamer.fallbackGame || 'Recently streamed game';
        const title = getGameTitle(recentGame) || streamer.fallbackTitle || 'Recent Twitch activity';
        const lastPlayed = getGameLastPlayed(recentGame);

        if (lastPlayed) {
          return `Offline • ${lastPlayed} • ${game} — ${title}`;
        }

        return `Offline • ${game} — ${title}`;
      }

      return `Offline • Loading recent games...`;
    }

    function renderRoster() {
      const list = document.getElementById('streamerList');

      if (!list) return;

      list.innerHTML = '';

      getSortedStreamers().forEach(({ streamer, status }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `streamer-button ${streamer.login === selectedLogin ? 'active' : ''}`;
        button.setAttribute('aria-label', `Watch ${streamer.name}`);

        button.addEventListener('click', () => {
          userPickedStreamer = true;
          selectStreamer(streamer.login);
        });

        const avatarWrap = document.createElement('span');
        avatarWrap.className = 'streamer-avatar-wrap';

        const avatar = document.createElement('img');
        avatar.src = streamer.image;
        avatar.alt = `${streamer.name} avatar`;
        avatar.loading = 'lazy';

        const dot = document.createElement('span');
        dot.className = `live-dot ${status.live ? 'online' : ''}`;

        avatarWrap.appendChild(avatar);
        avatarWrap.appendChild(dot);

        const details = document.createElement('span');

        const nameLine = document.createElement('span');
        nameLine.className = 'streamer-list-name';

        const nameText = document.createElement('span');
        nameText.textContent = streamer.name;

        nameLine.appendChild(nameText);

        if (status.live) {
          const viewerPill = document.createElement('span');
          viewerPill.className = 'viewer-pill';
          viewerPill.textContent = formatViewers(status.viewer_count);
          nameLine.appendChild(viewerPill);
        }

        const statusLine = document.createElement('span');
        statusLine.className = `streamer-list-status ${status.live ? 'live' : ''}`;
        statusLine.textContent = getRosterStatusLine(streamer, status);

        details.appendChild(nameLine);
        details.appendChild(statusLine);

        button.appendChild(avatarWrap);
        button.appendChild(details);

        list.appendChild(button);
      });
    }

    function renderMobileSelect() {
      const select = document.getElementById('streamerSelect');

      if (!select) return;

      select.innerHTML = '';

      getSortedStreamers().forEach(({ streamer, status }) => {
        const recentGame = getBestRecentGame(streamer.login);
        const option = document.createElement('option');
        option.value = streamer.login;

        if (status.live) {
          option.textContent = `LIVE • ${streamer.name} • ${formatViewers(status.viewer_count)}`;
        } else if (recentGame) {
          const game = getGameName(recentGame) || streamer.fallbackGame || 'Recent Twitch activity';
          option.textContent = `Offline • ${streamer.name} • ${game}`;
        } else {
          option.textContent = `Offline • ${streamer.name}`;
        }

        select.appendChild(option);
      });

      select.value = selectedLogin;

      select.onchange = event => {
        userPickedStreamer = true;
        selectStreamer(event.target.value);
      };
    }

    function renderActiveLinks(streamer, status) {
      const linksContainer = document.getElementById('activeLinks');

      if (!linksContainer) return;

      linksContainer.innerHTML = '';

      const links = [
        { label: 'Personal FaithForge Page', url: streamer.page, local: true },
        { label: 'Watch / Follow on Twitch', url: streamer.twitch },
        ...streamer.links.map(link => ({ ...link, secondary: true }))
      ];

      links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label;

        if (!link.local) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }

        if (link.secondary) {
          anchor.className = 'secondary';
        }

        linksContainer.appendChild(anchor);
      });
    }

    function updateEmbeds(login) {
      if (embeddedLogin === login) return;

      const video = document.getElementById('twitchVideo');
      const chat = document.getElementById('twitchChat');

      if (video) {
        video.src = getVideoSrc(login);
        video.title = `${getStreamer(login).name} Twitch video player`;
      }

      if (chat) {
        chat.src = getChatSrc(login);
        chat.title = `${getStreamer(login).name} Twitch chat`;
      }

      embeddedLogin = login;
    }

    function updateActivePanel() {
      const streamer = getStreamer(selectedLogin);
      const status = getStatus(streamer.login);
      const recentGame = getBestRecentGame(streamer.login);

      const activeAvatar = document.getElementById('activeAvatar');
      const activeStatusBadge = document.getElementById('activeStatusBadge');
      const activeName = document.getElementById('activeName');
      const activeMeta = document.getElementById('activeMeta');
      const activeLastDate = document.getElementById('activeLastDate');
      const activeTitle = document.getElementById('activeTitle');
      const activeDescription = document.getElementById('activeDescription');
      const liveReason = document.getElementById('liveReason');
      const chatLabel = document.getElementById('chatLabel');
      const select = document.getElementById('streamerSelect');
      const twitchBtn = document.getElementById('selectedRecentGamesTwitchBtn');

      if (activeAvatar) {
        activeAvatar.src = streamer.image;
        activeAvatar.alt = `${streamer.name} avatar`;
      }

      if (activeStatusBadge) {
        activeStatusBadge.className = `status-badge ${status.live ? 'live' : ''}`;
        activeStatusBadge.textContent = status.live ? 'Live Now' : 'Offline';
      }

      if (activeName) {
        activeName.textContent = streamer.subtitle ? `${streamer.name} — ${streamer.subtitle}` : streamer.name;
      }

      if (activeMeta) {
        if (status.live) {
          activeMeta.textContent = `${status.game_name || 'Live on Twitch'} • ${formatViewers(status.viewer_count)}`;
        } else if (recentGame) {
          activeMeta.textContent = `Last game/category: ${getGameName(recentGame) || streamer.fallbackGame || 'Recent Twitch activity'}`;
        } else {
          activeMeta.textContent = `Last game/category: Loading recent Twitch activity...`;
        }
      }

      if (activeLastDate) {
        if (status.live) {
          activeLastDate.textContent = status.started_at
            ? `Started: ${new Date(status.started_at).toLocaleString()}`
            : `Currently live on Twitch`;
        } else if (recentGame && getGameLastPlayed(recentGame)) {
          activeLastDate.textContent = `Last played: ${getGameLastPlayed(recentGame)}`;
        } else {
          activeLastDate.textContent = `Last played: Loading from Twitch...`;
        }
      }

      if (activeTitle) {
        if (status.live) {
          activeTitle.textContent = status.title || 'Currently streaming now.';
        } else if (recentGame) {
          activeTitle.textContent = getGameTitle(recentGame) || streamer.fallbackTitle || 'Recent Twitch activity loaded.';
        } else {
          activeTitle.textContent = streamer.fallbackTitle || 'Recent Twitch activity will load here.';
        }
      }

      if (activeDescription) {
        if (!status.live && recentGame && recentGame.description && recentGame.description !== getGameTitle(recentGame)) {
          activeDescription.textContent = recentGame.description;
        } else {
          activeDescription.textContent = '';
        }
      }

      if (liveReason) {
        if (userPickedStreamer) {
          liveReason.textContent = `You selected ${streamer.name}. The player, chat, links, and recent games will stay on this creator unless you choose someone else.`;
        } else if (streamer.login === 'faithforgegaming' && status.live) {
          liveReason.textContent = 'FaithForgeGaming is live, so it stays featured first.';
        } else if (status.live) {
          liveReason.textContent = `${streamer.name} is currently the highest-viewed live FaithForge creator while FaithForgeGaming is offline.`;
        } else {
          liveReason.textContent = 'No FaithForge creator is live right now, so FaithForgeGaming is loaded by default.';
        }
      }

      if (chatLabel) {
        chatLabel.textContent = `Chat is currently loaded for ${streamer.name}.`;
      }

      if (select) {
        select.value = streamer.login;
      }

      if (twitchBtn) {
        twitchBtn.href = streamer.twitch;
        twitchBtn.textContent = `Open ${streamer.name} on Twitch`;
      }

      renderActiveLinks(streamer, status);
      updateEmbeds(streamer.login);
    }

    function getLiveGameCard(status) {
      if (!status.live || !status.game_name) return null;

      return {
        name: status.game_name,
        game_name: status.game_name,
        game_id: status.game_id || '',
        box_art_url: status.box_art_url || '',
        last_title: status.title || 'Currently live on Twitch',
        last_played: 'Live now',
        description: status.title || 'Currently live on Twitch'
      };
    }

    function dedupeGames(games) {
      const seen = new Set();
      const cleanGames = [];

      games.forEach(game => {
        const name = String(getGameName(game) || '').toLowerCase();
        const gameId = String(game?.game_id || '').toLowerCase();
        const key = gameId || name;

        if (!key || seen.has(key)) return;

        seen.add(key);
        cleanGames.push(game);
      });

      return cleanGames;
    }

    async function fetchRecentGames(login, force = false) {
      const normalizedLogin = normalizeLogin(login);
      const now = Date.now();
      const lastFetched = recentGamesFetchedAt.get(normalizedLogin) || 0;

      if (!force && recentGamesByLogin.has(normalizedLogin) && now - lastFetched < 120000) {
        return recentGamesByLogin.get(normalizedLogin);
      }

      const response = await fetch(
        `${RECENT_GAMES_ENDPOINT}?login=${encodeURIComponent(normalizedLogin)}&limit=4`,
        { cache: 'no-store' }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.details || payload.error || 'Unable to load recent games.');
      }

      const rawGames = payload.games || payload.recentGames || [];
      const status = getStatus(normalizedLogin);
      const liveGame = getLiveGameCard(status);

      const games = dedupeGames([
        ...(liveGame ? [liveGame] : []),
        ...rawGames
      ]).slice(0, 4);

      recentGamesByLogin.set(normalizedLogin, games);
      recentGamesFetchedAt.set(normalizedLogin, now);

      return games;
    }

    function renderSelectedRecentGames(games, streamer) {
      const grid = document.getElementById('selectedRecentGamesGrid');

      if (!grid) return;

      if (!games.length) {
        grid.innerHTML = `
          <div class="empty-state-card">
            Recent Twitch games will appear here as ${escapeHTML(streamer.name)} streams.
          </div>
        `;
        return;
      }

      grid.innerHTML = games.slice(0, 4).map(game => {
        const name = getGameName(game) || 'Recently Streamed Game';
        const image = getGameImage(game);
        const description = getGameTitle(game) || `Recently streamed by ${streamer.name}.`;
        const lastPlayed = getGameLastPlayed(game)
          ? `<span>Last played: ${escapeHTML(getGameLastPlayed(game))}</span>`
          : '';

        return `
          <a class="streamer-game-card" href="${escapeAttribute(streamer.twitch)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeAttribute(streamer.name)} play ${escapeAttribute(name)} on Twitch">
            <div class="streamer-game-logo-wrap">
              <img src="${escapeAttribute(image)}" alt="${escapeAttribute(name)} artwork" loading="lazy" decoding="async">
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

    async function loadSelectedStreamerRecentGames(force = false) {
      const requestId = ++recentGamesRequestCounter;
      const streamer = getStreamer(selectedLogin);
      const statusText = document.getElementById('selectedRecentGamesStatus');

      if (statusText) {
        statusText.textContent = `Loading ${streamer.name}'s recent Twitch activity...`;
      }

      try {
        const games = await fetchRecentGames(streamer.login, force);

        if (requestId !== recentGamesRequestCounter) return;

        renderSelectedRecentGames(games, streamer);

        if (statusText) {
          statusText.textContent = games.length
            ? `These games update from ${streamer.name}'s recent Twitch activity.`
            : `No recent Twitch games have been collected yet for ${streamer.name}.`;
        }

        renderRoster();
        renderMobileSelect();
        updateActivePanel();
      } catch (error) {
        if (requestId !== recentGamesRequestCounter) return;

        const grid = document.getElementById('selectedRecentGamesGrid');

        if (grid) {
          grid.innerHTML = `
            <div class="empty-state-card">
              Recent game tracking is connected, but no Twitch activity could be loaded right now for ${escapeHTML(streamer.name)}.
            </div>
          `;
        }

        if (statusText) {
          statusText.textContent = 'Recent game tracking could not be loaded right now.';
        }

        console.error(`Recent games error for ${streamer.login}:`, error);
      }
    }

    async function hydrateAllRecentGames(force = false) {
      await Promise.allSettled(
        STREAMERS.map(streamer => fetchRecentGames(streamer.login, force))
      );

      renderRoster();
      renderMobileSelect();
      updateActivePanel();

      const selectedStreamer = getStreamer(selectedLogin);
      renderSelectedRecentGames(getRecentGames(selectedStreamer.login), selectedStreamer);
    }

    function selectStreamer(login) {
      selectedLogin = normalizeLogin(login);

      renderMobileSelect();
      renderRoster();
      updateActivePanel();
      renderSelectedRecentGames(getRecentGames(selectedLogin), getStreamer(selectedLogin));
      loadSelectedStreamerRecentGames(false);
    }

    async function refreshStatuses() {
      try {
        const response = await fetch(STREAM_STATUS_ENDPOINT, { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.details || payload.error || 'Unable to load Twitch status.');
        }

        applyStatusPayload(payload);

        const liveCount = STREAMERS.filter(streamer => getStatus(streamer.login).live).length;

        if (liveCount > 0) {
          setStatusNote(`${liveCount} FaithForge ${liveCount === 1 ? 'creator is' : 'creators are'} live right now. Live channels are sorted by viewer count.`);
        } else {
          setStatusNote('No FaithForge creators are live right now. Offline creators show recently streamed games when Twitch activity is available.');
        }

        if (!userPickedStreamer) {
          selectedLogin = chooseAutoStreamer();
        }

        renderMobileSelect();
        renderRoster();
        updateActivePanel();

        await loadSelectedStreamerRecentGames(true);
      } catch (error) {
        console.error('FaithForge Twitch status error:', error);

        STREAMERS.forEach(streamer => {
          if (!statusByLogin.has(streamer.login)) {
            statusByLogin.set(streamer.login, {
              login: streamer.login,
              display_name: streamer.name,
              live: false,
              game_name: '',
              title: '',
              viewer_count: 0,
              started_at: '',
              game_id: '',
              box_art_url: ''
            });
          }
        });

        setStatusNote('Could not load live Twitch status. The streamer list is still usable, but live sorting may be unavailable.');
        renderMobileSelect();
        renderRoster();
        updateActivePanel();
        loadSelectedStreamerRecentGames(false);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      STREAMERS.forEach(streamer => {
        statusByLogin.set(streamer.login, {
          login: streamer.login,
          display_name: streamer.name,
          live: false,
          game_name: '',
          title: '',
          viewer_count: 0,
          started_at: '',
          game_id: '',
          box_art_url: ''
        });
      });

      renderMobileSelect();
      renderRoster();
      updateActivePanel();
      renderSelectedRecentGames([], getStreamer(selectedLogin));

      refreshStatuses();

      /*
        Loads recent games for everyone so offline roster cards can show last known game/title.
        This uses the same /api/recent-games route as the personal streamer pages.
      */
      setTimeout(() => {
        hydrateAllRecentGames(false);
      }, 1000);

      setInterval(refreshStatuses, 90000);

      /*
        Refresh all recent games every 5 minutes.
        This keeps the left roster and recent-games cards updated without hammering the API.
      */
      setInterval(() => {
        hydrateAllRecentGames(true);
      }, 300000);
    });
