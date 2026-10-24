import { supabase } from "./supabase-client.js";

const $ = (id) => document.getElementById(id);

const state = {
  user: null,
  submissions: [],
  activities: new Map(),
  filter: "pending",
  busy: false
};

function message(text, error = false) {
  const box = $("admin-message");

  box.textContent = text;
  box.classList.toggle("error", error);
  box.hidden = !text;
}

function create(tag, className = "", text = "") {
  const element = document.createElement(tag);

  element.className = className;
  element.textContent = text;

  return element;
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString();
}

function updateStats() {
  for (const status of ["pending", "approved", "rejected"]) {
    const count = state.submissions.filter(
      (item) => item.status === status
    ).length;

    $(`${status}-count`).textContent = count;
  }
}

function render() {
  updateStats();

  const list = $("admin-submissions");
  list.replaceChildren();

  const items = state.submissions.filter(
    (item) =>
      state.filter === "all" ||
      item.status === state.filter
  );

  if (!items.length) {
    list.append(
      create(
        "div",
        "hs-admin-empty",
        "No submissions found for this filter."
      )
    );

    return;
  }

  for (const item of items) {
    const activity = state.activities.get(item.activity_id);

    const card = create("article", "hs-admin-card");

    const top = create("div", "hs-admin-card-top");

    top.append(
      create(
        "span",
        "hs-admin-label",
        item.status.toUpperCase()
      ),
      create(
        "span",
        "hs-admin-xp",
        `+${activity?.xp_reward ?? 0} XP`
      )
    );

    card.append(top);

    card.append(
      create(
        "h3",
        "",
        activity?.title || "Unknown activity"
      )
    );

    const details = create("div", "hs-admin-details");

    details.append(
      create("p", "", `MEMBER ID: ${item.user_id}`),
      create("p", "", `SUBMITTED: ${formatDate(item.submitted_at)}`),
      create("p", "", `STATUS: ${item.status}`)
    );

    card.append(details);

    card.append(
      create("div", "hs-admin-label", "MEMBER SUBMISSION")
    );

    card.append(
      create(
        "pre",
        "hs-admin-submission",
        item.submission || "No submission text provided."
      )
    );

    if (item.status === "pending") {
      const actions = create("div", "hs-admin-actions");

      const approve = create(
        "button",
        "btn",
        `APPROVE +${activity?.xp_reward ?? 0} XP`
      );

      approve.type = "button";

      approve.addEventListener("click", () => {
        review(item, "approved");
      });

      const reject = create(
        "button",
        "btn secondary",
        "REJECT"
      );

      reject.type = "button";

      reject.addEventListener("click", () => {
        review(item, "rejected");
      });

      actions.append(approve, reject);
      card.append(actions);
    }

    list.append(card);
  }
}

async function checkAdmin() {
  message("Checking administrator access...");

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    message(
      "Please sign in to your HerStacks member account first.",
      true
    );

    return false;
  }

  state.user = user;

  const { data, error } = await supabase.rpc(
    "is_herstacks_admin"
  );

  if (error) {
    message(
      `Administrator verification failed: ${error.message}`,
      true
    );

    return false;
  }

  if (data !== true) {
    message(
      "ACCESS DENIED // This account does not have administrator permissions.",
      true
    );

    return false;
  }

  $("admin-dashboard").hidden = false;

  message("");

  return true;
}

async function loadSubmissions() {
  message("Loading submissions...");

  try {
    const [submissionsResult, activitiesResult] =
      await Promise.all([
        supabase
          .from("activity_completions")
          .select(
            "id,activity_id,user_id,submission,status,submitted_at,reviewed_at"
          )
          .order("submitted_at", { ascending: false }),

        supabase
          .from("activities")
          .select("id,title,xp_reward")
      ]);

    if (submissionsResult.error) {
      throw submissionsResult.error;
    }

    if (activitiesResult.error) {
      throw activitiesResult.error;
    }

    state.submissions = submissionsResult.data || [];

    state.activities = new Map(
      (activitiesResult.data || []).map(
        (activity) => [activity.id, activity]
      )
    );

    render();
    message("");
  } catch (error) {
    message(
      `Unable to load submissions: ${error.message}`,
      true
    );
  }
}

async function review(item, decision) {
  if (state.busy) return;

  const activity = state.activities.get(item.activity_id);

  const question =
    decision === "approved"
      ? `Approve "${activity?.title || "this mission"}" and award ${activity?.xp_reward ?? 0} XP?`
      : "Reject this submission?";

  if (!window.confirm(question)) return;

  state.busy = true;

  document
    .querySelectorAll(".hs-admin-actions button")
    .forEach((button) => {
      button.disabled = true;
    });

  message("Processing submission...");

  try {
    const { data, error } = await supabase.rpc(
      "review_herstacks_submission",
      {
        p_completion_id: item.id,
        p_decision: decision
      }
    );

    if (error) throw error;

    await loadSubmissions();

    message(
      decision === "approved"
        ? `Submission approved. ${data?.xp_awarded ?? 0} XP awarded.`
        : "Submission rejected."
    );
  } catch (error) {
    message(
      `Review failed: ${error.message}`,
      true
    );

    render();
  } finally {
    state.busy = false;
  }
}

document.querySelectorAll("[data-status]").forEach(
  (button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.status;

      document
        .querySelectorAll("[data-status]")
        .forEach((item) => {
          item.classList.toggle(
            "active",
            item === button
          );
        });

      render();
    });
  }
);

$("refresh-submissions").addEventListener(
  "click",
  loadSubmissions
);

async function initialize() {
  try {
    const allowed = await checkAdmin();

    if (allowed) {
      await loadSubmissions();
    }
  } catch (error) {
    message(
      `Initialization failed: ${error.message}`,
      true
    );
  }
}

initialize();
