/* =========================================================
   VEKT
   Supabase + ekte lagring + PWA + push
========================================================= */

/* ================================= */
/* SUPABASE */
/* ================================= */

const SUPABASE_URL =
  "https://urybvlcwjvbtjgchyajp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-5dzD_N1UmdVOuqOTkrsnA_pJyw7OxE";

const SITE_URL =
  "https://mariussp415.github.io/Vekt-app/";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

/* ================================= */
/* VIEWS */
/* ================================= */

const loadingView =
  document.getElementById("loadingView");

const authView =
  document.getElementById("authView");

const weighInView =
  document.getElementById("weighInView");

const dashboardView =
  document.getElementById("dashboardView");

/* ================================= */
/* AUTH */
/* ================================= */

const authEmail =
  document.getElementById("authEmail");

const authPassword =
  document.getElementById("authPassword");

const loginBtn =
  document.getElementById("loginBtn");

const signupBtn =
  document.getElementById("signupBtn");

const authMessage =
  document.getElementById("authMessage");

const logoutBtn =
  document.getElementById("logoutBtn");

const accountEmail =
  document.getElementById("accountEmail");

/* ================================= */
/* WEIGH IN */
/* ================================= */

const weightInput =
  document.getElementById("weightInput");

const saveWeightBtn =
  document.getElementById("saveWeightBtn");

const editWeightBtn =
  document.getElementById("editWeightBtn");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

const weighInTitle =
  document.getElementById("weighInTitle");

const weightQuestion =
  document.getElementById("weightQuestion");

const todayLabel =
  document.getElementById("todayLabel");

/* ================================= */
/* DASHBOARD */
/* ================================= */

const currentWeight =
  document.getElementById("currentWeight");

const heroChange =
  document.getElementById("heroChange");

const dayNumber =
  document.getElementById("dayNumber");

const averageWeight =
  document.getElementById("averageWeight");

const lowestWeight =
  document.getElementById("lowestWeight");

const streakStat =
  document.getElementById("streakStat");

const progressPercent =
  document.getElementById("progressPercent");

const progressFill =
  document.getElementById("progressFill");

const startWeightText =
  document.getElementById("startWeightText");

const goalWeightText =
  document.getElementById("goalWeightText");

const remaining =
  document.getElementById("remaining");

const goalHeadline =
  document.getElementById("goalHeadline");

/* ================================= */
/* HISTORY */
/* ================================= */

const historyBtn =
  document.getElementById("historyBtn");

const historyModal =
  document.getElementById("historyModal");

const closeHistoryBtn =
  document.getElementById("closeHistoryBtn");

const historyList =
  document.getElementById("historyList");

/* ================================= */
/* INSIGHTS */
/* ================================= */

const insightsBtn =
  document.getElementById("insightsBtn");

const insightsModal =
  document.getElementById("insightsModal");

const closeInsightsBtn =
  document.getElementById("closeInsightsBtn");

const insightPace =
  document.getElementById("insightPace");

const insight7Days =
  document.getElementById("insight7Days");

const insight30Days =
  document.getElementById("insight30Days");

const insightLowest =
  document.getElementById("insightLowest");

const insightLongestStreak =
  document.getElementById("insightLongestStreak");

const insightLost =
  document.getElementById("insightLost");

const insightProgress =
  document.getElementById("insightProgress");

const goalPrediction =
  document.getElementById("goalPrediction");

/* ================================= */
/* SETTINGS */
/* ================================= */

const settingsBtn =
  document.getElementById("settingsBtn");

const settingsModal =
  document.getElementById("settingsModal");

const closeSettingsBtn =
  document.getElementById("closeSettingsBtn");

const saveSettingsBtn =
  document.getElementById("saveSettingsBtn");

const startWeightInput =
  document.getElementById("startWeightInput");

const goalWeightInput =
  document.getElementById("goalWeightInput");

/* ================================= */
/* PUSH ELEMENTS */
/* ================================= */

const PUSH_VAPID_PUBLIC_KEY =
  "BLL9phLwCKgmV67QlOU-_onvqut6IZWM4lFKQlWZeo4PDPlsKOjRkzJphUVHy4Ef1yIPLfCgknS9qHDviK1XVNU";

const notificationToggleBtn =
  document.getElementById("notificationToggleBtn");

const testNotificationBtn =
  document.getElementById("testNotificationBtn");

const notificationMessage =
  document.getElementById("notificationMessage");

/* ================================= */
/* STATE */
/* ================================= */

let currentUser = null;

let profile = null;

let entries = [];

let settings = {
  startWeight: null,
  goalWeight: null
};

let weightChart = null;

let editingToday = false;

let weighInFromApp = false;

let activePage = "home";

let gameState = null;

let gameToastTimer = null;

let lastKnownDate = getToday();

/* ================================= */
/* DATO */
/* ================================= */

function getToday() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function parseDate(date) {
  return new Date(
    `${date}T12:00:00`
  );
}

function daysBetween(
  first,
  second
) {
  return Math.round(
    (
      parseDate(second) -
      parseDate(first)
    ) /
    86400000
  );
}

function renderDate() {
  todayLabel.textContent =
    new Date()
      .toLocaleDateString(
        "nb-NO",
        {
          weekday: "long",
          day: "numeric",
          month: "long"
        }
      );
}

/* ================================= */
/* FORMAT */
/* ================================= */

function formatWeight(value) {
  return Number(value)
    .toFixed(1)
    .replace(
      ".",
      ","
    );
}

function formatChange(value) {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "--";
  }

  if (value > 0) {
    return `+${formatWeight(value)} kg`;
  }

  return `${formatWeight(value)} kg`;
}

/* ================================= */
/* VIEW HELPERS */
/* ================================= */

function hideMainViews() {
  loadingView.classList.add("hidden");
  authView.classList.add("hidden");
  weighInView.classList.add("hidden");
  dashboardView.classList.add("hidden");
}

function showLoading() {
  hideMainViews();
  loadingView.classList.remove("hidden");
}

function showAuth() {
  hideMainViews();
  authView.classList.remove("hidden");
}

function closeAllModals() {
  historyModal.classList.add("hidden");
  insightsModal.classList.add("hidden");
  settingsModal.classList.add("hidden");
}

/* ================================= */
/* AUTH MESSAGE */
/* ================================= */

function showAuthMessage(
  message,
  isError = false
) {
  authMessage.textContent =
    message;

  authMessage.classList.toggle(
    "error",
    isError
  );
}

/* ================================= */
/* LOGIN */
/* ================================= */

async function login() {
  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;

  if (
    !email ||
    !password
  ) {
    showAuthMessage(
      "Skriv inn e-post og passord.",
      true
    );

    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logger inn...";
  showAuthMessage("");

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .signInWithPassword({
        email,
        password
      });

  loginBtn.disabled = false;
  loginBtn.textContent = "Logg inn";

  if (error) {
    showAuthMessage(
      error.message,
      true
    );

    return;
  }

  currentUser =
    data.user;

  showLoading();

  await loadUserData();

  render();
}

/* ================================= */
/* SIGN UP */
/* ================================= */

async function signup() {
  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;

  if (!email) {
    showAuthMessage(
      "Skriv inn e-postadressen din.",
      true
    );

    return;
  }

  if (
    !password ||
    password.length < 6
  ) {
    showAuthMessage(
      "Passordet må være minst 6 tegn.",
      true
    );

    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = "Oppretter...";
  showAuthMessage("");

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            SITE_URL
        }
      });

  signupBtn.disabled = false;
  signupBtn.textContent = "Opprett bruker";

  if (error) {
    showAuthMessage(
      error.message,
      true
    );

    return;
  }

  if (!data.session) {
    showAuthMessage(
      "Konto opprettet 🌿 Sjekk e-posten din og bekreft adressen."
    );

    return;
  }

  currentUser =
    data.user;

  showLoading();

  await loadUserData();

  render();
}

/* ================================= */
/* LOGOUT */
/* ================================= */

async function logout() {
  logoutBtn.disabled = true;

  await supabaseClient
    .auth
    .signOut();

  logoutBtn.disabled = false;

  currentUser = null;
  profile = null;
  entries = [];

  settings = {
    startWeight: null,
    goalWeight: null
  };

  editingToday = false;
  weighInFromApp = false;
  gameState = null;

  closeAllModals();

  authPassword.value = "";

  showAuth();
}

/* ================================= */
/* LOAD DATA */
/* ================================= */

async function loadUserData() {
  if (!currentUser) {
    return;
  }

  const [
    profileResult,
    entriesResult
  ] =
    await Promise.all([

      supabaseClient
        .from(
          "weight_profiles"
        )
        .select(
          "journey_start_date,start_weight,goal_weight"
        )
        .maybeSingle(),

      supabaseClient
        .from(
          "weight_entries"
        )
        .select(
          "id,weighed_on,weight"
        )
        .order(
          "weighed_on",
          {
            ascending: true
          }
        )

    ]);

  if (
    profileResult.error
  ) {
    console.error(
      profileResult.error
    );

    alert(
      "Kunne ikke hente profilen din."
    );
  }

  if (
    entriesResult.error
  ) {
    console.error(
      entriesResult.error
    );

    alert(
      "Kunne ikke hente innveiingene dine."
    );
  }

  profile =
    profileResult.data ??
    null;

  entries =
    (
      entriesResult.data ??
      []
    )
      .map(
        entry => ({
          id:
            entry.id,

          date:
            entry.weighed_on,

          weight:
            Number(
              entry.weight
            )
        })
      );

  settings.startWeight =
    profile?.start_weight !== null &&
    profile?.start_weight !== undefined
      ? Number(
          profile.start_weight
        )
      : (
          entries[0]?.weight ??
          null
        );

  settings.goalWeight =
    profile?.goal_weight !== null &&
    profile?.goal_weight !== undefined
      ? Number(
          profile.goal_weight
        )
      : null;

  loadGameState();
}

/* ================================= */
/* TODAY ENTRY */
/* ================================= */

function getTodayEntry() {
  return entries.find(
    entry =>
      entry.date ===
      getToday()
  );
}

/* ================================= */
/* DAY NUMBER */
/* ================================= */

function calculateDayNumber() {
  if (
    !profile?.journey_start_date
  ) {
    return 1;
  }

  const difference =
    daysBetween(
      profile.journey_start_date,
      getToday()
    );

  return Math.max(
    1,
    difference + 1
  );
}

/* ================================= */
/* VIEW */
/* ================================= */

function renderView() {
  if (!currentUser) {
    showAuth();
    return;
  }

  const todayEntry = getTodayEntry();

  if (editingToday || weighInFromApp) {
    hideMainViews();
    weighInView.classList.remove("hidden");

    if (todayEntry) {
      weighInTitle.textContent = "Endre vekten.";
      weightQuestion.textContent = "Oppdater dagens innveiing.";
      weightInput.value = todayEntry.weight;
      saveWeightBtn.textContent = "Lagre endring";
    } else {
      weighInTitle.textContent = "Registrer vekten.";
      weightQuestion.textContent = "Hva veier du i dag?";
      weightInput.value = "";
      saveWeightBtn.textContent = "Registrer";
    }

    cancelEditBtn.classList.remove("hidden");
    return;
  }

  hideMainViews();
  dashboardView.classList.remove("hidden");
}

/* ================================= */
/* SAVE WEIGHT */
/* ================================= */

async function saveWeight() {
  if (!currentUser) {
    return;
  }

  const rawValue =
    String(
      weightInput.value
    )
      .replace(
        ",",
        "."
      );

  const weight =
    parseFloat(
      rawValue
    );

  if (
    !Number.isFinite(weight) ||
    weight < 30 ||
    weight > 300
  ) {
    alert(
      "Skriv inn en gyldig vekt."
    );

    return;
  }

  saveWeightBtn.disabled = true;

  const originalText =
    saveWeightBtn.textContent;

  saveWeightBtn.textContent =
    "Lagrer...";

  const today =
    getToday();

  const existing =
    getTodayEntry();

  if (!profile) {
    const {
      error: profileError
    } =
      await supabaseClient
        .from(
          "weight_profiles"
        )
        .insert({
          user_id:
            currentUser.id,

          journey_start_date:
            today,

          start_weight:
            weight,

          goal_weight:
            settings.goalWeight
        });

    if (profileError) {
      console.error(
        profileError
      );

      saveWeightBtn.disabled =
        false;

      saveWeightBtn.textContent =
        originalText;

      alert(
        "Kunne ikke starte reisen din."
      );

      return;
    }
  }

  let saveError;

  if (existing) {
    const {
      error
    } =
      await supabaseClient
        .from(
          "weight_entries"
        )
        .update({
          weight
        })
        .eq(
          "id",
          existing.id
        );

    saveError =
      error;
  } else {
    const {
      error
    } =
      await supabaseClient
        .from(
          "weight_entries"
        )
        .insert({
          user_id:
            currentUser.id,

          weighed_on:
            today,

          weight
        });

    saveError =
      error;
  }

  if (saveError) {
    console.error(
      saveError
    );

    saveWeightBtn.disabled =
      false;

    saveWeightBtn.textContent =
      originalText;

    alert(
      "Kunne ikke lagre vekten."
    );

    return;
  }

  if (
    profile &&
    settings.startWeight === null
  ) {
    await supabaseClient
      .from(
        "weight_profiles"
      )
      .update({
        start_weight:
          weight
      })
      .eq(
        "user_id",
        currentUser.id
      );
  }

  editingToday =
    false;

  weighInFromApp = false;

  await loadUserData();

  saveWeightBtn.disabled =
    false;

  saveWeightBtn.textContent =
    originalText;

  render();
}

/* ================================= */
/* STREAK */
/* ================================= */

function calculateCurrentStreak() {
  if (!entries.length) {
    return 0;
  }

  const sorted =
    [...entries]
      .sort(
        (a, b) =>
          parseDate(a.date) -
          parseDate(b.date)
      );

  const latest =
    sorted[
      sorted.length - 1
    ];

  if (
    daysBetween(
      latest.date,
      getToday()
    ) > 1
  ) {
    return 0;
  }

  let streak =
    1;

  for (
    let i =
      sorted.length - 1;

    i > 0;

    i--
  ) {
    if (
      daysBetween(
        sorted[i - 1].date,
        sorted[i].date
      ) === 1
    ) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak() {
  if (!entries.length) {
    return 0;
  }

  const sorted =
    [...entries]
      .sort(
        (a, b) =>
          parseDate(a.date) -
          parseDate(b.date)
      );

  let longest =
    1;

  let current =
    1;

  for (
    let i = 1;

    i < sorted.length;

    i++
  ) {
    if (
      daysBetween(
        sorted[i - 1].date,
        sorted[i].date
      ) === 1
    ) {
      current++;

      longest =
        Math.max(
          longest,
          current
        );
    } else {
      current =
        1;
    }
  }

  return longest;
}

/* ================================= */
/* STATS */
/* ================================= */

function calculateStats() {
  if (!entries.length) {
    return null;
  }

  const latest =
    entries[
      entries.length - 1
    ];

  const lastSeven =
    entries.slice(
      -7
    );

  const average =
    lastSeven.reduce(
      (sum, entry) =>
        sum +
        entry.weight,
      0
    ) /
    lastSeven.length;

  const lowest =
    Math.min(
      ...entries.map(
        entry =>
          entry.weight
      )
    );

  const start =
    settings.startWeight ??
    entries[0].weight;

  const goal =
    settings.goalWeight;

  const lost =
    start -
    latest.weight;

  let progress =
    0;

  let remainingWeight =
    null;

  if (
    goal !== null &&
    start !== goal
  ) {
    progress =
      (
        (
          start -
          latest.weight
        ) /
        (
          start -
          goal
        )
      ) *
      100;

    progress =
      Math.max(
        0,
        Math.min(
          100,
          progress
        )
      );

    remainingWeight =
      Math.max(
        0,
        latest.weight -
        goal
      );
  }

  return {
    latest,
    average,
    lowest,
    start,
    goal,
    lost,
    progress,
    remainingWeight,
    streak:
      calculateCurrentStreak()
  };
}

/* ================================= */
/* DASHBOARD */
/* ================================= */

function renderDashboard() {
  const stats =
    calculateStats();

  if (!stats) {
    return;
  }

  dayNumber.textContent =
    String(
      calculateDayNumber()
    )
      .padStart(
        2,
        "0"
      );

  currentWeight.textContent =
    formatWeight(
      stats.latest.weight
    );

  averageWeight.textContent =
    `${formatWeight(
      stats.average
    )} kg`;

  lowestWeight.textContent =
    `${formatWeight(
      stats.lowest
    )} kg`;

  streakStat.textContent =
    stats.streak === 1
      ? "1 dag"
      : `${stats.streak} dager`;

  if (
    entries.length === 1
  ) {
    heroChange.textContent =
      "Første innveiing ✦";
  } else if (
    stats.lost > 0
  ) {
    heroChange.textContent =
      `↓ ${formatWeight(
        stats.lost
      )} kg siden start`;
  } else if (
    stats.lost < 0
  ) {
    heroChange.textContent =
      `↑ ${formatWeight(
        Math.abs(
          stats.lost
        )
      )} kg siden start`;
  } else {
    heroChange.textContent =
      "Samme som start";
  }

  if (
    stats.goal === null
  ) {
    goalHeadline.textContent =
      "Sett et mål";

    progressPercent.textContent =
      "--";

    progressFill.style.width =
      "0%";

    startWeightText.textContent =
      `Start ${formatWeight(
        stats.start
      )} kg`;

    remaining.textContent =
      "Åpne innstillinger";

    goalWeightText.textContent =
      "Mål --";

    return;
  }

  const percent =
    Math.round(
      stats.progress
    );

  goalHeadline.textContent =
    `${formatWeight(
      stats.remainingWeight
    )} kg igjen`;

  progressPercent.textContent =
    `${percent}%`;

  progressFill.style.width =
    `${stats.progress}%`;

  startWeightText.textContent =
    `Start ${formatWeight(
      stats.start
    )} kg`;

  remaining.textContent =
    `${percent}% fullført`;

  goalWeightText.textContent =
    `Mål ${formatWeight(
      stats.goal
    )} kg`;
}

/* ================================= */
/* CHANGE OVER DAYS */
/* ================================= */

function changeOverDays(days) {
  if (
    entries.length < 2
  ) {
    return null;
  }

  const latest =
    entries[
      entries.length - 1
    ];

  const cutoff =
    new Date(
      parseDate(
        latest.date
      )
    );

  cutoff.setDate(
    cutoff.getDate() -
    days
  );

  const candidate =
    entries.find(
      entry =>
        parseDate(
          entry.date
        ) >= cutoff
    );

  if (
    !candidate ||
    candidate.id === latest.id
  ) {
    return null;
  }

  return (
    latest.weight -
    candidate.weight
  );
}

/* ================================= */
/* WEEKLY PACE */
/* ================================= */

function calculateWeeklyPace() {
  if (
    entries.length < 2
  ) {
    return null;
  }

  const first =
    entries[0];

  const latest =
    entries[
      entries.length - 1
    ];

  const days =
    daysBetween(
      first.date,
      latest.date
    );

  if (
    days <= 0
  ) {
    return null;
  }

  return (
    (
      latest.weight -
      first.weight
    ) /
    days
  ) *
  7;
}

/* ================================= */
/* INSIGHTS */
/* ================================= */

function renderInsights() {
  const stats =
    calculateStats();

  if (!stats) {
    return;
  }

  const pace =
    calculateWeeklyPace();

  insightPace.textContent =
    pace === null
      ? "--"
      : `${formatChange(
          pace
        )} / uke`;

  insight7Days.textContent =
    formatChange(
      changeOverDays(
        7
      )
    );

  insight30Days.textContent =
    formatChange(
      changeOverDays(
        30
      )
    );

  insightLowest.textContent =
    `${formatWeight(
      stats.lowest
    )} kg`;

  const longest =
    calculateLongestStreak();

  insightLongestStreak.textContent =
    longest === 1
      ? "🔥 1 dag"
      : `🔥 ${longest} dager`;

  if (
    stats.lost >= 0
  ) {
    insightLost.textContent =
      `-${formatWeight(
        stats.lost
      )} kg`;
  } else {
    insightLost.textContent =
      `+${formatWeight(
        Math.abs(
          stats.lost
        )
      )} kg`;
  }

  insightProgress.textContent =
    stats.goal !== null
      ? `${Math.round(
          stats.progress
        )}%`
      : "--";

  if (
    stats.goal === null
  ) {
    goalPrediction.textContent =
      "Sett en målvekt for å få en prognose.";

    return;
  }

  if (
    pace === null ||
    pace >= 0
  ) {
    goalPrediction.textContent =
      "Vi trenger flere innveiinger med en tydelig nedadgående trend før måldato kan beregnes.";

    return;
  }

  if (
    stats.remainingWeight <= 0
  ) {
    goalPrediction.textContent =
      "Du har allerede nådd målvekten 🎯";

    return;
  }

  const weeksRemaining =
    stats.remainingWeight /
    Math.abs(
      pace
    );

  const prediction =
    new Date();

  prediction.setDate(
    prediction.getDate() +
    Math.round(
      weeksRemaining *
      7
    )
  );

  const predictionText =
    prediction
      .toLocaleDateString(
        "nb-NO",
        {
          day:
            "numeric",

          month:
            "long"
        }
      );

  goalPrediction.textContent =
    `Med dagens tempo er estimert måldato rundt ${predictionText}.`;
}

/* ================================= */
/* HISTORY */
/* ================================= */

function renderHistory() {
  if (!entries.length) {
    historyList.innerHTML =
      `
        <div class="empty-state">
          Ingen innveiinger ennå.
        </div>
      `;

    return;
  }

  historyList.innerHTML =
    [...entries]
      .reverse()
      .map(
        entry => {
          const date =
            parseDate(
              entry.date
            );

          const text =
            date
              .toLocaleDateString(
                "nb-NO",
                {
                  weekday:
                    "short",

                  day:
                    "numeric",

                  month:
                    "short"
                }
              );

          return `
            <div class="history-item">

              <span class="history-date">
                ${text}
              </span>

              <div>

                <span class="history-weight">
                  ${formatWeight(
                    entry.weight
                  )} kg
                </span>

                <button
                  class="delete-btn"
                  onclick="deleteEntry('${entry.id}')"
                >
                  Slett
                </button>

              </div>

            </div>
          `;
        }
      )
      .join("");
}

/* ================================= */
/* DELETE */
/* ================================= */

async function deleteEntry(id) {
  if (!currentUser) {
    return;
  }

  const {
    error
  } =
    await supabaseClient
      .from(
        "weight_entries"
      )
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {
    console.error(
      error
    );

    alert(
      "Kunne ikke slette innveiingen."
    );

    return;
  }

  closeAllModals();

  editingToday =
    false;

  await loadUserData();

  render();
}

/* ================================= */
/* CHART */
/* ================================= */

function renderChart() {
  const canvas =
    document.getElementById(
      "weightChart"
    );

  if (!canvas) {
    return;
  }

  const ctx =
    canvas.getContext(
      "2d"
    );

  const labels =
    entries.map(
      entry =>
        parseDate(
          entry.date
        )
          .toLocaleDateString(
            "nb-NO",
            {
              day:
                "numeric",

              month:
                "short"
            }
          )
    );

  const weights =
    entries.map(
      entry =>
        entry.weight
    );

  const averages =
    entries.map(
      (
        entry,
        index
      ) => {
        const recent =
          entries.slice(
            Math.max(
              0,
              index - 6
            ),
            index + 1
          );

        return (
          recent.reduce(
            (
              sum,
              item
            ) =>
              sum +
              item.weight,
            0
          ) /
          recent.length
        );
      }
    );

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      260
    );

  gradient.addColorStop(
    0,
    "rgba(93,137,87,0.18)"
  );

  gradient.addColorStop(
    1,
    "rgba(93,137,87,0)"
  );

  if (weightChart) {
    weightChart.destroy();
  }

  weightChart =
    new Chart(
      canvas,
      {
        type:
          "line",

        data: {
          labels,

          datasets: [
            {
              label:
                "Vekt",

              data:
                weights,

              borderColor:
                "rgba(68,85,65,0.28)",

              backgroundColor:
                "rgba(68,85,65,0.28)",

              borderWidth:
                1.5,

              pointRadius:
                3,

              pointBackgroundColor:
                "#526f50",

              tension:
                0.3,

              fill:
                false
            },

            {
              label:
                "Trend",

              data:
                averages,

              borderColor:
                "#6f956d",

              backgroundColor:
                gradient,

              borderWidth:
                2.5,

              pointRadius:
                0,

              tension:
                0.4,

              fill:
                true
            }
          ]
        },

        options: {
          responsive:
            true,

          maintainAspectRatio:
            false,

          interaction: {
            intersect:
              false,

            mode:
              "index"
          },

          plugins: {
            legend: {
              display:
                false
            },

            tooltip: {
              backgroundColor:
                "#fff9df",

              borderColor:
                "rgba(72,95,68,0.16)",

              borderWidth:
                1,

              titleColor:
                "#35473a",

              bodyColor:
                "#35473a",

              padding:
                12,

              callbacks: {
                label:
                  context =>
                    `${context.dataset.label}: ${formatWeight(
                      context.parsed.y
                    )} kg`
              }
            }
          },

          scales: {
            x: {
              border: {
                display:
                  false
              },

              grid: {
                display:
                  false
              },

              ticks: {
                color:
                  "#788475"
              }
            },

            y: {
              border: {
                display:
                  false
              },

              grid: {
                color:
                  "rgba(73,93,69,0.08)"
              },

              ticks: {
                color:
                  "#788475"
              }
            }
          }
        }
      }
    );
}

/* ================================= */
/* SAVE SETTINGS */
/* ================================= */

async function saveSettings() {
  if (!currentUser) {
    return;
  }

  const start =
    parseFloat(
      startWeightInput.value
    );

  const goal =
    parseFloat(
      goalWeightInput.value
    );

  const startValue =
    Number.isFinite(
      start
    )
      ? start
      : (
          settings.startWeight ??
          entries[0]?.weight ??
          null
        );

  const goalValue =
    Number.isFinite(
      goal
    )
      ? goal
      : null;

  saveSettingsBtn.disabled =
    true;

  saveSettingsBtn.textContent =
    "Lagrer...";

  let error;

  if (profile) {
    const result =
      await supabaseClient
        .from(
          "weight_profiles"
        )
        .update({
          start_weight:
            startValue,

          goal_weight:
            goalValue
        })
        .eq(
          "user_id",
          currentUser.id
        );

    error =
      result.error;
  } else {
    const result =
      await supabaseClient
        .from(
          "weight_profiles"
        )
        .insert({
          user_id:
            currentUser.id,

          journey_start_date:
            entries[0]?.date ??
            getToday(),

          start_weight:
            startValue,

          goal_weight:
            goalValue
        });

    error =
      result.error;
  }

  saveSettingsBtn.disabled =
    false;

  saveSettingsBtn.textContent =
    "Lagre";

  if (error) {
    console.error(
      error
    );

    alert(
      "Kunne ikke lagre innstillingene."
    );

    return;
  }

  settingsModal.classList.add(
    "hidden"
  );

  await loadUserData();

  render();
}

/* =========================================================
   RPG V1 — local progression
========================================================= */

const QUESTS = [
  {
    id: "weight",
    icon: "⚖️",
    label: "Registrer vekten din",
    subtitle: "Hold oversikt over reisen",
    xp: 20,
    stat: "discipline",
    statGain: 2
  },
  {
    id: "strength",
    icon: "🏋️",
    label: "Styrketrening",
    subtitle: "En gjennomført styrkeøkt",
    xp: 100,
    stat: "strength",
    statGain: 8
  },
  {
    id: "cardio",
    icon: "♥",
    label: "Kondisjon",
    subtitle: "Løp, sykkel, tennis, padel eller lignende",
    xp: 80,
    stat: "endurance",
    statGain: 8
  },
  {
    id: "steps",
    icon: "👟",
    label: "10 000 skritt",
    subtitle: "En aktiv dag ute i verden",
    xp: 50,
    stat: "endurance",
    statGain: 4
  },
  {
    id: "water",
    icon: "💧",
    label: "Drikk 2 L vann",
    subtitle: "Hold eventyreren hydrert",
    xp: 30,
    stat: "discipline",
    statGain: 3
  }
];

const GEAR = [
  {
    id: "sword",
    icon: "⚔️",
    name: "Skogvokterens sverd",
    effect: level => `+${level * 4} gull/time fra leiren`
  },
  {
    id: "boots",
    icon: "🥾",
    name: "Vandrerstøvler",
    effect: level => `+${level * 3}% XP fra quests`
  },
  {
    id: "backpack",
    icon: "🎒",
    name: "Eventyrsekk",
    effect: level => `+${level * 2} timer offline-lagring`
  },
  {
    id: "charm",
    icon: "🧿",
    name: "Skogamulet",
    effect: level => `+${level * 5}% XP fra alle quests`
  }
];

function gameStorageKey() {
  return currentUser
    ? `vekt-rpg-v1:${currentUser.id}`
    : "vekt-rpg-v1:guest";
}

function createDefaultGameState() {
  return {
    version: 1,
    totalXp: 0,
    gold: 150,
    stats: {
      strength: 1,
      endurance: 1,
      discipline: 1
    },
    questHistory: {},
    weeklyRewards: {},
    gear: {
      sword: 0,
      boots: 0,
      backpack: 0,
      charm: 0
    },
    campLastClaim: Date.now()
  };
}

function loadGameState() {
  if (!currentUser) {
    gameState = null;
    return;
  }

  try {
    const stored = localStorage.getItem(gameStorageKey());
    const parsed = stored ? JSON.parse(stored) : null;
    const base = createDefaultGameState();

    gameState = {
      ...base,
      ...(parsed || {}),
      stats: {
        ...base.stats,
        ...(parsed?.stats || {})
      },
      questHistory: parsed?.questHistory || {},
      weeklyRewards: parsed?.weeklyRewards || {},
      gear: {
        ...base.gear,
        ...(parsed?.gear || {})
      },
      campLastClaim: Number(parsed?.campLastClaim) || Date.now()
    };
  } catch (error) {
    console.warn("Kunne ikke lese RPG-data:", error);
    gameState = createDefaultGameState();
  }
}

function saveGameState() {
  if (!currentUser || !gameState) {
    return;
  }

  localStorage.setItem(
    gameStorageKey(),
    JSON.stringify(gameState)
  );
}

function getLevelInfo(totalXp = 0) {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  let required = 300;

  while (remaining >= required && level < 100) {
    remaining -= required;
    level++;
    required = 250 + level * 50;
  }

  return {
    level,
    currentXp: remaining,
    required,
    percent: Math.min(100, (remaining / required) * 100)
  };
}

function getQuestXpMultiplier() {
  if (!gameState) return 1;
  return 1 +
    (gameState.gear.boots || 0) * 0.03 +
    (gameState.gear.charm || 0) * 0.05;
}

function getCampRate() {
  if (!gameState) return 12;
  const level = getLevelInfo(gameState.totalXp).level;
  return 12 + Math.floor(level / 2) + (gameState.gear.sword || 0) * 4;
}

function getCampCapHours() {
  if (!gameState) return 8;
  return 8 + (gameState.gear.backpack || 0) * 2;
}

function getCampStored() {
  if (!gameState) return 0;
  const elapsedHours = Math.max(
    0,
    (Date.now() - gameState.campLastClaim) / 3600000
  );
  const cappedHours = Math.min(elapsedHours, getCampCapHours());
  return Math.floor(cappedHours * getCampRate());
}

function ensureTodayQuestState() {
  if (!gameState) return null;
  const today = getToday();
  if (!gameState.questHistory[today]) {
    gameState.questHistory[today] = {};
  }
  return gameState.questHistory[today];
}

function awardXp(baseXp) {
  const amount = Math.max(1, Math.round(baseXp * getQuestXpMultiplier()));
  const before = getLevelInfo(gameState.totalXp).level;
  gameState.totalXp += amount;
  const after = getLevelInfo(gameState.totalXp).level;

  if (after > before) {
    showGameToast(`Level up! Du er nå Level ${after} ✦`);
  }

  return amount;
}

function syncWeightQuest() {
  if (!gameState || !getTodayEntry()) return;
  const todayState = ensureTodayQuestState();
  if (todayState.weight) return;

  const quest = QUESTS.find(item => item.id === "weight");
  todayState.weight = true;
  const awarded = awardXp(quest.xp);
  gameState.stats.discipline += quest.statGain;
  gameState.gold += 2;
  saveGameState();
  showGameToast(`Innveiing fullført · +${awarded} XP`);
}

function completeQuest(id) {
  if (!gameState) return;

  if (id === "weight" && !getTodayEntry()) {
    openWeightEntry();
    return;
  }

  const quest = QUESTS.find(item => item.id === id);
  const todayState = ensureTodayQuestState();

  if (!quest || todayState[id]) {
    return;
  }

  todayState[id] = true;
  const awarded = awardXp(quest.xp);
  gameState.stats[quest.stat] += quest.statGain;
  gameState.gold += Math.max(2, Math.round(quest.xp / 12));
  saveGameState();
  checkWeeklyReward();
  renderGame();
  showGameToast(`${quest.label} · +${awarded} XP`);
}

function getWeekStart(dateString = getToday()) {
  const date = parseDate(dateString);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getWeeklyProgress() {
  if (!gameState) {
    return { strength: 0, steps: 0, cardio: 0 };
  }

  const weekStart = getWeekStart();
  const progress = { strength: 0, steps: 0, cardio: 0 };

  Object.entries(gameState.questHistory).forEach(([date, quests]) => {
    const diff = daysBetween(weekStart, date);
    if (diff < 0 || diff > 6) return;
    if (quests.strength) progress.strength++;
    if (quests.steps) progress.steps++;
    if (quests.cardio) progress.cardio++;
  });

  return progress;
}

function checkWeeklyReward() {
  if (!gameState) return;
  const progress = getWeeklyProgress();
  const key = getWeekStart();
  const complete =
    progress.strength >= 3 &&
    progress.steps >= 5 &&
    progress.cardio >= 1;

  if (complete && !gameState.weeklyRewards[key]) {
    gameState.weeklyRewards[key] = true;
    gameState.totalXp += 500;
    gameState.gold += 150;
    saveGameState();
    showGameToast("Ukeskisten åpnet! +500 XP · +150 gull 🧰");
  }
}

function countCompletedQuests() {
  if (!gameState) return 0;
  return Object.values(gameState.questHistory)
    .reduce(
      (sum, day) => sum + Object.values(day).filter(Boolean).length,
      0
    );
}

function renderQuestRows(target) {
  if (!target || !gameState) return;
  const todayState = ensureTodayQuestState();

  target.innerHTML = QUESTS.map(quest => {
    const done = !!todayState[quest.id];
    const actualXp = Math.round(quest.xp * getQuestXpMultiplier());

    return `
      <button class="quest-row ${done ? "done" : ""}" data-quest-id="${quest.id}" type="button" ${done ? "disabled" : ""}>
        <span class="quest-icon">${quest.icon}</span>
        <span class="quest-copy">
          <strong>${quest.label}</strong>
          <small>${quest.subtitle}</small>
        </span>
        <span class="quest-reward">
          +${actualXp} XP
          <span class="quest-check">✓</span>
        </span>
      </button>
    `;
  }).join("");
}

function renderAchievements() {
  const target = document.getElementById("achievementList");
  if (!target || !gameState) return;

  const level = getLevelInfo(gameState.totalXp).level;
  const completed = countCompletedQuests();
  const streak = calculateCurrentStreak();
  const stats = calculateStats();
  const hitGoal = stats?.goal !== null && stats?.latest?.weight <= stats.goal;

  const achievements = [
    { icon: "🌱", title: "Første steg", text: "Fullfør ditt første quest", unlocked: completed >= 1 },
    { icon: "🔥", title: "Dedikert", text: "7 dagers innveiingsstreak", unlocked: streak >= 7 },
    { icon: "🛡️", title: "Eventyrer", text: "Nå Level 5", unlocked: level >= 5 },
    { icon: "🏆", title: "Målmester", text: "Nå vektmålet ditt", unlocked: !!hitGoal }
  ];

  target.innerHTML = achievements.map(item => `
    <div class="achievement ${item.unlocked ? "" : "locked"}">
      <span class="achievement-icon">${item.icon}</span>
      <div><strong>${item.title}</strong><small>${item.text}</small></div>
      <b>${item.unlocked ? "✓" : "🔒"}</b>
    </div>
  `).join("");
}

function getGearUpgradeCost(level) {
  return Math.round(120 * Math.pow(1.75, level));
}

function renderGear() {
  const target = document.getElementById("gearGrid");
  if (!target || !gameState) return;

  target.innerHTML = GEAR.map(item => {
    const level = gameState.gear[item.id] || 0;
    const cost = getGearUpgradeCost(level);
    const canBuy = gameState.gold >= cost;
    const currentEffect = level > 0 ? item.effect(level) : "Ikke aktiv ennå";
    const nextEffect = item.effect(level + 1);

    return `
      <div class="gear-item">
        <div class="gear-head">
          <span>${item.icon}</span>
          <div><strong>${item.name}</strong><small>Level ${level}</small></div>
        </div>
        <div class="gear-effect">${currentEffect}<br><strong>Neste:</strong> ${nextEffect}</div>
        <button class="gear-upgrade" data-gear-id="${item.id}" type="button" ${canBuy ? "" : "disabled"}>
          Oppgrader · ${cost} 🪙
        </button>
      </div>
    `;
  }).join("");
}

function upgradeGear(id) {
  if (!gameState) return;
  const item = GEAR.find(gear => gear.id === id);
  if (!item) return;

  const level = gameState.gear[id] || 0;
  const cost = getGearUpgradeCost(level);
  if (gameState.gold < cost) {
    showGameToast("Du trenger mer gull til denne oppgraderingen.");
    return;
  }

  gameState.gold -= cost;
  gameState.gear[id] = level + 1;
  saveGameState();
  renderGame();
  showGameToast(`${item.name} er nå Level ${level + 1} ✦`);
}

function claimCampReward() {
  if (!gameState) return;
  const stored = getCampStored();
  if (stored < 1) {
    showGameToast("Leiren trenger litt tid til å samle mer gull.");
    return;
  }

  gameState.gold += stored;
  gameState.campLastClaim = Date.now();
  saveGameState();
  renderGame();
  showGameToast(`Leiren ga deg ${stored} gull 🪙`);
}

function setWidth(id, value, max) {
  const element = document.getElementById(id);
  if (!element) return;
  const pct = max > 0 ? Math.min(100, Math.max(0, value / max * 100)) : 0;
  element.style.width = `${pct}%`;
}

function renderGame() {
  if (!gameState || !currentUser) return;

  syncWeightQuest();
  checkWeeklyReward();

  const levelInfo = getLevelInfo(gameState.totalXp);
  const weekly = getWeeklyProgress();
  const streak = calculateCurrentStreak();
  const campStored = getCampStored();

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("gameLevel", levelInfo.level);
  setText("gameXpText", `${levelInfo.currentXp} / ${levelInfo.required} XP`);
  setText("gameGold", gameState.gold);
  setText("homeStreak", streak);
  setText("strengthStat", gameState.stats.strength);
  setText("enduranceStat", gameState.stats.endurance);
  setText("disciplineStat", gameState.stats.discipline);
  setText("adventureLevel", levelInfo.level);
  setText("adventureXp", `${levelInfo.currentXp} / ${levelInfo.required}`);
  setText("adventureGold", gameState.gold);
  setText("adventureStrength", gameState.stats.strength);
  setText("adventureEndurance", gameState.stats.endurance);
  setText("adventureDiscipline", gameState.stats.discipline);
  setText("campRate", getCampRate());
  setText("campCap", getCampCapHours());
  setText("campStored", campStored);

  setWidth("gameXpFill", levelInfo.currentXp, levelInfo.required);
  setWidth("adventureXpFill", levelInfo.currentXp, levelInfo.required);
  setWidth("strengthSkillFill", gameState.stats.strength % 10 || 10, 10);
  setWidth("enduranceSkillFill", gameState.stats.endurance % 10 || 10, 10);
  setWidth("disciplineSkillFill", gameState.stats.discipline % 10 || 10, 10);

  setText("weeklyStrengthText", `${weekly.strength} / 3`);
  setText("weeklyStepsText", `${weekly.steps} / 5`);
  setText("weeklyCardioText", `${weekly.cardio} / 1`);
  setText("questWeeklyStrength", `${weekly.strength} / 3`);
  setText("questWeeklySteps", `${weekly.steps} / 5`);
  setText("questWeeklyCardio", `${weekly.cardio} / 1`);
  setWidth("weeklyStrengthFill", weekly.strength, 3);
  setWidth("weeklyStepsFill", weekly.steps, 5);
  setWidth("weeklyCardioFill", weekly.cardio, 1);

  const goalsDone = [weekly.strength >= 3, weekly.steps >= 5, weekly.cardio >= 1].filter(Boolean).length;
  setText("weeklyChestStatus", goalsDone === 3 ? "Åpnet denne uken ✓" : `${3 - goalsDone} mål gjenstår`);

  const campButton = document.getElementById("campClaimBtn");
  if (campButton) campButton.disabled = campStored < 1;

  renderQuestRows(document.getElementById("dailyQuestList"));
  renderQuestRows(document.getElementById("questPageDailyList"));
  renderGear();
  renderAchievements();
}

function showGameToast(message) {
  const toast = document.getElementById("gameToast");
  if (!toast) return;
  clearTimeout(gameToastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  gameToastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openWeightEntry() {
  weighInFromApp = true;
  editingToday = !!getTodayEntry();
  render();
  setTimeout(() => {
    weightInput?.focus();
    weightInput?.select();
  }, 50);
}

function setActivePage(page) {
  activePage = page;
  document.querySelectorAll(".app-page").forEach(section => {
    section.classList.toggle("active", section.dataset.page === page);
  });
  document.querySelectorAll(".game-nav").forEach(button => {
    button.classList.toggle("active", button.dataset.target === page);
  });

  if (page === "progress") {
    requestAnimationFrame(() => requestAnimationFrame(renderChart));
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindGameEvents() {
  document.querySelectorAll(".game-nav").forEach(button => {
    button.addEventListener("click", () => setActivePage(button.dataset.target));
  });

  document.addEventListener("click", event => {
    const questButton = event.target.closest("[data-quest-id]");
    if (questButton) {
      completeQuest(questButton.dataset.questId);
      return;
    }

    const gearButton = event.target.closest("[data-gear-id]");
    if (gearButton) {
      upgradeGear(gearButton.dataset.gearId);
    }
  });

  document.getElementById("campClaimBtn")?.addEventListener("click", claimCampReward);
  document.getElementById("notificationShortcutBtn")?.addEventListener("click", () => settingsBtn?.click());
}

bindGameEvents();

/* ================================= */
/* RENDER */
/* ================================= */

function render() {
  renderDate();

  renderView();

  if (!currentUser) {
    return;
  }

  accountEmail.textContent =
    currentUser.email ??
    "";

  renderDashboard();

  renderHistory();

  renderInsights();

  renderGame();

  setActivePage(activePage);

  if (
    !dashboardView.classList.contains("hidden") &&
    activePage === "progress"
  ) {
    requestAnimationFrame(renderChart);
  }
}

/* ================================= */
/* NEW DAY CHECK */
/* ================================= */

async function checkForNewDay() {
  const today =
    getToday();

  if (
    today ===
    lastKnownDate
  ) {
    return;
  }

  lastKnownDate =
    today;

  editingToday =
    false;

  closeAllModals();

  if (!currentUser) {
    renderDate();

    return;
  }

  showLoading();

  await loadUserData();

  render();
}

/* ================================= */
/* AUTH EVENTS */
/* ================================= */

loginBtn.addEventListener(
  "click",
  login
);

signupBtn.addEventListener(
  "click",
  signup
);

authPassword.addEventListener(
  "keydown",
  event => {
    if (
      event.key ===
      "Enter"
    ) {
      login();
    }
  }
);

logoutBtn.addEventListener(
  "click",
  logout
);

/* ================================= */
/* WEIGHT EVENTS */
/* ================================= */

saveWeightBtn.addEventListener(
  "click",
  saveWeight
);

weightInput.addEventListener(
  "keydown",
  event => {
    if (
      event.key ===
      "Enter"
    ) {
      saveWeight();
    }
  }
);

editWeightBtn.addEventListener(
  "click",
  openWeightEntry
);

cancelEditBtn.addEventListener(
  "click",
  () => {
    editingToday = false;
    weighInFromApp = false;
    render();
  }
);

/* ================================= */
/* HISTORY EVENTS */
/* ================================= */

historyBtn.addEventListener(
  "click",
  () => {
    renderHistory();

    historyModal.classList.remove(
      "hidden"
    );
  }
);

closeHistoryBtn.addEventListener(
  "click",
  () => {
    historyModal.classList.add(
      "hidden"
    );
  }
);

historyModal.addEventListener(
  "click",
  event => {
    if (
      event.target ===
      historyModal
    ) {
      historyModal.classList.add(
        "hidden"
      );
    }
  }
);

/* ================================= */
/* INSIGHTS EVENTS */
/* ================================= */

insightsBtn.addEventListener(
  "click",
  () => {
    renderInsights();

    insightsModal.classList.remove(
      "hidden"
    );
  }
);

closeInsightsBtn.addEventListener(
  "click",
  () => {
    insightsModal.classList.add(
      "hidden"
    );
  }
);

insightsModal.addEventListener(
  "click",
  event => {
    if (
      event.target ===
      insightsModal
    ) {
      insightsModal.classList.add(
        "hidden"
      );
    }
  }
);

/* ================================= */
/* SETTINGS EVENTS */
/* ================================= */

settingsBtn.addEventListener(
  "click",
  () => {
    startWeightInput.value =
      settings.startWeight ??
      "";

    goalWeightInput.value =
      settings.goalWeight ??
      "";

    accountEmail.textContent =
      currentUser?.email ??
      "";

    settingsModal.classList.remove(
      "hidden"
    );

    setTimeout(
      refreshPushStatus,
      100
    );
  }
);

closeSettingsBtn.addEventListener(
  "click",
  () => {
    settingsModal.classList.add(
      "hidden"
    );
  }
);

settingsModal.addEventListener(
  "click",
  event => {
    if (
      event.target ===
      settingsModal
    ) {
      settingsModal.classList.add(
        "hidden"
      );
    }
  }
);

saveSettingsBtn.addEventListener(
  "click",
  saveSettings
);

/* ================================= */
/* MIDNIGHT / RESUME */
/* ================================= */

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.visibilityState ===
      "visible"
    ) {
      checkForNewDay();

      if (
        !settingsModal.classList.contains(
          "hidden"
        )
      ) {
        refreshPushStatus();
      }
    }
  }
);

window.addEventListener(
  "focus",
  () => {
    checkForNewDay();

    if (
      !settingsModal.classList.contains(
        "hidden"
      )
    ) {
      refreshPushStatus();
    }
  }
);

setInterval(
  checkForNewDay,
  60000
);

/* ================================= */
/* AUTH STATE */
/* ================================= */

supabaseClient
  .auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {
      setTimeout(
        async () => {
          const newUser =
            session?.user ??
            null;

          if (
            newUser?.id ===
            currentUser?.id
          ) {
            return;
          }

          currentUser =
            newUser;

          if (!currentUser) {
            profile =
              null;

            entries =
              [];

            showAuth();

            return;
          }

          showLoading();

          await loadUserData();

          render();
        },
        0
      );
    }
  );

/* ================================= */
/* PWA / SERVICE WORKER */
/* ================================= */

async function registerServiceWorker() {
  if (
    !(
      "serviceWorker"
      in navigator
    )
  ) {
    return null;
  }

  try {
    const registration =
      await navigator
        .serviceWorker
        .register(
          "./service-worker.js"
        );

    console.log(
      "Service Worker klar:",
      registration.scope
    );

    return registration;
  } catch (error) {
    console.error(
      "Service Worker feil:",
      error
    );

    return null;
  }
}

window.addEventListener(
  "load",
  registerServiceWorker
);

/* ================================= */
/* PUSH HELPERS */
/* ================================= */

function showNotificationMessage(
  message,
  isError = false
) {
  if (!notificationMessage) {
    return;
  }

  notificationMessage.textContent =
    message;

  notificationMessage.classList.toggle(
    "error",
    isError
  );
}

function urlBase64ToUint8Array(
  base64String
) {
  const padding =
    "=".repeat(
      (
        4 -
        base64String.length % 4
      ) % 4
    );

  const base64 =
    (
      base64String +
      padding
    )
      .replace(
        /-/g,
        "+"
      )
      .replace(
        /_/g,
        "/"
      );

  const rawData =
    window.atob(
      base64
    );

  const outputArray =
    new Uint8Array(
      rawData.length
    );

  for (
    let i = 0;
    i < rawData.length;
    i++
  ) {
    outputArray[i] =
      rawData.charCodeAt(
        i
      );
  }

  return outputArray;
}

function pushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/* ================================= */
/* PUSH STATUS */
/* ================================= */

async function refreshPushStatus() {
  if (
    !notificationToggleBtn ||
    !testNotificationBtn
  ) {
    return;
  }

  if (!currentUser) {
    notificationToggleBtn.disabled =
      true;

    testNotificationBtn.disabled =
      true;

    return;
  }

  if (!pushSupported()) {
    notificationToggleBtn.disabled =
      true;

    testNotificationBtn.disabled =
      true;

    showNotificationMessage(
      "Pushvarsler støttes ikke her. Åpne appen fra Hjem-skjermen på iPhone.",
      true
    );

    return;
  }

  notificationToggleBtn.disabled =
    true;

  testNotificationBtn.disabled =
    true;

  try {
    const registration =
      await navigator
        .serviceWorker
        .ready;

    const subscription =
      await registration
        .pushManager
        .getSubscription();

    if (subscription) {
      notificationToggleBtn.textContent =
        "Aktiv";

      notificationToggleBtn
        .classList
        .add(
          "active"
        );

      notificationToggleBtn.disabled =
        false;

      testNotificationBtn.disabled =
        false;

      testNotificationBtn.removeAttribute(
        "disabled"
      );

      showNotificationMessage(
        "Varsler er aktivert 🌿"
      );
    } else {
      notificationToggleBtn.textContent =
        "Aktiver";

      notificationToggleBtn
        .classList
        .remove(
          "active"
        );

      notificationToggleBtn.disabled =
        false;

      testNotificationBtn.disabled =
        true;

      showNotificationMessage(
        ""
      );
    }
  } catch (error) {
    console.error(
      "Push status error:",
      error
    );

    notificationToggleBtn.disabled =
      false;

    testNotificationBtn.disabled =
      true;

    showNotificationMessage(
      "Kunne ikke lese varslingsstatus.",
      true
    );
  }
}

/* ================================= */
/* ENABLE PUSH */
/* ================================= */

async function enablePushNotifications() {
  if (!currentUser) {
    return;
  }

  if (!pushSupported()) {
    showNotificationMessage(
      "Varsler er ikke tilgjengelige på denne enheten.",
      true
    );

    return;
  }

  notificationToggleBtn.disabled =
    true;

  testNotificationBtn.disabled =
    true;

  showNotificationMessage(
    "Aktiverer..."
  );

  try {
    const permission =
      await Notification
        .requestPermission();

    if (
      permission !==
      "granted"
    ) {
      showNotificationMessage(
        "Du må tillate varsler for Vekt.",
        true
      );

      notificationToggleBtn.disabled =
        false;

      return;
    }

    const registration =
      await navigator
        .serviceWorker
        .ready;

    let subscription =
      await registration
        .pushManager
        .getSubscription();

    if (!subscription) {
      subscription =
        await registration
          .pushManager
          .subscribe({
            userVisibleOnly:
              true,

            applicationServerKey:
              urlBase64ToUint8Array(
                PUSH_VAPID_PUBLIC_KEY
              )
          });
    }

    const json =
      subscription.toJSON();

    if (
      !json.keys?.p256dh ||
      !json.keys?.auth
    ) {
      throw new Error(
        "Push-abonnement mangler nøkler."
      );
    }

    const {
      error
    } =
      await supabaseClient
        .from(
          "push_subscriptions"
        )
        .upsert(
          {
            user_id:
              currentUser.id,

            endpoint:
              subscription.endpoint,

            p256dh:
              json.keys.p256dh,

            auth:
              json.keys.auth
          },
          {
            onConflict:
              "user_id,endpoint"
          }
        );

    if (error) {
      throw error;
    }

    showNotificationMessage(
      "Varsler er aktivert 🌿"
    );

    await refreshPushStatus();

    /* Ekstra sikkerhet for å låse opp testknappen */
    testNotificationBtn.disabled =
      false;

    testNotificationBtn.removeAttribute(
      "disabled"
    );
  } catch (error) {
    console.error(
      "Enable push error:",
      error
    );

    showNotificationMessage(
      "Kunne ikke aktivere varsler.",
      true
    );

    testNotificationBtn.disabled =
      true;
  }

  notificationToggleBtn.disabled =
    false;
}

/* ================================= */
/* DISABLE PUSH */
/* ================================= */

async function disablePushNotifications() {
  if (!currentUser) {
    return;
  }

  notificationToggleBtn.disabled =
    true;

  testNotificationBtn.disabled =
    true;

  try {
    const registration =
      await navigator
        .serviceWorker
        .ready;

    const subscription =
      await registration
        .pushManager
        .getSubscription();

    if (subscription) {
      const {
        error
      } =
        await supabaseClient
          .from(
            "push_subscriptions"
          )
          .delete()
          .eq(
            "endpoint",
            subscription.endpoint
          );

      if (error) {
        throw error;
      }

      await subscription
        .unsubscribe();
    }

    showNotificationMessage(
      "Varsler er slått av."
    );

    await refreshPushStatus();
  } catch (error) {
    console.error(
      "Disable push error:",
      error
    );

    showNotificationMessage(
      "Kunne ikke slå av varsler.",
      true
    );
  }

  notificationToggleBtn.disabled =
    false;
}

/* ================================= */
/* TOGGLE */
/* ================================= */

async function togglePushNotifications() {
  if (!pushSupported()) {
    showNotificationMessage(
      "Varsler er ikke tilgjengelige her.",
      true
    );

    return;
  }

  const registration =
    await navigator
      .serviceWorker
      .ready;

  const subscription =
    await registration
      .pushManager
      .getSubscription();

  if (subscription) {
    await disablePushNotifications();
  } else {
    await enablePushNotifications();
  }
}

/* ================================= */
/* TEST PUSH */
/* ================================= */

async function sendTestNotification() {
  if (!currentUser) {
    return;
  }

  testNotificationBtn.disabled =
    true;

  testNotificationBtn.textContent =
    "Sender...";

  showNotificationMessage(
    "Sender testvarsel..."
  );

  try {
    const registration =
      await navigator
        .serviceWorker
        .ready;

    const subscription =
      await registration
        .pushManager
        .getSubscription();

    if (!subscription) {
      throw new Error(
        "Ingen push subscription finnes."
      );
    }

    const {
      data,
      error
    } =
      await supabaseClient
        .functions
        .invoke(
          "send-test-push",
          {
            body: {}
          }
        );

    if (error) {
      throw error;
    }

    if (
      !data ||
      data.sent < 1
    ) {
      throw new Error(
        "Ingen varsler ble sendt."
      );
    }

    showNotificationMessage(
      "Testvarsel sendt ✓"
    );
  } catch (error) {
    console.error(
      "Test push error:",
      error
    );

    showNotificationMessage(
      "Testvarselet kunne ikke sendes.",
      true
    );
  }

  testNotificationBtn.textContent =
    "Send testvarsel";

  /* Hvis abonnement fortsatt finnes, gjør knappen aktiv igjen */
  try {
    const registration =
      await navigator
        .serviceWorker
        .ready;

    const subscription =
      await registration
        .pushManager
        .getSubscription();

    testNotificationBtn.disabled =
      !subscription;
  } catch {
    testNotificationBtn.disabled =
      true;
  }
}

/* ================================= */
/* PUSH EVENTS */
/* ================================= */

notificationToggleBtn
  ?.addEventListener(
    "click",
    togglePushNotifications
  );

testNotificationBtn
  ?.addEventListener(
    "click",
    sendTestNotification
  );

/* ================================= */
/* START APP */
/* ================================= */

async function init() {
  showLoading();

  renderDate();

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getSession();

  if (error) {
    console.error(
      error
    );
  }

  currentUser =
    data.session?.user ??
    null;

  if (!currentUser) {
    showAuth();

    return;
  }

  await loadUserData();

  render();
}

init();
