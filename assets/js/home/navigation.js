const navToggle =
    document.getElementById("navToggle");

  const siteNav =
    document.getElementById("siteNav");

  navToggle.addEventListener("click", () => {
    const isOpen =
      siteNav.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    navToggle.textContent =
      isOpen ? "✕" : "☰";
  });

  siteNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      navToggle.textContent = "☰";
    });
  });
