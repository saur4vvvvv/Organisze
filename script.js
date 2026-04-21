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


/* ================= STATE ================= */

let state = {
tasks: [],
dailyTasks: [],
xp: 0,
level: 1,
completedToday: 0,
notes: "",

firstOpenDate: null,
lastOpenDate: null,
daysUsed: 0,

streak: 0,
lastCompletedDate: null,

lastDailyGeneration: null,

achievements: []
};


/* ================= ACHIEVEMENTS ================= */

const ACHIEVEMENTS = [

{ id:"level1", title:"Level 2", desc:"Reach Level 2", type:"level", value:2 },
{ id:"level5", title:"Level 5", desc:"Reach Level 5", type:"level", value:5 },

{ id:"days3", title:"3 Days Strong", desc:"Use app for 3 days", type:"days", value:3 },
{ id:"days7", title:"7 Days Strong", desc:"Use app for 7 days", type:"days", value:7 },

{ id:"streak3", title:"3 Day Streak", desc:"Complete tasks 3 days in a row", type:"streak", value:3 },
{ id:"streak7", title:"7 Day Streak", desc:"Complete tasks 7 days in a row", type:"streak", value:7 }

];


/* ================= SAVE / LOAD ================= */

function save(){
localStorage.setItem("discipline_state", JSON.stringify(state));
}

function load(){

const saved = localStorage.getItem("discipline_state");

if(saved) state = { ...state, ...JSON.parse(saved) };

const today = new Date().toDateString();

/* first open */

if(!state.firstOpenDate){
state.firstOpenDate = today;
state.daysUsed = 1;
}

/* day usage tracking */

if(state.lastOpenDate !== today){
state.daysUsed += 1;
state.lastOpenDate = today;
}

/* ===== AUTO DAILY RESET ===== */

if(state.lastDailyGeneration !== today){

state.completedToday = 0;

if(state.tasks.length > 0){

const shuffled = [...state.tasks]
.sort(()=>0.5-Math.random());

state.dailyTasks =
shuffled.slice(0,Math.min(5,shuffled.length));

}

state.lastDailyGeneration = today;

save();

}

}


/* ================= QUOTES ================= */

function renderQuote(){
document.getElementById("quoteBox").textContent =
QUOTES[Math.floor(Math.random()*QUOTES.length)];
}

document.getElementById("quoteBox").addEventListener("click", renderQuote);


/* ================= STATS ================= */

function updateStats(){

const xpNeeded = state.level * 250;

const pct = Math.min((state.xp / xpNeeded) * 100,100);

document.getElementById("levelBadge").textContent = state.level;

document.getElementById("xpLabel").textContent =
state.xp + " / " + xpNeeded;

document.getElementById("xpFill").style.width = pct + "%";

document.getElementById("completedCount").textContent =
state.completedToday;

}


/* ================= TASK POOL ================= */

function renderPool(){

const el = document.getElementById("taskPool");

if(state.tasks.length === 0){
el.innerHTML =
'<div class="empty-msg">NO TASKS YET — ADD SOME ABOVE</div>';
return;
}

el.innerHTML = state.tasks.map((t,i)=>

'<div class="pool-item"><span>'+t+'</span><button class="delete-btn" onclick="deleteTask('+i+')">✕</button></div>'

).join("");

}


function addTask(){

const input = document.getElementById("taskInput");

const val = input.value.trim();

if(!val) return;

state.tasks.push(val);

input.value = "";

save();

renderPool();

}

document.getElementById("taskInput")
.addEventListener("keydown",function(e){

if(e.key==="Enter") addTask();

});


function deleteTask(i){

state.tasks.splice(i,1);

save();

renderPool();

}


/* ================= DAILY TASKS ================= */

function renderDaily(){

const el = document.getElementById("dailyList");

if(state.dailyTasks.length === 0){

el.innerHTML =
'<div class="empty-msg">NO DAILY TASKS — GENERATE FROM POOL</div>';

return;

}

el.innerHTML = state.dailyTasks.map((t,i)=>

'<div class="daily-item" onclick="completeTask('+i+')">'+
'<div class="check-circle"></div>'+
'<span class="daily-task-text">'+t+'</span>'+
'<span class="daily-xp">+10 XP</span>'+
'</div>'

).join("");

}


function generateDaily(){

if(state.tasks.length===0){

alert("Add some tasks to the pool first.");

return;

}

const shuffled = [...state.tasks]
.sort(()=>0.5-Math.random());

state.dailyTasks =
shuffled.slice(0,Math.min(5,shuffled.length));

state.lastDailyGeneration = new Date().toDateString();

save();

renderDaily();

}


/* ================= COMPLETE TASK ================= */

function completeTask(i){

state.xp += 10;

state.completedToday += 1;

const today = new Date().toDateString();

/* streak logic */

if(state.lastCompletedDate !== today){

const yesterday =
new Date(Date.now()-86400000).toDateString();

if(state.lastCompletedDate === yesterday){

state.streak += 1;

}else{

state.streak = 1;

}

state.lastCompletedDate = today;

}


/* level up */

const xpNeeded = state.level * 250;

if(state.xp >= xpNeeded){

state.level += 1;

const reward =
CHEAT_REWARDS[Math.floor(Math.random()*CHEAT_REWARDS.length)];

showToast("LEVEL "+state.level+" UNLOCKED");

setTimeout(()=>alert("LEVEL UP! Cheat event unlocked: "+reward),400);

}


/* remove task */

state.dailyTasks.splice(i,1);

checkAchievements();

save();

updateStats();

renderDaily();

}


/* ================= ACHIEVEMENT SYSTEM ================= */

function checkAchievements(){

ACHIEVEMENTS.forEach(a=>{

if(state.achievements.includes(a.id)) return;

if(a.type==="level" && state.level >= a.value){
unlockAchievement(a);
}

if(a.type==="days" && state.daysUsed >= a.value){
unlockAchievement(a);
}

if(a.type==="streak" && state.streak >= a.value){
unlockAchievement(a);
}

});

}


function unlockAchievement(a){

state.achievements.push(a.id);

showToast("Achievement Unlocked: "+a.title);

renderAchievements();

}


function renderAchievements(){

const unlockedEl =
document.getElementById("unlockedAchievements");

const lockedEl =
document.getElementById("lockedAchievements");

if(!unlockedEl) return;

unlockedEl.innerHTML = "";
lockedEl.innerHTML = "";

ACHIEVEMENTS.forEach(a=>{

const div =
'<div class="achievement">'+
'<b>'+a.title+'</b><br>'+a.desc+
'</div>';

if(state.achievements.includes(a.id)){

unlockedEl.innerHTML += div;

}else{

lockedEl.innerHTML +=
'<div class="achievement locked">'+
'<b>'+a.title+'</b><br>'+a.desc+
'</div>';

}

});

}


/* ================= TOAST ================= */

function showToast(msg){

const t = document.getElementById("toast");

t.textContent = "⬆ "+msg;

t.classList.add("show");

setTimeout(()=>t.classList.remove("show"),3000);

}


/* ================= NOTES ================= */

document.getElementById("notes")
.addEventListener("input",function(){

state.notes = this.value;

save();

});


/* ================= INIT ================= */

load();

renderQuote();

updateStats();

renderPool();

renderDaily();

renderAchievements();

document.getElementById("notes").value = state.notes;


/* ===== MIDNIGHT CHECK ===== */

setInterval(()=>{

const today = new Date().toDateString();

if(state.lastDailyGeneration !== today){

state.completedToday = 0;

if(state.tasks.length > 0){

const shuffled = [...state.tasks]
.sort(()=>0.5-Math.random());

state.dailyTasks =
shuffled.slice(0,Math.min(5,shuffled.length));

}

state.lastDailyGeneration = today;

save();

updateStats();

renderDaily();

}

},60000);