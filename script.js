const maxAttendees = 15;
const storageKey = "eventCheckInData";
const checkInForm = document.getElementById("checkInForm");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const celebration = document.getElementById("celebration");
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables"
};
let attendanceData = {
  attendeeCount: 0,
  teamCounts: {
    water: 0,
    zero: 0,
    power: 0
  },
  attendees: []
};

const savedAttendanceData = localStorage.getItem(storageKey);
if (savedAttendanceData) {
  attendanceData = JSON.parse(savedAttendanceData);
}

function updateAttendanceDisplay() {
  attendeeCountDisplay.textContent = attendanceData.attendeeCount;
  progressBar.style.width = `${Math.min((attendanceData.attendeeCount / maxAttendees) * 100, 100)}%`;

  document.getElementById("waterCount").textContent = attendanceData.teamCounts.water;
  document.getElementById("zeroCount").textContent = attendanceData.teamCounts.zero;
  document.getElementById("powerCount").textContent = attendanceData.teamCounts.power;

  attendeeList.textContent = "";
  attendanceData.attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    const name = document.createElement("span");
    const team = document.createElement("span");

    name.textContent = attendee.name;
    team.textContent = teamNames[attendee.team];
    listItem.append(name, team);
    attendeeList.appendChild(listItem);
  });

  if (attendanceData.attendeeCount >= maxAttendees) {
    const highestTeamCount = Math.max(
      attendanceData.teamCounts.water,
      attendanceData.teamCounts.zero,
      attendanceData.teamCounts.power
    );
    const winningTeams = Object.keys(teamNames).filter(function (team) {
      return attendanceData.teamCounts[team] === highestTeamCount;
    });

    celebration.textContent = `Goal reached! Congratulations to `;
    winningTeams.forEach(function (team, index) {
      if (index > 0) {
        celebration.append(document.createTextNode(index === winningTeams.length - 1 ? " and " : ", "));
      }

      const winningTeamName = document.createElement("strong");
      winningTeamName.textContent = teamNames[team];
      celebration.appendChild(winningTeamName);
    });
    celebration.append(document.createTextNode("!"));
    celebration.style.display = "block";
  }
}

updateAttendanceDisplay();

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = document.getElementById("attendeeName").value;
  const teamSelect = document.getElementById("teamSelect");
  const selectedTeam = teamSelect.value;
  const teamName = teamSelect.options[teamSelect.selectedIndex].text;

  attendanceData.attendeeCount += 1;
  attendanceData.teamCounts[selectedTeam] += 1;
  attendanceData.attendees.push({
    name: attendeeName,
    team: selectedTeam
  });
  localStorage.setItem(storageKey, JSON.stringify(attendanceData));

  updateAttendanceDisplay();

  greeting.textContent = `Welcome, ${attendeeName}! You are checked in with ${teamName}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  checkInForm.reset();
});
