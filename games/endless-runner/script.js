const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");

const restartButton = document.getElementById("restart");

const message = document.getElementById("message");



let player;

let obstacle;

let score;

let running;

let loop;



function startGame(){


player = {

x:80,

y:180,

width:30,

height:30,

velocity:0,

jumping:false

};



obstacle = {

x:500,

y:190,

width:30,

height:40

};



score=0;

scoreText.textContent=score;


message.textContent="";


running=true;


clearInterval(loop);


loop=setInterval(update,16);


}





function jump(){


if(player.jumping===false){

player.velocity=-11;

player.jumping=true;

}


}





function update(){


if(!running)
return;



ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



player.velocity+=0.5;

player.y+=player.velocity;



if(player.y>=180){

player.y=180;

player.velocity=0;

player.jumping=false;

}



obstacle.x-=6;



if(obstacle.x<-40){

obstacle.x=520;

score++;

scoreText.textContent=score;

}




if(

player.x < obstacle.x + obstacle.width &&

player.x + player.width > obstacle.x &&

player.y < obstacle.y + obstacle.height &&

player.y + player.height > obstacle.y

){

gameOver();

}





draw();


}





function draw(){


ctx.fillStyle="#00ff99";

ctx.fillRect(

player.x,

player.y,

player.width,

player.height

);



ctx.fillStyle="#ff3366";

ctx.fillRect(

obstacle.x,

obstacle.y,

obstacle.width,

obstacle.height

);



ctx.fillStyle="#00eaff";

ctx.fillRect(

0,

220,

canvas.width,

3

);


}




function gameOver(){


running=false;

clearInterval(loop);

message.textContent="Game Over";


}





document.addEventListener(
"keydown",
event=>{

if(event.code==="Space"){

jump();

}

});



canvas.addEventListener(
"touchstart",
()=>{

jump();

});



restartButton.onclick=startGame;



startGame();
