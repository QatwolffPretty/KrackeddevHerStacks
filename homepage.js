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
  // Two counters sharing one Supabase RPC request.
  const counters = [
    document.getElementById("member-count"),
    document.getElementById("hero-member-count")
  ].filter(Boolean);

  const statuses = [
    document.getElementById("member-count-status"),
    document.getElementById("hero-member-count-status")
  ].filter(Boolean);

  if (!counters.length) return;

  counters.forEach((counter) => {
    counter.setAttribute("aria-busy", "true");
  });

  try {
    const { data, error } = await supabase.rpc(
      "get_herstacks_member_count"
    );

    if (error) {
      throw error;
    }

    const total = Number(data);

    if (!Number.isSafeInteger(total) || total < 0) {
      throw new Error(
        "Invalid member count returned."
      );
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    counters.forEach((counter) => {
      if (reducedMotion || total === 0) {
        counter.textContent =
          total.toLocaleString("en-MY");
      } else {
        animateMemberCount(counter, total);
      }
    });

    statuses.forEach((status) => {
      status.textContent =
        "REGISTERED ACCOUNTS / LIVE DATABASE";
    });

  } catch (error) {
    console.error(
      "HerStacks member counter error:",
      error
    );

    counters.forEach((counter) => {
      counter.textContent = "—";
    });

    statuses.forEach((status) => {
      status.textContent =
        "MEMBER DATA TEMPORARILY UNAVAILABLE";
    });

  } finally {
    counters.forEach((counter) => {
      counter.setAttribute("aria-busy", "false");
    });
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

/* ==========================================
   HERSTACKS / LIVE MALAYSIA STATE NETWORK
   Privacy-safe aggregated statistics
========================================== */

async function loadStateNetwork() {
  const overlay = document.querySelector(
    '.malaysia-network-overlay'
  );

  const caption = document.querySelector(
    '.malaysia-hero-visual .visual-caption'
  );

  if (!overlay || !caption) return;

  // Hide old decorative dots.
  // Only verified state-based markers may appear.
  overlay.hidden = true;
  overlay.style.display = 'none';

  caption.textContent =
    'CHECKING COMMUNITY STATE NETWORK...';

  try {
    const { data, error } = await supabase.rpc(
      'get_herstacks_state_distribution'
    );

    if (error) throw error;

    if (!Array.isArray(data)) {
      throw new Error(
        'Invalid state distribution response.'
      );
    }

    // The database already filters for
    // opted-in states with 3+ members.
    const states = data.filter((row) => {
      return (
        typeof row.state_code === 'string' &&
        Number.isSafeInteger(Number(row.member_count)) &&
        Number(row.member_count) >= 3
      );
    });

    if (states.length === 0) {
      caption.textContent =
        'NO PUBLIC STATE SIGNALS YET / ' +
        'MINIMUM 3 OPTED-IN MEMBERS PER STATE';

      return;
    }

    // Store validated state codes for the
    // geographic marker rendering step.
    overlay.dataset.activeStates = states
      .map((row) => row.state_code)
      .join(',');

    caption.textContent =
      `STATE NETWORK DATA READY / ` +
      `${states.length} ELIGIBLE STATE(S)`;

  } catch (error) {
    console.error(
      'HerStacks state network error:',
      error
    );

    caption.textContent =
      'STATE NETWORK DATA TEMPORARILY UNAVAILABLE';
  }
}

loadStateNetwork();

/* ==========================================
   HERSTACKS / REAL STATE MARKERS
   Coordinates derived from original SVG
   viewBox: 0 0 915 400
========================================== */

const HERSTACKS_STATE_POINTS = {
  JOHOR: [228.2, 317.1],
  KEDAH: [55.7, 102.8],
  KELANTAN: [149.1, 125.5],
  MELAKA: [165.6, 303.5],
  NEGERI_SEMBILAN: [161.0, 272.4],
  PAHANG: [193.6, 228.1],
  PERAK: [95.0, 160.8],
  PERLIS: [49.0, 63.9],
  PULAU_PINANG: [55.6, 129.2],
  SABAH: [788.7, 105.9],
  SARAWAK: [519.1, 268.4],
  SELANGOR: [113.9, 250.1],
  TERENGGANU: [202.7, 156.5],
  KUALA_LUMPUR: [131.3, 255.7],
  LABUAN: [668.2, 130.6],
  PUTRAJAYA: [131.7, 267.1]
};

function renderEligibleStateMarkers(overlay, states) {
  const namespace = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(
    namespace,
    'svg'
  );

  svg.setAttribute('viewBox', '0 0 915 400');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'malaysia-live-markers');
  svg.setAttribute('aria-hidden', 'true');

  let rendered = 0;

  for (const state of states) {
    if (
      !Object.prototype.hasOwnProperty.call(
        HERSTACKS_STATE_POINTS,
        state.state_code
      )
    ) {
      continue;
    }

    const [x, y] =
      HERSTACKS_STATE_POINTS[state.state_code];

    const group = document.createElementNS(
      namespace,
      'g'
    );

    const pulse = document.createElementNS(
      namespace,
      'circle'
    );

    pulse.setAttribute('cx', String(x));
    pulse.setAttribute('cy', String(y));
    pulse.setAttribute('r', '13');
    pulse.setAttribute('class', 'malaysia-live-ring');

    pulse.style.animationDelay =
      `${rendered * -0.45}s`;

    const dot = document.createElementNS(
      namespace,
      'circle'
    );

    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    dot.setAttribute('r', '7');
    dot.setAttribute('class', 'malaysia-live-dot');

    group.append(pulse, dot);
    svg.append(group);

    rendered++;
  }

  overlay.replaceChildren();

  if (rendered > 0) {
    overlay.append(svg);
    overlay.hidden = false;
    overlay.style.removeProperty('display');
  }

  return rendered;
}
