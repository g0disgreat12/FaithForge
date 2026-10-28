document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MOBILE MENU TOGGLE
  ========================= */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu-links');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================
     HERO / SLIDESHOW LOGIC
  ========================= */
  const slides = document.getElementsByClassName("slide");
  if (slides.length === 0) return;

  let slideIndex = Math.floor(Math.random() * slides.length);

  function showSlides() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block";

    setTimeout(showSlides, 10000); // 10 seconds
  }

  // Optional manual controls
  window.plusSlides = function(n) {
    slideIndex += n - 1;
    showSlides();
  };

  showSlides();
});
