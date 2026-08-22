const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


const playerScoreText =
document.getElementById("playerScore");

const aiScoreText =
document.getElementById("aiScore");

const restart =
document.getElementById("restart");

const message =
document.getElementById("message");



let player;
let ai;
let ball;

let playerScore=0;
let aiScore=0;

let loop;



function startGame(){


player={

x:20,

y:160,

width:12,

height:80

};



ai={

x:468,

y:160,

width:12,

height:80

};



ball={

x:250,

y:200,

size:10,

dx:5,

dy:4

};



playerScore=0;

aiScore=0;


playerScoreText.textContent=0;

aiScoreText.textContent=0;


message.textContent="";


clearInterval(loop);

loop=setInterval(update,16);


}




function update(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



// player movement


if(keys.up && player.y>0)

player.y-=7;


if(keys.down && player.y<320)

player.y+=7;



// AI


if(ai.y+40 < ball.y)

ai.y+=4;


if(ai.y+40 > ball.y)

ai.y-=4;




// ball


ball.x+=ball.dx;

ball.y+=ball.dy;



if(ball.y<0 || ball.y>400)

ball.dy*=-1;




// player collision


if(

ball.x<player.x+player.width &&

ball.y>player.y &&

ball.y<player.y+player.height

){

ball.dx*=-1;

}





// AI collision


if(

ball.x+ball.size>ai.x &&

ball.y>ai.y &&

ball.y<ai.y+ai.height

){

ball.dx*=-1;

}





// score


if(ball.x<0){

aiScore++;

aiScoreText.textContent=aiScore;

resetBall();

}



if(ball.x>500){

playerScore++;

playerScoreText.textContent=playerScore;

resetBall();

}





draw();


}





function draw(){


ctx.shadowBlur=20;



// player

ctx.shadowColor="#00ff99";

ctx.fillStyle="#00ff99";

ctx.fillRect(

player.x,

player.y,

player.width,

player.height

);



// AI

ctx.shadowColor="#ff3366";

ctx.fillStyle="#ff3366";

ctx.fillRect(

ai.x,

ai.y,

ai.width,

ai.height

);




// ball

ctx.shadowColor="#ffffff";

ctx.fillStyle="white";

ctx.beginPath();

ctx.arc(

ball.x,

ball.y,

ball.size,

0,

Math.PI*2

);

ctx.fill();



ctx.shadowBlur=0;


}



function resetBall(){

ball.x=250;

ball.y=200;

ball.dx*=-1;

}





let keys={

up:false,

down:false

};



document.addEventListener(
"keydown",
e=>{

if(e.key==="ArrowUp")
keys.up=true;


if(e.key==="ArrowDown")
keys.down=true;


});


document.addEventListener(
"keyup",
e=>{


if(e.key==="ArrowUp")
keys.up=false;


if(e.key==="ArrowDown")
keys.down=false;


});





// phone touch


canvas.addEventListener(
"touchmove",
e=>{


let rect =
canvas.getBoundingClientRect();


let y =
e.touches[0].clientY - rect.top;


player.y =
y - player.height/2;


if(player.y<0)
player.y=0;


if(player.y>320)
player.y=320;


},
{
passive:true
});





restart.onclick=startGame;


startGame();