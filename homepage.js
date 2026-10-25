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
// ============================================
// HERSTACKS / LIVE REGISTERED MEMBER COUNTER
// ============================================

import { supabase } from "./supabase-client.js";

async function loadMemberCount() {
  const counter = document.getElementById("member-count");
  const status = document.getElementById("member-count-status");

  if (!counter) return;

  try {
    const { data, error } = await supabase.rpc(
      "get_herstacks_member_count"
    );

    if (error) {
      throw error;
    }

    const total = Number(data);

    if (!Number.isSafeInteger(total) || total < 0) {
      throw new Error("Invalid member count returned.");
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || total === 0) {
      counter.textContent = total.toLocaleString("en-MY");
    } else {
      animateMemberCount(counter, total);
    }

    if (status) {
      status.textContent = "REGISTERED ACCOUNTS / VERIFIED DATABASE";
    }

  } catch (error) {
    console.error("Member counter error:", error);

    counter.textContent = "—";

    if (status) {
      status.textContent = "MEMBER DATA TEMPORARILY UNAVAILABLE";
    }

  } finally {
    counter.setAttribute("aria-busy", "false");
  }
}

function animateMemberCount(element, target) {
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const progress = Math.min(
      (now - start) / duration,
      1
    );

    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    element.textContent = current.toLocaleString("en-MY");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

loadMemberCount();
