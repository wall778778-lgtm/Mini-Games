const target = document.getElementById("target");

const arena = document.getElementById("arena");

const scoreText = document.getElementById("score");

const timeText = document.getElementById("time");

const startButton = document.getElementById("start");

const message = document.getElementById("message");



let score = 0;

let time = 30;

let timer;

let playing = false;



function moveTarget(){


let x = Math.random() * 
(arena.clientWidth - 60);


let y = Math.random() * 
(arena.clientHeight - 60);



target.style.left = x + "px";

target.style.top = y + "px";


}



target.onclick = ()=>{


if(!playing)
return;


score++;

scoreText.textContent = score;


moveTarget();


};



startButton.onclick = ()=>{


if(playing)
return;



score = 0;

time = 30;


scoreText.textContent = score;

timeText.textContent = time;


message.textContent="";


playing=true;


target.style.display="block";


moveTarget();



timer=setInterval(()=>{


time--;

timeText.textContent=time;



if(time<=0){


clearInterval(timer);


playing=false;


target.style.display="none";


message.textContent =
`Game Over! Score: ${score}`;


}



},1000);



};