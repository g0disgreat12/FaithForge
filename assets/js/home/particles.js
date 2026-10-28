const particleCanvas =
    document.getElementById("particles");

  const particleContext =
    particleCanvas.getContext("2d");

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  let particles = [];
  let particleAnimationId = null;
  let animationRunning = false;

  function resizeParticles() {
    particleCanvas.width =
      window.innerWidth;

    particleCanvas.height =
      window.innerHeight;
  }

  function spawnParticle() {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: particleCanvas.height,
      size: Math.random() * 2 + 1,
      opacity: 0.7
    });
  }

  function drawParticles() {
    if (!animationRunning) {
      return;
    }

    particleContext.clearRect(
      0,
      0,
      particleCanvas.width,
      particleCanvas.height
    );

    const mobile =
      window.innerWidth < 768;

    const spawnRate =
      mobile ? 0.12 : 0.34;

    const speed =
      mobile ? 1.35 : 2.2;

    particles =
      particles.filter(particle => {
        particleContext.fillStyle =
          `rgba(245,197,24,${particle.opacity})`;

        particleContext.beginPath();

        particleContext.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        particleContext.fill();

        particle.y -=
          speed;

        particle.opacity -=
          0.004;

        return particle.opacity > 0;
      });

    if (Math.random() < spawnRate) {
      spawnParticle();
    }

    particleAnimationId =
      requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (
      prefersReducedMotion ||
      animationRunning
    ) {
      return;
    }

    animationRunning =
      true;

    drawParticles();
  }

  function stopParticles() {
    animationRunning =
      false;

    if (particleAnimationId) {
      cancelAnimationFrame(
        particleAnimationId
      );
    }
  }

  window.addEventListener(
    "resize",
    resizeParticles
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopParticles();
      } else {
        startParticles();
      }
    }
  );

  resizeParticles();
  startParticles();
