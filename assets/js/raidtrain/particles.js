/* PARTICLES */
const c = document.getElementById("particles");
const x = c.getContext("2d");

function resizeParticles() {
  c.width = innerWidth;
  c.height = innerHeight;
}

window.addEventListener("resize", resizeParticles);
resizeParticles();

let parts = [];

function spawnParticle() {
  parts.push({
    x: Math.random() * c.width,
    y: c.height,
    s: Math.random() * 2 + 1,
    o: 0.7
  });
}

const isMobile = window.innerWidth < 768;
const spawnRate = isMobile ? 0.15 : 0.4;
const speed = isMobile ? 1.5 : 2.5;

function drawParticles() {
  x.clearRect(0, 0, c.width, c.height);

  parts.forEach((p, i) => {
    x.fillStyle = `rgba(245,197,24,${p.o})`;
    x.beginPath();
    x.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    x.fill();

    p.y -= speed;
    p.o -= 0.004;

    if (p.o <= 0) parts.splice(i, 1);
  });

  if (Math.random() < spawnRate) spawnParticle();

  requestAnimationFrame(drawParticles);
}

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  drawParticles();
}
