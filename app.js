function loadDB() {
  const data = localStorage.getItem("sofDB");
  if (data) db = JSON.parse(data);
}

function saveDB() {
  localStorage.setItem("sofDB", JSON.stringify(db));
}

// LOGIN
function login() {
  loadDB();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let user = db.users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid login");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

// APPLY
function apply() {
  loadDB();

  const username = document.getElementById("username").value;

  db.applications.push({
    id: Date.now(),
    username,
    status: "PENDING"
  });

  saveDB();
  alert("Application submitted");
}

// LOG SYSTEM
function logAction(type, username, details) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  db.logs.push({
    type,
    username,
    details,
    by: currentUser.username,
    date: new Date().toLocaleString()
  });

  saveDB();
}

// PROMOTE
function promoteUser() {
  loadDB();

  const username = document.getElementById("user").value;
  let user = db.users.find(u => u.username === username);

  if (!user) return alert("User not found");

  user.rank = "Promoted";

  logAction("PROMOTION", username, "Promoted");

  saveDB();
  alert("Done");
}

// DEMOTE
function demoteUser() {
  loadDB();

  const username = document.getElementById("user").value;
  let user = db.users.find(u => u.username === username);

  if (!user) return alert("User not found");

  user.rank = "Demoted";

  logAction("DEMOTION", username, "Demoted");

  saveDB();
  alert("Done");
}

// DISCIPLINE
function disciplineUser() {
  loadDB();

  const username = document.getElementById("user").value;
  const reason = document.getElementById("reason").value;

  db.discipline.push({ username, reason });

  logAction("DISCIPLINE", username, reason);

  saveDB();
  alert("Logged");
}

// TRANSFER
function transferUser() {
  loadDB();

  const username = document.getElementById("user").value;
  const unit = document.getElementById("unit").value;

  let user = db.users.find(u => u.username === username);

  if (!user) return;

  user.unit = unit;

  logAction("TRANSFER", username, unit);

  saveDB();
  alert("Transferred");
}

// LOAD LOGS
function loadLogs() {
  loadDB();

  const logsDiv = document.getElementById("logs");

  logsDiv.innerHTML = db.logs.map(log => `
    <p>[${log.type}] ${log.username} - ${log.details} (by ${log.by})</p>
  `).join("");
}

function loadApplications() {
  loadDB();

  const container = document.getElementById("applications");

  container.innerHTML = db.applications.map(app => `
    <div style="border:1px solid white; margin:10px; padding:10px;">
      <p><b>${app.username}</b></p>
      <p>Status: ${app.status}</p>

      <button onclick="approve(${app.id})">Approve</button>
      <button onclick="deny(${app.id})">Deny</button>
    </div>
  `).join("");
}

function approve(id) {
  loadDB();

  let app = db.applications.find(a => a.id === id);
  if (!app) return;

  // add to users
  db.users.push({
    username: app.username,
    password: "1234",
    rank: "Recruit",
    status: "Active"
  });

  app.status = "APPROVED";

  logAction("APPLICATION", app.username, "Approved");

  saveDB();
  loadApplications();
}

function deny(id) {
  loadDB();

  let app = db.applications.find(a => a.id === id);
  if (!app) return;

  app.status = "DENIED";

  logAction("APPLICATION", app.username, "Denied");

  saveDB();
  loadApplications();
}
