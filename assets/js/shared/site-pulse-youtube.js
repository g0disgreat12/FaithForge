/* Watch API-enabled YouTube embeds without reading visitor input or chat. */
(() => {
  const seen = new WeakSet();
  let apiRequested = false;
  const pending = new Set();
  const report = (name, id) => window.sitePulse?.track(`YouTube ${name}: ${id}`);

  function connect(iframe) {
    if (!iframe.isConnected || seen.has(iframe)) return;
    let src;
    try { src = new URL(iframe.src, location.href); } catch { return; }
    if (!['www.youtube.com', 'www.youtube-nocookie.com'].includes(src.hostname) || !src.pathname.startsWith('/embed/') || src.searchParams.get('enablejsapi') !== '1') return;
    const id = src.pathname.split('/')[2];
    if (!/^[A-Za-z0-9_-]{6,30}$/.test(id)) return;
    if (!window.YT?.Player) {
      pending.add(iframe);
      if (!apiRequested) {
        apiRequested = true;
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (typeof previous === 'function') previous();
          for (const item of pending) connect(item);
          pending.clear();
        };
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = () => { pending.clear(); };
        document.head.appendChild(script);
      }
      return;
    }
    seen.add(iframe);
    let timer = null;
    const milestones = new Set();
    function stop() { if (timer !== null) clearInterval(timer); timer = null; }
    try {
      new window.YT.Player(iframe, { events: { onStateChange(event) {
        if (!iframe.isConnected) { stop(); return; }
        if (event.data === 1) {
          report('playing', id);
          if (timer === null) timer = setInterval(() => {
            if (!iframe.isConnected) { stop(); return; }
            const duration = event.target.getDuration(), current = event.target.getCurrentTime();
            if (!(duration > 0) || !Number.isFinite(current)) return;
            for (const threshold of [25, 50, 75]) if (current / duration >= threshold / 100 && !milestones.has(threshold)) { milestones.add(threshold); report(`${threshold}%`, id); }
          }, 10000);
        } else if (event.data === 2) { stop(); report('paused', id); }
        else if (event.data === 0) { stop(); report('completed', id); }
        else if (event.data === 3 || event.data === 5) stop();
      } } });
    } catch { stop(); }
  }
  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches?.('iframe')) connect(root);
    root.querySelectorAll?.('iframe').forEach(connect);
  }
  scan(document);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(scan))).observe(document.documentElement, { childList: true, subtree: true });
})();
