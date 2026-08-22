const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


const scoreText =
document.getElementById("score");

const restart =
document.getElementById("restart");

const message =
document.getElementById("message");



let player;

let obstacle;

let score;

let gameLoop;

let running;



function start(){


player={

x:80,

y:180,

width:30,

height:30,

jump:false,

velocity:0

};



obstacle={

x:500,

y:190,

width:25,

height:40

};



score=0;

running=true;


message.textContent="";


clearInterval(gameLoop);


gameLoop=setInterval(update,16);


}



function jump(){


if(!player.jump){

player.velocity=-10;

player.jump=true;

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



// gravity

player.velocity+=0.5;

player.y+=player.velocity;



if(player.y>=180){

player.y=180;

player.jump=false;

}



// move obstacle


obstacle.x-=5;



if(obstacle.x<-30){

obstacle.x=500;

score++;

scoreText.textContent=score;

}




// collision


if(

player.x < obstacle.x+obstacle.width &&

player.x+player.width > obstacle.x &&

player.y < obstacle.y+obstacle.height &&

player.y+player.height > obstacle.y

){

end();

}




draw();


}





function draw(){



// player

ctx.fillStyle="#00ff99";

ctx.fillRect(

player.x,

player.y,

player.width,

player.height

);



// obstacle

ctx.fillStyle="#ff3366";

ctx.fillRect(

obstacle.x,

obstacle.y,

obstacle.width,

obstacle.height

);



// ground

ctx.fillStyle="#333";

ctx.fillRect(

0,

220,

500,

5

);



}



function end(){

running=false;

message.textContent="Game Over";

}



document.addEventListener(
"keydown",
e=>{

if(e.code==="Space")

jump();

});



canvas.addEventListener(
"touchstart",
jump
);



restart.onclick=start;


start();const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


const scoreText =
document.getElementById("score");

const restart =
document.getElementById("restart");

const message =
document.getElementById("message");



let player;

let obstacle;

let score;

let gameLoop;

let running;



function start(){


player={

x:80,

y:180,

width:30,

height:30,

jump:false,

velocity:0

};



obstacle={

x:500,

y:190,

width:25,

height:40

};



score=0;

running=true;


message.textContent="";


clearInterval(gameLoop);


gameLoop=setInterval(update,16);


}



function jump(){


if(!player.jump){

player.velocity=-10;

player.jump=true;

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



// gravity

player.velocity+=0.5;

player.y+=player.velocity;



if(player.y>=180){

player.y=180;

player.jump=false;

}



// move obstacle


obstacle.x-=5;



if(obstacle.x<-30){

obstacle.x=500;

score++;

scoreText.textContent=score;

}




// collision


if(

player.x < obstacle.x+obstacle.width &&

player.x+player.width > obstacle.x &&

player.y < obstacle.y+obstacle.height &&

player.y+player.height > obstacle.y

){

end();

}




draw();


}





function draw(){



// player

ctx.fillStyle="#00ff99";

ctx.fillRect(

player.x,

player.y,

player.width,

player.height

);



// obstacle

ctx.fillStyle="#ff3366";

ctx.fillRect(

obstacle.x,

obstacle.y,

obstacle.width,

obstacle.height

);



// ground

ctx.fillStyle="#333";

ctx.fillRect(

0,

220,

500,

5

);



}



function end(){

running=false;

message.textContent="Game Over";

}



document.addEventListener(
"keydown",
e=>{

if(e.code==="Space")

jump();

});



canvas.addEventListener(
"touchstart",
jump
);



restart.onclick=start;


start();