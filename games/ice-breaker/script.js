const game =
document.getElementById("game");


const scoreText =
document.getElementById("score");


const timeText =
document.getElementById("time");


const startButton =
document.getElementById("start");


const message =
document.getElementById("message");



let score=0;

let time=30;

let timer;

let playing=false;

let speed=1000;



function startGame(){


game.innerHTML="";


score=0;

time=30;

speed=1000;


scoreText.textContent=score;

timeText.textContent=time;


message.textContent="";


playing=true;



clearInterval(timer);



timer=setInterval(()=>{


time--;


timeText.textContent=time;



if(time<=0){

endGame();

}



},1000);



spawnIce();


}




function spawnIce(){


if(!playing)
return;



let ice =
document.createElement("div");


ice.className="ice";



ice.style.left =
Math.random()*290+"px";


ice.style.top =
Math.random()*290+"px";



ice.onclick=()=>{


score++;


scoreText.textContent=score;


ice.classList.add("break");



setTimeout(()=>{

ice.remove();

},300);



if(score%5===0 && speed>300){

speed-=100;

}



setTimeout(
spawnIce,
speed
);


};



game.appendChild(ice);


}





function endGame(){


playing=false;


clearInterval(timer);


message.textContent=
"Time Over! 🧊";


}



startButton.onclick=startGame;