// ======================================================
// KD HERSTACKS / MEMBER DASHBOARD V2
// Read-only dashboard integration
// ======================================================

import { supabase } from "./supabase-client.js";

const $ = (id) => document.getElementById(id);

const VALID_HEROPS_LESSONS = new Set(
  Array.from({ length: 8 }, (_, moduleIndex) =>
    Array.from({ length: 3 }, (_, lessonIndex) =>
      `m${String(moduleIndex + 1).padStart(2, "0")}-l${String(
        lessonIndex + 1
      ).padStart(2, "0")}`
    )
  ).flat()
);

let currentUserId = null;
let refreshVersion = 0;

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = String(value);
}

function setAchievement(id, unlocked) {
  const card = $(id);
  if (!card) return;

  card.classList.toggle("unlocked", unlocked);

  const status = card.querySelector(".md-badge-status");

  if (status) {
    status.textContent = unlocked ? "UNLOCKED ✓" : "LOCKED";
  }
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function resetDashboard() {
  setText("md-herops-count", "— / 24");
  setText("md-herops-status", "Checking your progress...");

  const progress = $("md-herops-progress");
  const fill = $("md-herops-fill");

  if (progress) {
    progress.setAttribute("aria-valuenow", "0");
  }

  if (fill) fill.style.width = "0%";

  for (const status of ["pending", "approved", "rejected"]) {
    setText(`md-${status}`, "—");
  }

  setText("md-xp-history", "Loading XP transactions...");

  setAchievement("md-first-mission", false);
  setAchievement("md-herops-graduate", false);
}

async function loadHerOpsProgress(userId) {
  const { data, error } = await supabase
    .from("herops_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);

  if (error) {
    setText(
      "md-herops-status",
      "Unable to retrieve HerOps progress."
    );

    console.error("HerOps progress:", error.message);
    return;
  }

  const completed = new Set(
    (data || [])
      .map((row) => row.lesson_id)
      .filter((id) => VALID_HEROPS_LESSONS.has(id))
  );

  const count = completed.size;
  const percentage = Math.round((count / 24) * 100);

  setText("md-herops-count", `${count} / 24`);

  const progress = $("md-herops-progress");
  const fill = $("md-herops-fill");

  if (progress) {
    progress.setAttribute(
      "aria-valuenow",
      String(percentage)
    );
  }

  if (fill) {
    fill.style.width = `${percentage}%`;
  }

  setText(
    "md-herops-status",
    count === 24
      ? "COURSE COMPLETED / 100%"
      : `${percentage}% COMPLETE`
  );

  setAchievement("md-herops-graduate", count === 24);
}

async function loadMissionStats(userId) {
  const { data, error } = await supabase
    .from("activity_completions")
    .select("status")
    .eq("user_id", userId);

  if (error) {
    console.error("Mission stats:", error.message);

    for (const status of ["pending", "approved", "rejected"]) {
      setText(`md-${status}`, "—");
    }

    return;
  }

  const submissions = data || [];

  for (const status of ["pending", "approved", "rejected"]) {
    const count = submissions.filter(
      (item) => item.status === status
    ).length;

    setText(`md-${status}`, count);
  }

  const hasApprovedMission = submissions.some(
    (item) => item.status === "approved"
  );

  setAchievement("md-first-mission", hasApprovedMission);
}

function getXpDescription(transaction) {
  const reason = transaction.reason || "";

  if (reason === "HEROPS_COURSE_COMPLETION") {
    return "HerOps Course Completion";
  }

  if (reason === "ACTIVITY_APPROVED") {
    return "Approved Community Mission";
  }

  return reason
    .replace(/_/g, " ")
    .trim() || "XP Reward";
}

async function loadXpHistory(userId) {
  const container = $("md-xp-history");

  if (!container) return;

  const { data, error } = await supabase
    .from("xp_transactions")
    .select("points,reason,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    container.textContent =
      "Unable to load XP history. Check your account permissions.";

    console.error("XP history:", error.message);
    return;
  }

  const transactions = data || [];

  container.replaceChildren();

  if (!transactions.length) {
    container.textContent =
      "No XP transactions yet. Complete a mission to get started.";
    return;
  }

  for (const transaction of transactions) {
    const row = createElement("div", "md-xp-row");

    const details = createElement("div", "md-xp-details");

    details.append(
      createElement(
        "strong",
        "",
        getXpDescription(transaction)
      ),
      createElement(
        "small",
        "",
        formatDate(transaction.created_at)
      )
    );

    const points = Number(transaction.points || 0);

    const amount = createElement(
      "strong",
      "md-xp-amount",
      `${points > 0 ? "+" : ""}${points} XP`
    );

    row.append(details, amount);
    container.append(row);
  }
}

async function refreshDashboard() {
  const version = ++refreshVersion;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    const user = data.user;

    if (!user) {
      currentUserId = null;
      resetDashboard();
      return;
    }

    // Prevent data from a previous account appearing
    // when users switch accounts.
    if (currentUserId !== user.id) {
      resetDashboard();
      currentUserId = user.id;
    }

    const results = await Promise.allSettled([
      loadHerOpsProgress(user.id),
      loadMissionStats(user.id),
      loadXpHistory(user.id)
    ]);

    if (version !== refreshVersion) return;

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Dashboard section failed:",
          result.reason
        );
      }
    });
  } catch (error) {
    console.error("Member dashboard:", error.message);
  }
}

// Refresh after authentication changes.
// The delay avoids calling Supabase APIs inside
// the auth state change callback itself.
supabase.auth.onAuthStateChange(() => {
  setTimeout(refreshDashboard, 0);
});

// Refresh after returning to the account tab.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshDashboard();
  }
});

// Initial load.
refreshDashboard();
