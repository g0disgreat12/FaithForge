// Keep tracking parameters and fragment links when the origin handles an old URL.
// Cloudflare's permanent HTTP redirects remain the preferred production route.
(() => {
  const link = document.querySelector('link[rel="canonical"]');
  if (!link) return;
  const pathname = new URL(link.href).pathname;
  const targets = new Set(['/warrior_of_light777/', '/romans1014xp/', '/faithforgegaming/']);
  if (targets.has(pathname) && pathname !== location.pathname) {
    location.replace(pathname + location.search + location.hash);
  }
})();
