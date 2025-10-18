<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FaithForge Gaming</title>

  <!-- SEO and Social -->
  <meta name="title" content="FaithForge Gaming - Christian Gaming Community">
  <meta name="description" content="A Christian gaming community where like-minded players connect, grow, and share faith and fun.">
  <meta property="og:title" content="FaithForge Gaming">
  <meta property="og:description" content="Join our Christian gaming community—connect, grow, and share faith and fun.">
  <meta property="og:image" content="https://faithforgegaming.com/95998504-25E9-46FD-8CA4-FF4784EEF961.png">
  <meta property="og:url" content="https://faithforgegaming.com">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="favicon.png">

  <style>
    /* === FAITHFORGE EPIC STYLING === */
    body {
      background: radial-gradient(circle at center, #0d0d0d 40%, #000 100%);
      color: #f5c518;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
      overflow-x: hidden;
      min-height: 100vh;
      position: relative;
    }

    /* Pulsing forge glow */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(circle at 50% 50%, rgba(245,197,24,0.08) 0%, rgba(0,0,0,0) 70%);
      animation: pulse 6s ease-in-out infinite alternate;
      z-index: -3;
    }
    @keyframes pulse {
      0% { opacity: 0.08; transform: scale(1); }
      100% { opacity: 0.2; transform: scale(1.2); }
    }

    /* Centered glowing emblem watermark */
    .emblem {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 600px;
      max-width: 90vw;
      opacity: 0.05;
      transform: translate(-50%, -50%) scale(1);
      filter: drop-shadow(0 0 40px rgba(245,197,24,0.5));
      animation: emblemGlow 8s ease-in-out infinite alternate;
      z-index: -2;
      pointer-events: none;
    }

    @keyframes emblemGlow {
      from { opacity: 0.04; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0.1; transform: translate(-50%, -50%) scale(1.05); }
    }

    /* Ember layer */
    #embers {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    header {
      padding: 20px;
    }
    img {
      width: 300px;
      max-width: 90%;
      margin-top: 10px;
      filter: drop-shadow(0 0 20px rgba(245,197,24,0.3));
      animation: fadeIn 1.5s ease;
    }
    h1 {
      font-size: 3em;
      margin: 20px 0 10px;
      background: linear-gradient(90deg, #f5c518, #cfa214);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(245,197,24,0.3);
    }
    p {
      font-size: 1.2em;
      margin: 10px 20px;
    }

    /* Discord Hero Button */
    .hero-discord {
      display: inline-block;
      margin-top: 20px;
      padding: 18px 45px;
      font-size: 1.4em;
      font-weight: bold;
      text-transform: uppercase;
      background: linear-gradient(90deg, #5865F2, #4752C4);
      color: #fff;
      border: none;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 0 25px rgba(88,101,242,0.6);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .hero-discord:hover {
      transform: scale(1.05);
      box-shadow: 0 0 40px rgba(88,101,242,0.9);
    }

    /* Link Grid */
    .links {
      margin: 40px auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      grid-gap: 15px;
      max-width: 700px;
      padding: 0 20px;
    }
    .links a {
      display: block;
      background-color: #f5c518;
      color: #0d0d0d;
      padding: 15px 10px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 8px;
      transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 0 15px rgba(245,197,24,0.2);
    }
    .links a:hover {
      background-color: #cfa214;
      transform: translateY(-3px);
      box-shadow: 0 0 30px rgba(245,197,24,0.6);
    }

    .contact {
      margin: 20px auto;
      font-size: 1em;
    }
    .contact a {
      color: #f5c518;
      text-decoration: underline;
    }

    .bible-verse {
      margin: 40px 20px;
      font-style: italic;
      font-size: 1em;
      color: #f5c518;
    }

    footer {
      margin-top: 50px;
      font-size: 0.9em;
      color: #888;
      padding-bottom: 20px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <!-- Emblem Watermark -->
  <img class="emblem" src="95998504-25E9-46FD-8CA4-FF4784EEF961.png" alt="FaithForge Emblem Watermark">

  <!-- Ember Canvas -->
  <canvas id="embers"></canvas>

  <header>
    <img src="95998504-25E9-46FD-8CA4-FF4784EEF961.png" alt="FaithForge Gaming Logo">
    <h1>FaithForge Gaming</h1>
    <p>Our mission is to bring like-minded gamers together.</p>
    <p>Our vision is to create a community where gamers can connect, grow, and share.</p>

    <!-- Hero Discord Button -->
    <a class="hero-discord" href="https://discord.gg/bAQrudk5a9" target="_blank">Join Our Discord</a>
  </header>

  <!-- Links -->
  <div class="links">
    <a href="https://www.facebook.com/groups/1401655227543697/" target="_blank">Facebook Group</a>
    <a href="https://www.instagram.com/faithforgegaming?igsh=dTBjZzUyaXZ6N2Nx&utm_source=qr" target="_blank">Instagram</a>
    <a href="https://www.reddit.com/r/FaithForgeGaming/" target="_blank">Reddit</a>
    <a href="https://www.youtube.com/@FaithForgeGaming" target="_blank">YouTube</a>
    <a href="https://www.twitch.tv/g0disgreat12" target="_blank">Twitch</a>
    <a href="https://ko-fi.com/faithforgegaming" target="_blank">Support on Ko-fi</a>
  </div>

  <div class="contact">
    <p>📧 <a href="mailto:FaithForgegaming@gmail.com">FaithForgeGaming@gmail.com</a></p>
  </div>

  <div class="bible-verse">
    <p>"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17 (NIV)</p>
  </div>

  <footer>
    &copy; 2025 FaithForge Gaming. All rights reserved.
  </footer>

  <!-- Ember Animation Script -->
  <script>
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
  </script>

</body>
</html>
