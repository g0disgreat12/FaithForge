/* Progressive enhancement only. Core content, roles, FAQs, and links work without JS. */
(() => {
  "use strict";

  const root = document.documentElement;
  const menuButton = document.querySelector(".cp-menu-toggle");
  const navigation = document.getElementById("partnershipNav");
  const compactNavigation = window.matchMedia("(max-width: 1160px)");

  if (menuButton && navigation) {
    const setMenuOpen = (open, restoreFocus = false) => {
      navigation.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (restoreFocus) menuButton.focus();
    };

    const updateMenu = () => {
      menuButton.hidden = !compactNavigation.matches;
      setMenuOpen(false);
    };

    root.classList.add("cp-js");
    updateMenu();
    menuButton.addEventListener("click", () => setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a") && compactNavigation.matches) setMenuOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenuOpen(false, true);
    });
    compactNavigation.addEventListener("change", updateMenu);
  }

  // Highlight the section nearest the top while keeping anchor links fully native.
  const sectionLinks = [...document.querySelectorAll(".cp-section-links a")];
  const sections = sectionLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!sections.length) return;

  const markCurrentSection = () => {
    const activationLine = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 80) + 4;
    const active = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= activationLine);
    sectionLinks.forEach((link) => {
      if (active && link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  let updateQueued = false;
  const queueSectionUpdate = () => {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(() => {
      updateQueued = false;
      markCurrentSection();
    });
  };
  window.addEventListener("scroll", queueSectionUpdate, { passive: true });
  window.addEventListener("resize", queueSectionUpdate);
  window.addEventListener("hashchange", queueSectionUpdate);
  markCurrentSection();
})();
