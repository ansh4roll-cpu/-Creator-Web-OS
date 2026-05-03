function openApp(app) {
  let content = "";

  if (app === "script") {
    content = `
      <textarea placeholder="Enter anything"></textarea><br><br>
      <button onclick="generateContent(this,'script')">Generate Script</button>
      <pre></pre>
    `;
  }

  if (app === "video") {
    content = `
      <textarea placeholder="Enter anything"></textarea><br><br>
      <button onclick="generateVideo(this)" style="background-color: #ff0000; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 50px; border: none; cursor: pointer;">▶ PLAY VIDEO</button>

      <div class="scenes"></div><br>
      <div class="video-container"></div>
    `;
  }

  document.getElementById("window").innerHTML = content;
}

// ✍️ Script
async function generateContent(btn, type) {
  const output = btn.parentElement.querySelector("pre");
  const input = btn.parentElement.querySelector("textarea").value;

  const res = await fetch("/generate-content", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ type, input })
  });

  const data = await res.json();
  output.innerText = data.output;
}

// 🎨 Scenes
async function generateScenes(btn) {
  const story = btn.parentElement.querySelector("textarea").value;
  const output = btn.parentElement.querySelector(".scenes");

  const res = await fetch("/generate-scenes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ story })
  });

  const data = await res.json();

  output.innerHTML = data.scenes.map(s =>
    `<p>Scene ${s.scene}: ${s.text}</p>`
  ).join("");
}

// 🎬 Video
async function generateVideo(btn) {
  const videoContainer = btn.parentElement.querySelector(".video-container");

  const res = await fetch("/generate-video", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({})
  });

  const data = await res.json();
  videoContainer.innerHTML = data.videoEmbed;
}
function searchApps() {
  const value = document.getElementById("search").value.toLowerCase();
  const buttons = document.querySelectorAll(".apps button");

  buttons.forEach(btn => {
    if (btn.innerText.toLowerCase().includes(value)) {
      btn.style.display = "inline-block";
    } else {
      btn.style.display = "none";
    }
  });
}
const apps = ["script", "video"];

function toggleSpotlight() {
  const box = document.getElementById("spotlight");
  box.classList.toggle("hidden");

  if (!box.classList.contains("hidden")) {
    document.getElementById("spotlightInput").focus();
    showAllApps();
  }
}

// 🔥 Ctrl + K shortcut
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    toggleSpotlight();
  }
});

function showAllApps() {
  const results = document.getElementById("results");
  results.innerHTML = apps.map(a =>
    `<div onclick="openFromSearch('${a}')">${a}</div>`
  ).join("");
}

function filterApps() {
  const value = document.getElementById("spotlightInput").value.toLowerCase();
  const results = document.getElementById("results");

  const filtered = apps.filter(app => app.includes(value));

  results.innerHTML = filtered.map(a =>
    `<div onclick="openFromSearch('${a}')">${a}</div>`
  ).join("");
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const value = document.getElementById("spotlightInput").value.toLowerCase();
    const match = apps.find(app => app.includes(value));

    if (match) {
      openFromSearch(match);
    }
  }
}

function openFromSearch(app) {
  toggleSpotlight();

  let content = "";

  if (app === "script") {
    content = `
      <textarea placeholder="Enter anything"></textarea><br><br>
      <button onclick="generateContent(this,'script')">Generate Script</button>
      <pre></pre>
    `;
  }

  if (app === "video") {
    content = `
      <textarea placeholder="Enter anything"></textarea><br><br>
      <button onclick="generateVideo(this)" style="background-color: #ff0000; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 50px; border: none; cursor: pointer;">▶ PLAY VIDEO</button>

      <div class="scenes"></div><br>
      <div class="video-container"></div>
    `;
  }

  createWindow(app.toUpperCase(), content);
}
function createWindow(title, content) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="window-header">
      <span>${title}</span>
      <button onclick="this.parentElement.parentElement.remove()">❌</button>
    </div>
    <div class="window-body">
      ${content}
    </div>
  `;

  document.body.appendChild(win);

  makeDraggable(win);
}

function makeDraggable(win) {
  const header = win.querySelector(".window-header");

  let offsetX = 0, offsetY = 0, isDown = false;

  header.onmousedown = (e) => {
    isDown = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  };

  document.onmousemove = (e) => {
    if (isDown) {
      win.style.left = (e.clientX - offsetX) + "px";
      win.style.top = (e.clientY - offsetY) + "px";
    }
  };

  document.onmouseup = () => {
    isDown = false;
  };
}