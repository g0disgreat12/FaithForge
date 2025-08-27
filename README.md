<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FaithForge Gaming</title>
  <style>
    /* Background Animation */
    body {
      background-color: #0d0d0d;
      color: #f5c518;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
      overflow-x: hidden;
      position: relative;
      min-height: 100vh;
    }

    /* Floating particles background */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: url('https://cdn.pixabay.com/photo/2020/01/07/14/55/bokeh-4741745_1280.png') repeat;
      opacity: 0.12;   /* make it more visible */
      animation: float 60s linear infinite;
      z-index: -1;
    }

    @keyframes float {
      from { background-position: 0 0; }
      to { background-position: 5000px 2500px; }
    }

    header {
      padding: 20px;
    }
    img {
      width: 300px;
      max-width: 90%;
      margin-top: 20px;
    }
    h1 {
      font-size: 3em;
      margin: 20px 0 10px;
    }
    p {
      font-size: 1.2em;
      margin: 10px 20px;
    }

    /* Grid Links */
    .links {
      margin: 40px auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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
      transition: background-color 0.3s, transform 0.3s;
    }
    .links a:hover {
      background-color: #c9a416;
      transform: scale(1.05);
    }

    .bible-verse {
      margin: 30px 20px;
      font-style: italic;
      font-size: 1em;
    }
    footer {
      margin-top: 50px;
      font-size: 0.9em;
      color: #888;
      padding-bottom: 20px;
    }

    /* Smooth scroll */
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body>

  <header>
    <img src="95998504-25E9-46FD-8CA4-FF4784EEF961.png" alt="FaithForge Gaming Logo">
    <h1>FaithForge Gaming</h1>
    <p>Our mission is to bring like-minded gamers together.</p>
    <p>Our vision is to create a community where gamers can connect, grow, and share.</p>
  </header>

  <div class="links">
    <a href="https://www.facebook.com/groups/1401655227543697/" target="_blank">Facebook Group</a>
    <a href="https://discord.gg/jnWSgXb66B" target="_blank">Discord</a>
    <a href="https://www.reddit.com/r/FaithForgeGaming/" target="_blank">Reddit</a>
    <a href="https://www.youtube.com/@FaithForgeGaming" target="_blank">YouTube</a>
    <a href="https://www.twitch.tv/g0disgreat12" target="_blank">Twitch</a>
    <a 
href="https://ko-fi.com/faithforgegaming" target="_blank">Support on Ko-fi</a>
  </div>

  <div class="bible-verse">
    <p>"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17 (NIV)</p>
  </div>

  <footer>
    &copy; 2025 FaithForge Gaming. All rights reserved.
  </footer>

</body>
</html>
