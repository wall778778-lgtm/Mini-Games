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



let paddle;
let ball;
let blocks;

let score;

let left=false;
let right=false;

let loop;



function start(){


paddle={

x:200,

y:370,

width:80,

height:10

};



ball={

x:240,

y:300,

dx:4,

dy:-4,

size:8

};



blocks=[];



for(let r=0;r<5;r++){

for(let c=0;c<8;c++){


blocks.push({

x:c*60+10,

y:r*25+20,

width:50,

height:15,

alive:true

});


}

}



score=0;

scoreText.textContent=score;

message.textContent="";


clearInterval(loop);


loop=setInterval(update,16);


}




function draw(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



// paddle

ctx.fillStyle="#00eaff";

ctx.fillRect(

paddle.x,

paddle.y,

paddle.width,

paddle.height

);




// ball

ctx.beginPath();

ctx.arc(

ball.x,

ball.y,

ball.size,

0,

Math.PI*2

);

ctx.fillStyle="#ff3366";

ctx.fill();




// blocks


blocks.forEach(block=>{


if(block.alive){


ctx.fillStyle="#7b5cff";


ctx.fillRect(

block.x,

block.y,

block.width,

block.height

);


}


});


}




function update(){



if(left && paddle.x>0)

paddle.x-=7;



if(right && paddle.x<canvas.width-paddle.width)

paddle.x+=7;



ball.x+=ball.dx;

ball.y+=ball.dy;



if(
ball.x<=0 ||
ball.x>=canvas.width
)

ball.dx*=-1;



if(ball.y<=0)

ball.dy*=-1;



// paddle collision


if(

ball.y+ball.size >= paddle.y &&

ball.x > paddle.x &&

ball.x < paddle.x+paddle.width

){

ball.dy*=-1;

}




// lose


if(ball.y>canvas.height){


message.textContent="Game Over";


clearInterval(loop);


}




// blocks


blocks.forEach(block=>{


if(

block.alive &&

ball.x>block.x &&

ball.x<block.x+block.width &&

ball.y>block.y &&

ball.y<block.y+block.height

){


block.alive=false;

ball.dy*=-1;


score++;

scoreText.textContent=score;


}


});



draw();


}





// Keyboard


document.addEventListener(
"keydown",
e=>{


if(e.key==="ArrowLeft")

left=true;


if(e.key==="ArrowRight")

right=true;


});



document.addEventListener(
"keyup",
e=>{


if(e.key==="ArrowLeft")

left=false;


if(e.key==="ArrowRight")

right=false;


});




// Mobile touch control


canvas.addEventListener(
"touchmove",
e=>{


let touch =
e.touches[0];


let rect =
canvas.getBoundingClientRect();


let x =
touch.clientX - rect.left;



paddle.x =
x - paddle.width/2;



if(paddle.x<0)

paddle.x=0;



if(
paddle.x >
canvas.width-paddle.width
)

paddle.x =
canvas.width-paddle.width;



e.preventDefault();


},
{
passive:false
});





restart.onclick=start;


start();
