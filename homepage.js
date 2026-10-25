/**
 * KD HERSTACKS
 * Corporate Homepage Interactions
 */

(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // ==========================================
  // HEADER SCROLL STATE
  // ==========================================

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 24
    );
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  function closeMenu() {
    if (!menuButton || !mobileNav) return;

    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");

    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuButton || !mobileNav) return;

    mobileNav.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation");

    document.body.classList.add("menu-open");
  }

  if (menuButton && mobileNav) {

    menuButton.addEventListener("click", () => {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (mobileNav.hidden) return;

      if (
        !mobileNav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });

  }

  // ==========================================
  // SCROLL REVEAL
  // ==========================================

  const revealElements = document.querySelectorAll(
    "[data-reveal]"
  );

  if (
    prefersReducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {

    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

  } else {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  }

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

})();
