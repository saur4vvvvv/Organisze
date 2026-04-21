const API = "http://127.0.0.1:8000";
const user_id = "user1";

let state = {
  xp: 0,
  level: 1
};

/* NAV */
function show(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(page+'Page').classList.add('active');
}

/* XP SYSTEM */
function addXP(){
  state.xp += 10;

  if(state.xp >= state.level * 100){
    state.level++;
  }

  save();
  render();
}

function render(){
  document.getElementById("level").innerText = "Level: " + state.level;
  document.getElementById("xp").innerText = "XP: " + state.xp;
}

/* SAVE TO BACKEND */
async function save(){
  await fetch(API + "/save", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      user_id,
      state
    })
  });
}

/* LOAD */
async function load(){
  const res = await fetch(API + "/load/" + user_id);
  const data = await res.json();
  if(data) state = data;
  render();
}

/* NO FAP */
async function startNoFap(){
  await fetch(API + "/nofap/start?user_id=" + user_id, {method:"POST"});
}

async function updateNoFap(){
  const res = await fetch(API + "/nofap/days/" + user_id);
  const data = await res.json();

  document.getElementById("nofapDays").innerText = data.days;

  let rank = "None";
  if(data.days>=1) rank="Noob";
  if(data.days>=5) rank="Beginner";
  if(data.days>=10) rank="Pro";
  if(data.days>=30) rank="Hacker";
  if(data.days>=90) rank="Chad";
  if(data.days>=120) rank="Gigachad";
  if(data.days>=200) rank="Warrior";
  if(data.days>=300) rank="Knight";
  if(data.days>=500) rank="Godlike";

  document.getElementById("nofapRank").innerText = "Rank: " + rank;
}

load();
setInterval(updateNoFap, 5000);