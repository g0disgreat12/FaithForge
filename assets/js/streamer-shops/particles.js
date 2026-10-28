const canvas = document.getElementById("embers");
    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const embers = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnEmber() {
      embers.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        radius: Math.random() * 2.2 + 0.7,
        opacity: Math.random() * 0.38 + 0.18,
        velocity: Math.random() * 1.45 + 0.55,
        drift: (Math.random() - 0.5) * 0.55
      });
    }

    function drawEmbers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = embers.length - 1; i >= 0; i--) {
        const ember = embers[i];
        ctx.fillStyle = `rgba(245, 197, 24, ${ember.opacity})`;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx.fill();

        ember.y -= ember.velocity;
        ember.x += ember.drift;
        ember.opacity -= 0.0022;

        if (ember.opacity <= 0 || ember.y < -20) {
          embers.splice(i, 1);
        }
      }

      const spawnRate = window.innerWidth < 768 ? 0.11 : 0.24;
      if (Math.random() < spawnRate) spawnEmber();

      requestAnimationFrame(drawEmbers);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    if (!prefersReducedMotion) {
      drawEmbers();
    }
