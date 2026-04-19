const QUOTES = [
    "Suffer the pain of discipline or suffer the pain of regret.",
    "He who sweats more in training bleeds less in war.",
    "If there is no struggle, there is no progress.",
    "The secret of getting ahead is getting started.",
    "A person who never made a mistake never tried anything new.",
    "That which does not kill us makes us stronger.",
    "If you're going through hell, keep going.",
    "The harder the battle, the sweeter the victory.",
    "The best revenge is massive success.",
    "Do not pray for an easy life; pray for the strength to endure a difficult one.",
    "Discipline is choosing between what you want now and what you want most.",
    "Excellence is not a destination but a continuous journey that never ends."
  ];

  const CHEAT_REWARDS = [
    "Scroll for 1 hour.",
    "Watch one episode guilt-free.",
    "Skip tomorrow's morning alarm.",
    "Eat whatever you want today.",
    "Do absolutely nothing for 30 minutes.",
    "Binge that playlist you've been saving.",
    "Order junk food. No regrets.",
    "Sleep in tomorrow. You earned it."
  ];

  let state = {
    tasks: [],
    dailyTasks: [],
    xp: 0,
    level: 1,
    completedToday: 0,
    notes: ""
  };

  function save() {
    localStorage.setItem("discipline_state", JSON.stringify(state));
  }

  function load() {
    const saved = localStorage.getItem("discipline_state");
    if (saved) state = { ...state, ...JSON.parse(saved) };
  }

  function renderQuote() {
    document.getElementById("quoteBox").textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  document.getElementById("quoteBox").addEventListener("click", renderQuote);

  function updateStats() {
    const xpNeeded = state.level * 250;
    const pct = Math.min((state.xp / xpNeeded) * 100, 100);
    document.getElementById("levelBadge").textContent = state.level;
    document.getElementById("xpLabel").textContent = state.xp + " / " + xpNeeded;
    document.getElementById("xpFill").style.width = pct + "%";
    document.getElementById("completedCount").textContent = state.completedToday;
  }

  function renderPool() {
    const el = document.getElementById("taskPool");
    if (state.tasks.length === 0) {
      el.innerHTML = '<div class="empty-msg">NO TASKS YET — ADD SOME ABOVE</div>';
      return;
    }
    el.innerHTML = state.tasks.map((t, i) =>
      '<div class="pool-item"><span>' + t + '</span><button class="delete-btn" onclick="deleteTask(' + i + ')">✕</button></div>'
    ).join("");
  }

  function renderDaily() {
    const el = document.getElementById("dailyList");
    if (state.dailyTasks.length === 0) {
      el.innerHTML = '<div class="empty-msg">NO DAILY TASKS — GENERATE FROM POOL</div>';
      return;
    }
    el.innerHTML = state.dailyTasks.map((t, i) =>
      '<div class="daily-item" onclick="completeTask(' + i + ')">' +
        '<div class="check-circle"></div>' +
        '<span class="daily-task-text">' + t + '</span>' +
        '<span class="daily-xp">+10 XP</span>' +
      '</div>'
    ).join("");
  }

  function addTask() {
    const input = document.getElementById("taskInput");
    const val = input.value.trim();
    if (!val) return;
    state.tasks.push(val);
    input.value = "";
    save();
    renderPool();
  }

  document.getElementById("taskInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTask();
  });

  function deleteTask(i) {
    state.tasks.splice(i, 1);
    save();
    renderPool();
  }

  function generateDaily() {
    if (state.tasks.length === 0) {
      alert("Add some tasks to the pool first.");
      return;
    }
    const shuffled = [...state.tasks].sort(() => 0.5 - Math.random());
    state.dailyTasks = shuffled.slice(0, Math.min(5, shuffled.length));
    save();
    renderDaily();
  }

  function completeTask(i) {
    state.xp += 10;
    state.completedToday += 1;
    const xpNeeded = state.level * 250;
    if (state.xp >= xpNeeded) {
      state.level += 1;
      const reward = CHEAT_REWARDS[Math.floor(Math.random() * CHEAT_REWARDS.length)];
      showToast("LEVEL " + state.level + " UNLOCKED");
      setTimeout(() => alert("LEVEL UP! Cheat event unlocked: " + reward), 400);
    }
    state.dailyTasks.splice(i, 1);
    save();
    updateStats();
    renderDaily();
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = "⬆ " + msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
  }

  document.getElementById("notes").addEventListener("input", function() {
    state.notes = this.value;
    save();
  });

  load();
  renderQuote();
  updateStats();
  renderPool();
  renderDaily();
  document.getElementById("notes").value = state.notes;