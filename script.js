/* =========================================================
   MIN REISE
   Supabase + ekte lagring
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
  document.getElementById(
    "insightLongestStreak"
  );

const insightLost =
  document.getElementById("insightLost");

const insightProgress =
  document.getElementById(
    "insightProgress"
  );

const goalPrediction =
  document.getElementById(
    "goalPrediction"
  );


/* ================================= */
/* SETTINGS */
/* ================================= */

const settingsBtn =
  document.getElementById("settingsBtn");

const settingsModal =
  document.getElementById("settingsModal");

const closeSettingsBtn =
  document.getElementById(
    "closeSettingsBtn"
  );

const saveSettingsBtn =
  document.getElementById(
    "saveSettingsBtn"
  );

const startWeightInput =
  document.getElementById(
    "startWeightInput"
  );

const goalWeightInput =
  document.getElementById(
    "goalWeightInput"
  );


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
    )
      .padStart(
        2,
        "0"
      );


  const day =
    String(
      now.getDate()
    )
      .padStart(
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
          weekday:
            "long",

          day:
            "numeric",

          month:
            "long"
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

  loadingView.classList.add(
    "hidden"
  );

  authView.classList.add(
    "hidden"
  );

  weighInView.classList.add(
    "hidden"
  );

  dashboardView.classList.add(
    "hidden"
  );

}


function showLoading() {

  hideMainViews();

  loadingView.classList.remove(
    "hidden"
  );

}


function showAuth() {

  hideMainViews();

  authView.classList.remove(
    "hidden"
  );

}


function closeAllModals() {

  historyModal.classList.add(
    "hidden"
  );

  insightsModal.classList.add(
    "hidden"
  );

  settingsModal.classList.add(
    "hidden"
  );

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
    authEmail.value
      .trim();


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


  loginBtn.disabled =
    true;


  loginBtn.textContent =
    "Logger inn...";


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


  loginBtn.disabled =
    false;


  loginBtn.textContent =
    "Logg inn";


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
    authEmail.value
      .trim();


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


  signupBtn.disabled =
    true;


  signupBtn.textContent =
    "Oppretter...";


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


  signupBtn.disabled =
    false;


  signupBtn.textContent =
    "Opprett bruker";


  if (error) {

    showAuthMessage(
      error.message,
      true
    );

    return;

  }


  /*
    Hvis email confirmation er aktivert,
    får vi normalt ingen session før
    brukeren har trykket linken i mailen.
  */

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

  logoutBtn.disabled =
    true;


  await supabaseClient
    .auth
    .signOut();


  logoutBtn.disabled =
    false;


  currentUser =
    null;


  profile =
    null;


  entries =
    [];


  settings = {
    startWeight: null,
    goalWeight: null
  };


  editingToday =
    false;


  closeAllModals();


  authPassword.value =
    "";


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


  const todayEntry =
    getTodayEntry();


  if (
    !todayEntry ||
    editingToday
  ) {

    hideMainViews();


    weighInView
      .classList
      .remove(
        "hidden"
      );


    if (
      todayEntry &&
      editingToday
    ) {

      weighInTitle.textContent =
        "Endre vekten.";


      weightQuestion.textContent =
        "Oppdater dagens innveiing.";


      weightInput.value =
        todayEntry.weight;


      saveWeightBtn.textContent =
        "Lagre endring";


      cancelEditBtn
        .classList
        .remove(
          "hidden"
        );

    } else {

      weighInTitle.textContent =
        "God morgen.";


      weightQuestion.textContent =
        "Hva veier du i dag?";


      weightInput.value =
        "";


      saveWeightBtn.textContent =
        "Registrer";


      cancelEditBtn
        .classList
        .add(
          "hidden"
        );

    }


    return;

  }


  hideMainViews();


  dashboardView
    .classList
    .remove(
      "hidden"
    );

}


/* ================================= */
/* SAVE WEIGHT */
/* ================================= */

async function saveWeight() {

  if (!currentUser) {

    return;

  }


  const weight =
    parseFloat(
      weightInput.value
        .replace(
          ",",
          "."
        )
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


  saveWeightBtn.disabled =
    true;


  const originalText =
    saveWeightBtn.textContent;


  saveWeightBtn.textContent =
    "Lagrer...";


  const today =
    getToday();


  const existing =
    getTodayEntry();


  /*
    Første innveiing noensinne:
    dette blir starten på reisen.
  */

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


  /*
    Oppdater eller legg til dagens vekt.
  */

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


  /*
    Hvis profilen eksisterer,
    men mangler startvekt.
  */

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


  /*
    Hvis siste registrering er eldre
    enn i går, er streaken brutt.
  */

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


  /*
    Tekst under hovedvekten.
  */

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


  /*
    Ingen målvekt.
  */

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


  if (
    !dashboardView
      .classList
      .contains(
        "hidden"
      )
  ) {

    requestAnimationFrame(
      renderChart
    );

  }

}


/* ================================= */
/* NEW DAY CHECK */
/* ================================= */

async function checkForNewDay() {

  const today =
    getToday();


  if (
    today === lastKnownDate
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
  () => {

    editingToday =
      true;


    render();


    setTimeout(
      () => {

        weightInput.focus();

        weightInput.select();

      },
      50
    );

  }
);


cancelEditBtn.addEventListener(
  "click",
  () => {

    editingToday =
      false;


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

    }

  }
);


window.addEventListener(
  "focus",
  checkForNewDay
);


/*
  Hvis appen faktisk står åpen over
  midnatt, sjekker vi hvert minutt.
*/

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

      /*
        setTimeout unngår at vi gjør
        databasekall direkte inne i
        Auth-callbacken.
      */

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