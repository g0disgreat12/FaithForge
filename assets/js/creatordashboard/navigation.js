document.addEventListener("DOMContentLoaded", function () {
      var toggle = document.querySelector(".menu-toggle");
      var menu = document.querySelector(".menu-links");

      if (!toggle || !menu) return;

      toggle.addEventListener("click", function () {
        var isOpen = menu.classList.toggle("show");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          menu.classList.remove("show");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    });
