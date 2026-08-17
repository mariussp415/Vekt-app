const weighInView =
  document.getElementById("weighInView");

const dashboardView =
  document.getElementById("dashboardView");

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


const historyBtn =
  document.getElementById("historyBtn");

const historyModal =
  document.getElementById("historyModal");

const closeHistoryBtn =
  document.getElementById("closeHistoryBtn");

const historyList =
  document.getElementById("historyList");


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


let weightChart;

let editingToday = false;


/*
  TESTMODUS

  Ingenting lagres permanent ennå.
  Refresh = helt ny start.
*/

let entries = [];

let settings = {
  startWeight: null,
  goalWeight: null
};


/* ================================= */
/* DATE */
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


function getTodayEntry() {

  return entries.find(
    entry =>
      entry.date ===
      getToday()
  );

}


/* ================================= */
/* VIEW */
/* ================================= */

function renderView() {

  const todayEntry =
    getTodayEntry();


  if (
    !todayEntry ||
    editingToday
  ) {

    weighInView
      .classList
      .remove(
        "hidden"
      );


    dashboardView
      .classList
      .add(
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


  weighInView
    .classList
    .add(
      "hidden"
    );


  dashboardView
    .classList
    .remove(
      "hidden"
    );

}


/* ================================= */
/* SAVE WEIGHT */
/* ================================= */

function saveWeight() {

  const weight =
    parseFloat(
      weightInput.value
        .replace(
          ",",
          "."
        )
    );


  if (
    !weight ||
    weight < 30 ||
    weight > 300
  ) {

    alert(
      "Skriv inn en gyldig vekt."
    );

    return;

  }


  const existing =
    getTodayEntry();


  if (existing) {

    existing.weight =
      weight;

  } else {

    entries.push({
      date:
        getToday(),

      weight
    });

  }


  entries.sort(
    (a, b) =>
      parseDate(a.date) -
      parseDate(b.date)
  );


  if (
    settings.startWeight === null
  ) {

    settings.startWeight =
      weight;

  }


  editingToday =
    false;


  render();

}


/* ================================= */
/* STREAK */
/* ================================= */

function calculateCurrentStreak() {

  if (!entries.length) {

    return 0;

  }


  let streak = 1;


  for (
    let i =
      entries.length - 1;

    i > 0;

    i--
  ) {

    if (
      daysBetween(
        entries[i - 1].date,
        entries[i].date
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


  let longest = 1;

  let current = 1;


  for (
    let i = 1;

    i < entries.length;

    i++
  ) {

    if (
      daysBetween(
        entries[i - 1].date,
        entries[i].date
      ) === 1
    ) {

      current++;


      longest =
        Math.max(
          longest,
          current
        );

    } else {

      current = 1;

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
    entries.slice(-7);


  const average =
    lastSeven.reduce(
      (sum, entry) =>
        sum + entry.weight,
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


  let progress = 0;

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
      entries.length
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
    STATUS UNDER WEIGHT
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
    NO GOAL
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


  /*
    GOAL EXISTS
  */

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
/* INSIGHTS */
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
    candidate === latest
  ) {

    return null;

  }


  return (
    latest.weight -
    candidate.weight
  );

}


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
      changeOverDays(7)
    );


  insight30Days.textContent =
    formatChange(
      changeOverDays(30)
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


  /*
    GOAL FORECAST
  */

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
    Math.abs(pace);


  const prediction =
    new Date();


  prediction.setDate(
    prediction.getDate() +
    Math.round(
      weeksRemaining *
      7
    )
  );


  const text =
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
    `Med dagens tempo er estimert måldato rundt ${text}.`;

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
                  onclick="deleteEntry('${entry.date}')"
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


function deleteEntry(date) {

  entries =
    entries.filter(
      entry =>
        entry.date !==
        date
    );


  editingToday =
    false;


  historyModal
    .classList
    .add(
      "hidden"
    );


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
      entry => {

        const date =
          parseDate(
            entry.date
          );


        return date
          .toLocaleDateString(
            "nb-NO",
            {
              day:
                "numeric",

              month:
                "short"
            }
          );

      }
    );


  const weights =
    entries.map(
      entry =>
        entry.weight
    );


  const averages =
    entries.map(
      (entry, index) => {

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
            (sum, item) =>
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


  if (
    weightChart
  ) {

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
                  "#788475",

                callback:
                  value =>
                    `${value}`

              }

            }

          }

        }

      }
    );

}


/* ================================= */
/* RENDER */
/* ================================= */

function render() {

  renderDate();

  renderView();

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
/* EVENTS */
/* ================================= */

saveWeightBtn
  .addEventListener(
    "click",
    saveWeight
  );


weightInput
  .addEventListener(
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


/* EDIT */

editWeightBtn
  .addEventListener(
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


cancelEditBtn
  .addEventListener(
    "click",
    () => {

      editingToday =
        false;


      render();

    }
  );


/* HISTORY */

historyBtn
  .addEventListener(
    "click",
    () => {

      renderHistory();


      historyModal
        .classList
        .remove(
          "hidden"
        );

    }
  );


closeHistoryBtn
  .addEventListener(
    "click",
    () => {

      historyModal
        .classList
        .add(
          "hidden"
        );

    }
  );


historyModal
  .addEventListener(
    "click",
    event => {

      if (
        event.target ===
        historyModal
      ) {

        historyModal
          .classList
          .add(
            "hidden"
          );

      }

    }
  );


/* INSIGHTS */

insightsBtn
  .addEventListener(
    "click",
    () => {

      renderInsights();


      insightsModal
        .classList
        .remove(
          "hidden"
        );

    }
  );


closeInsightsBtn
  .addEventListener(
    "click",
    () => {

      insightsModal
        .classList
        .add(
          "hidden"
        );

    }
  );


insightsModal
  .addEventListener(
    "click",
    event => {

      if (
        event.target ===
        insightsModal
      ) {

        insightsModal
          .classList
          .add(
            "hidden"
          );

      }

    }
  );


/* SETTINGS */

settingsBtn
  .addEventListener(
    "click",
    () => {

      startWeightInput.value =
        settings.startWeight ??
        "";


      goalWeightInput.value =
        settings.goalWeight ??
        "";


      settingsModal
        .classList
        .remove(
          "hidden"
        );

    }
  );


closeSettingsBtn
  .addEventListener(
    "click",
    () => {

      settingsModal
        .classList
        .add(
          "hidden"
        );

    }
  );


settingsModal
  .addEventListener(
    "click",
    event => {

      if (
        event.target ===
        settingsModal
      ) {

        settingsModal
          .classList
          .add(
            "hidden"
          );

      }

    }
  );


saveSettingsBtn
  .addEventListener(
    "click",
    () => {

      const start =
        parseFloat(
          startWeightInput.value
        );


      const goal =
        parseFloat(
          goalWeightInput.value
        );


      settings.startWeight =
        Number.isFinite(
          start
        )
          ? start
          : settings.startWeight;


      settings.goalWeight =
        Number.isFinite(
          goal
        )
          ? goal
          : null;


      settingsModal
        .classList
        .add(
          "hidden"
        );


      render();

    }
  );


/* START */

render();