
(function () {
  "use strict";

  // ==========================================
  // HERSTACKS // PRELOADER
  // ==========================================

  const pre = document.getElementById("preloader");
  const bar = document.getElementById("loaderBar");
  const pct = document.getElementById("pct");
  const textPct = document.getElementById("loaderBarText");
  const state = document.getElementById("loaderState");

  let n = 0;

  const states = [
    ["BOOT SEQUENCE", 0],
    ["LOADING UI", 25],
    ["MOUNTING COMMUNITY", 55],
    ["CHECKING GUILDS", 78],
    ["SYSTEM READY", 100]
  ];

  function updateLoader() {
    if (bar) bar.style.width = n + "%";
    if (pct) pct.textContent = n + "%";
    if (textPct) textPct.textContent = n + "%";

    let currentState = states[0][0];

    for (const item of states) {
      if (n >= item[1]) currentState = item[0];
    }

    if (state) state.textContent = currentState;
  }

  function finishLoader() {
    n = 100;
    updateLoader();

    if (pre) {
      setTimeout(() => pre.classList.add("done"), 420);
    }
  }

  function tick() {
    n = Math.min(100, n + (n < 70 ? 2 : 1));
    updateLoader();

    if (n < 100) {
      setTimeout(tick, 32);
    } else {
      finishLoader();
    }
  }

  if (pre) {
    if (document.readyState === "complete") {
      setTimeout(tick, 180);
    } else {
      window.addEventListener(
        "load",
        () => setTimeout(tick, 180),
        { once: true }
      );
    }

    // Prevent the preloader from getting stuck.
    setTimeout(finishLoader, 5000);
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav-links");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");

      document.body.classList.toggle("menu-open", open);
      menu.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ==========================================
  // SCROLL REVEAL
  // ==========================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // ==========================================
  // HERSTACKS // TERMINAL
  // ==========================================

  const terminalOutput =
    document.getElementById("terminalOutput");

  const terminalInput =
    document.getElementById("terminalInput");

  const terminalRun =
    document.getElementById("terminalRun");

  const terminalQuick =
    document.querySelectorAll("[data-command]");

  const commands = {
    help: {
      type: "info",
      text: [
        "AVAILABLE COMMANDS",
        "  help        show available commands",
        "  about       HerStacks community overview",
        "  guild       open HerStacks guild",
        "  herops      open HerOps cybersecurity guild",
        "  activities  open activities dashboard",
        "  account     open member account page",
        "  contact     community contact options",
        "  status      show community status",
        "  home        return to top",
        "  clear       clear terminal output"
      ]
    },

    about: {
      type: "success",
      text: [
        "HERSTACKS // ABOUT",
        "A women-focused technology community.",
        "Learn, build, connect and grow together."
      ],
      target: "#about"
    },

    guild: {
      type: "success",
      text: [
        "HERSTACKS // GUILD",
        "Opening the official HerStacks guild..."
      ],
      url: "https://krackeddevs.com/guilds/krackeddev-herstacks"
    },

    herops: {
      type: "success",
      text: [
        "HEROPS // CYBERSECURITY",
        "Explore cybersecurity learning and labs.",
        "Opening the HerOps guild..."
      ],
      url: "https://krackeddevs.com/guilds/krackeddev-herops"
    },

    activities: {
      type: "success",
      text: [
        "HERSTACKS // ACTIVITIES",
        "Opening the community activities dashboard..."
      ],
      page: "activities.html"
    },

    account: {
      type: "success",
      text: [
        "HERSTACKS // ACCOUNT",
        "Opening the member account dashboard..."
      ],
      page: "account.html"
    },

    contact: {
      type: "info",
      text: [
        "CONTACT // HERSTACKS",
        "Connect with us through the official HerStacks guild.",
        "Opening the community page..."
      ],
      url: "https://krackeddevs.com/guilds/krackeddev-herstacks"
    },

    status: {
      type: "success",
      text: [
        "COMMUNITY STATUS",
        "HERSTACKS ........ ACTIVE",
        "HEROPS ........... ACTIVE",
        "WHATSAPP COMMUNITY AVAILABLE",
        "ACTIVITIES ........ VIEW DASHBOARD",
        "MEMBER ACCOUNT .... AVAILABLE"
      ]
    },

    home: {
      type: "info",
      text: [
        "HOME",
        "Returning to the homepage..."
      ],
      target: "#top"
    },

    clear: {
      type: "clear",
      text: []
    }
  };

  function terminalWrite(lines, type = "info") {
    if (!terminalOutput) return;

    lines.forEach((line) => {
      const element = document.createElement("div");

      element.className = "terminal-line " + type;
      element.textContent = line;

      terminalOutput.appendChild(element);
    });

    terminalOutput.scrollTop =
      terminalOutput.scrollHeight;
  }

  function terminalCommand(raw) {
    if (!terminalOutput) return;

    const cmd = String(raw || "")
      .trim()
      .toLowerCase();

    if (!cmd) return;

    const prompt = document.createElement("div");

    prompt.className = "terminal-line command";
    prompt.textContent = "guest@herstacks:~$ " + cmd;

    terminalOutput.appendChild(prompt);

    const item = commands[cmd];

    if (!item) {
      terminalWrite(
        [
          "COMMAND NOT FOUND: " + cmd,
          'Type "help" for available commands.'
        ],
        "error"
      );
      return;
    }

    if (item.type === "clear") {
      terminalOutput.innerHTML = "";
      return;
    }

    terminalWrite(item.text, item.type);

    if (item.target) {
      setTimeout(() => {
        document
          .querySelector(item.target)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      }, 120);
    }

    if (item.url) {
      setTimeout(() => {
        window.open(item.url, "_blank", "noopener");
      }, 250);
    }

    if (item.page) {
      setTimeout(() => {
        window.location.href = item.page;
      }, 250);
    }
  }

  // ==========================================
  // TERMINAL INITIALIZATION
  // ==========================================

  if (terminalOutput) {
    terminalWrite(
      [
        "HERSTACKS TERMINAL v2.0",
        "Community console initialized.",
        'Type "help" to list available commands.'
      ],
      "success"
    );

    if (terminalInput) {
      terminalInput.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter") {
            terminalCommand(terminalInput.value);
            terminalInput.value = "";
          }
        }
      );
    }

    if (terminalRun) {
      terminalRun.addEventListener("click", () => {
        terminalCommand(terminalInput?.value);

        if (terminalInput) {
          terminalInput.value = "";
          terminalInput.focus();
        }
      });
    }

    terminalQuick.forEach((button) => {
      button.addEventListener("click", () => {
        terminalCommand(button.dataset.command);
      });
    });
  }
})();
