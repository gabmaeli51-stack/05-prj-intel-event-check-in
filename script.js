// 1. DOM Elements Selection
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingDisplay = document.getElementById("greeting");
const totalCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// Team Counter Elements
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const attendeeListDisplay = document.getElementById("attendeeList");

// 2. Application State Variables (With LocalStorage LevelUp integration)
const ATTENDANCE_GOAL = 50;

let totalAttendees = parseInt(localStorage.getItem("totalAttendees")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0
};
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

// Helper mapping for human-readable team labels
const teamLabels = {
  water: "Team Water Wise 🌊",
  zero: "Team Net Zero 🌿",
  power: "Team Renewables ⚡"
};

// 3. Initialize UI data on page load
function initializeApp() {
  updateUI();
  renderAttendeeList();
  checkGoalCelebration();
}

// 4. Update stats and progress bar on screen
function updateUI() {
  // Update numbers
  totalCountDisplay.textContent = totalAttendees;
  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  // Calculate and update progress bar percentage
  const percentage = Math.min((totalAttendees / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = percentage + "%";
}

// Render the Attendee List to the screen
function renderAttendeeList() {
  if (!attendeeListDisplay) return;
  attendeeListDisplay.innerHTML = "";
  
  // Display names in reverse order so newest shows at the top
  attendeeList.slice().reverse().forEach(attendee => {
    const li = document.createElement("li");
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #f1f5f9";
    li.style.fontSize = "15px";
    li.innerHTML = `<strong>${attendee.name}</strong> joined <span style="color: #0071c5;">${teamLabels[attendee.team]}</span>`;
    attendeeListDisplay.appendChild(li);
  });
}

// 5. Check if Goal is met (Celebration Feature LevelUp)
function checkGoalCelebration() {
  if (totalAttendees >= ATTENDANCE_GOAL) {
    // Find the team with the highest turnout
    let winningTeam = "water";
    if (teamCounts.zero > teamCounts[winningTeam]) winningTeam = "zero";
    if (teamCounts.power > teamCounts[winningTeam]) winningTeam = "power";

    greetingDisplay.style.display = "block";
    greetingDisplay.className = "success-message";
    greetingDisplay.style.border = "2px dashed #22c55e";
    greetingDisplay.innerHTML = `🎉 <strong>Goal Reached!</strong> The Sustainability Summit is officially full with ${totalAttendees} attendees! Current Leader: <strong>${teamLabels[winningTeam]}</strong>!`;
  }
}

// 6. Form Submission Event Listener
checkInForm.addEventListener("submit", function (event) {
  // Prevent default page refresh
  event.preventDefault();

  // Extract cleaned input text and values
  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (!name || !selectedTeam) return;

  // Increment metrics
  totalAttendees++;
  teamCounts[selectedTeam]++;
  
  // Append new record to array state
  attendeeList.push({ name: name, team: selectedTeam });

  // Commit progress state to browser local storage
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));

  // Visual text update: Personalised greeting display
  greetingDisplay.style.display = "block";
  greetingDisplay.className = "success-message";
  greetingDisplay.innerHTML = `👋 Welcome, <strong>${name}</strong>! Thanks for checking in to support <strong>${teamLabels[selectedTeam]}</strong>.`;

  // Sync and render fresh interface values
  updateUI();
  renderAttendeeList();
  checkGoalCelebration();

  // Reset form inputs completely for the next employee
  checkInForm.reset();
});

// Run initialization routine on load
initializeApp();