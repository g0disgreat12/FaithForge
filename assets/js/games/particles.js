const c = document.getElementById('particles');
    const x = c.getContext('2d');

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function spawn() {
      particles.push({
        x: Math.random() * c.width,
        y: c.height + 5,
        s: Math.random() * 2 + 1,
        o: Math.random() * 0.35 + 0.25,
        v: Math.random() * 1.5 + 0.8
      });
    }

    function draw() {
      x.clearRect(0, 0, c.width, c.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        x.fillStyle = `rgba(245, 197, 24, ${p.o})`;
        x.beginPath();
        x.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        x.fill();

        p.y -= p.v;
        p.o -= 0.0025;

        if (p.o <= 0) {
          particles.splice(i, 1);
        }
      }

      if (Math.random() < (window.innerWidth < 768 ? 0.13 : 0.28)) {
        spawn();
      }

      requestAnimationFrame(draw);
    }

    if (!prefersReducedMotion) {
      draw();
    }
