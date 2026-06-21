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

// Custom Team Meta Map (Names + CSS Colors matching your new style)
const teamConfig = {
  water: { label: "Team Water Wise 🌊", color: "#0071c5" }, // Intel Blue
  zero: { label: "Team Net Zero 🌿", color: "#059669" },  // Emerald Green
  power: { label: "Team Renewables ⚡", color: "#db2777" }  // Premium Pink
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

// LevelUp: Render list elements with dynamic matching team colors!
function renderAttendeeList() {
  if (!attendeeListDisplay) return;
  attendeeListDisplay.innerHTML = "";
  
  attendeeList.slice().reverse().forEach(attendee => {
    const li = document.createElement("li");
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
    li.style.fontSize = "15px";
    
    // Grabs the exact hex color from our team configuration map above
    const teamColor = teamConfig[attendee.team]?.color || "#ffffff";
    const teamName = teamConfig[attendee.team]?.label || attendee.team;

    li.innerHTML = `<strong>${attendee.name}</strong> joined <span style="color: ${teamColor}; font-weight: 600;">${teamName}</span>`;
    attendeeListDisplay.appendChild(li);
  });
}

// LevelUp: Full Screen Emoji Confetti Burst
function triggerConfettiBurst() {
  const emojis = ["🎉", "✨", "🌸", "⚡", "🌿", "🌊", "🥳", "💫", "💖"];
  
  for (let i = 0; i < 75; i++) {
    const confetti = document.createElement("div");
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-5vh";
    confetti.style.fontSize = Math.random() * 20 + 15 + "px";
    confetti.style.zIndex = "9999";
    confetti.style.pointerEvents = "none";
    confetti.style.userSelect = "none";
    
    // CSS Keyframe Fall Animation injected inline
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = `transform ${Math.random() * 3 + 2}s linear, top ${Math.random() * 3 + 2}s linear`;
    
    document.body.appendChild(confetti);

    // Force reflow to trigger transition animation natively
    setTimeout(() => {
      confetti.style.top = "105vh";
      confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
    }, 50);

    // Cleanup elements from DOM when finished falling
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

function checkGoalCelebration() {
  if (totalAttendees >= ATTENDANCE_GOAL) {
    let winningTeam = "water";
    if (teamCounts.zero > teamCounts[winningTeam]) winningTeam = "zero";
    if (teamCounts.power > teamCounts[winningTeam]) winningTeam = "power";

    greetingDisplay.style.display = "block";
    greetingDisplay.className = "success-message";
    greetingDisplay.style.border = "2px dashed #34d399";
    greetingDisplay.innerHTML = `🎉 <strong>Goal Reached!</strong> The Summit is full with ${totalAttendees} attendees! Current Leader: <strong>${teamConfig[winningTeam].label}</strong>!`;
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

  // Dynamic alert color matching who checked in
  const accentColor = teamConfig[selectedTeam].color;
  greetingDisplay.style.display = "block";
  greetingDisplay.className = "success-message";
  greetingDisplay.style.borderColor = accentColor;
  greetingDisplay.innerHTML = `👋 Welcome, <strong>${name}</strong>! Thanks for checking in to support <span style="color: ${accentColor}; font-weight:600;">${teamConfig[selectedTeam].label}</span>.`;

  updateUI();
  renderAttendeeList();
  
  // Trigger a fresh burst of emoji confetti every single time they hit or exceed 50!
  if (totalAttendees >= ATTENDANCE_GOAL) {
    triggerConfettiBurst();
    checkGoalCelebration();
  }
  
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