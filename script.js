// DOM Elements Selection
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingDisplay = document.getElementById("greeting");
const totalCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// Counters and Lists
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const attendeeListDisplay = document.getElementById("attendeeList");
const clearDataBtn = document.getElementById("clearDataBtn");

// Application Parameters & Persistent State
const ATTENDANCE_GOAL = 50;

let totalAttendees = parseInt(localStorage.getItem("totalAttendees")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

const teamLabels = {
  water: "Team Water Wise 🌊",
  zero: "Team Net Zero 🌿",
  power: "Team Renewables ⚡"
};

// Initial Sync Execution
function initializeApp() {
  updateUI();
  renderAttendeeList();
  checkGoalCelebration();
}

function updateUI() {
  totalCountDisplay.textContent = totalAttendees;
  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  const percentage = Math.min((totalAttendees / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = percentage + "%";
}

function renderAttendeeList() {
  if (!attendeeListDisplay) return;
  attendeeListDisplay.innerHTML = "";
  
  attendeeList.slice().reverse().forEach(attendee => {
    const li = document.createElement("li");
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
    li.style.fontSize = "15px";
    li.innerHTML = `<strong>${attendee.name}</strong> joined <span style="color: #34d399;">${teamLabels[attendee.team]}</span>`;
    attendeeListDisplay.appendChild(li);
  });
}

function checkGoalCelebration() {
  if (totalAttendees >= ATTENDANCE_GOAL) {
    let winningTeam = "water";
    if (teamCounts.zero > teamCounts[winningTeam]) winningTeam = "zero";
    if (teamCounts.power > teamCounts[winningTeam]) winningTeam = "power";

    greetingDisplay.style.display = "block";
    greetingDisplay.className = "success-message";
    greetingDisplay.style.border = "2px dashed #34d399";
    greetingDisplay.innerHTML = `🎉 <strong>Goal Reached!</strong> The Summit is full with ${totalAttendees} attendees! Current Leader: <strong>${teamLabels[winningTeam]}</strong>!`;
  }
}

// Form Submission Workflow
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (!name || !selectedTeam) return;

  totalAttendees++;
  teamCounts[selectedTeam]++;
  attendeeList.push({ name: name, team: selectedTeam });

  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));

  greetingDisplay.style.display = "block";
  greetingDisplay.className = "success-message";
  greetingDisplay.innerHTML = `👋 Welcome, <strong>${name}</strong>! Thanks for checking in to support <strong>${teamLabels[selectedTeam]}</strong>.`;

  updateUI();
  renderAttendeeList();
  checkGoalCelebration();
  checkInForm.reset();
});

// Wipe Mechanism Event Listener
if (clearDataBtn) {
  clearDataBtn.addEventListener("click", function () {
    localStorage.clear();

    totalAttendees = 0;
    teamCounts = { water: 0, zero: 0, power: 0 };
    attendeeList = [];

    greetingDisplay.innerHTML = "";
    greetingDisplay.style.display = "none";
    greetingDisplay.style.border = "none";

    updateUI();
    renderAttendeeList();
  });
}

initializeApp();