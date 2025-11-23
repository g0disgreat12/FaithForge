const canvas = document.getElementById('embers');
const ctx = canvas.getContext('2d');
let embers = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function createEmber() {
  const x = Math.random() * canvas.width;
  const y = canvas.height + 10;
  const size = Math.random() * 2 + 1;
  const speed = Math.random() * 1.5 + 0.5;
  const opacity = Math.random() * 0.5 + 0.2;
  embers.push({ x, y, size, speed, opacity });
}

function drawEmbers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < embers.length; i++) {
    const e = embers[i];
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,197,24,${e.opacity})`;
    ctx.fill();
    e.y -= e.speed;
    e.x += Math.sin(e.y * 0.02) * 0.5;
    e.opacity -= 0.002;
    if (e.opacity <= 0) embers.splice(i, 1);
  }
}

function animate() {
  drawEmbers();
  if (Math.random() < 0.3) createEmber();
  requestAnimationFrame(animate);
}
animate();
