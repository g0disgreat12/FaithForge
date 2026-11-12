(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = byId('main-navigation');
  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰ Menu';
  }
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕ Close' : '☰ Menu';
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu(); menuButton.focus();
    }
  });

  byId('footerYear').textContent = String(new Date().getFullYear());

  // A subtle nod to the forge, paused offscreen and disabled for reduced motion.
  const canvas = byId('embers');
  const context = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!context) return;
  let width = 0, height = 0, frame = 0, previous = 0;
  const particles = Array.from({ length: 22 }, () => ({ x: Math.random(), y: Math.random(), size: .5 + Math.random() * 1.3, speed: .000015 + Math.random() * .00002 }));
  function resize() {
    width = innerWidth; height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale; canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }
  function animate(time) {
    if (document.hidden || reducedMotion.matches) { frame = 0; return; }
    if (time - previous > 40) {
      const delta = Math.min(time - previous, 80); previous = time;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#e3b341';
      for (const particle of particles) {
        particle.y -= particle.speed * delta;
        if (particle.y < 0) { particle.y = 1; particle.x = Math.random(); }
        context.globalAlpha = .15 + particle.size / 7;
        context.beginPath(); context.arc(particle.x * width, particle.y * height, particle.size, 0, Math.PI * 2); context.fill();
      }
    }
    frame = requestAnimationFrame(animate);
  }
  function resume() {
    if (document.hidden || reducedMotion.matches) {
      cancelAnimationFrame(frame); frame = 0; context.clearRect(0, 0, width, height);
    } else if (!frame) { previous = performance.now(); frame = requestAnimationFrame(animate); }
  }
  resize(); resume();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', resume);
})();
