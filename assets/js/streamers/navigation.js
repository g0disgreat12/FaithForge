document.addEventListener('DOMContentLoaded', () => {
      const toggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('.menu-links');

      if (!toggle || !menu) return;

      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
