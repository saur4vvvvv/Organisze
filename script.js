function showPage(page){

let pages=document.querySelectorAll('.page')

pages.forEach(p=>p.style.display='none')

document.getElementById(page).style.display='block'

}

function createAccount(){

let name=document.getElementById("username").value

localStorage.setItem("user",name)

alert("Account created")

showPage('home')

}


function addTask(){

let task=document.getElementById("taskInput").value

let pool=JSON.parse(localStorage.getItem("taskPool")||"[]")

pool.push(task)

localStorage.setItem("taskPool",JSON.stringify(pool))

}


function generateTasks(){

let pool=JSON.parse(localStorage.getItem("taskPool")||"[]")

let list=document.getElementById("todayTasks")

list.innerHTML=""

for(let i=0;i<5;i++){

let rand=pool[Math.floor(Math.random()*pool.length)]

let li=document.createElement("li")

li.innerText=rand

list.appendChild(li)

}

}