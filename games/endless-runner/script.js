const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


const scoreText =
document.getElementById("score");

const restartButton =
document.getElementById("restart");

const message =
document.getElementById("message");



let player;

let obstacles=[];

let stars=[];

let particles=[];


let score=0;

let speed=6;

let running=true;

let loop;



function startGame(){


player={

x:80,

y:160,

size:35,

velocity:0,

jumping:false

};



obstacles=[];

particles=[];


score=0;

speed=6;


message.textContent="";


stars=[];


for(let i=0;i<60;i++){

stars.push({

x:Math.random()*500,

y:Math.random()*200,

size:Math.random()*2+1

});

}


running=true;


clearInterval(loop);

loop=setInterval(update,16);


}





function jump(){


if(player.jumping===false){

player.velocity=-11;

player.jumping=true;


createParticles(
player.x,
player.y
);

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




// stars


stars.forEach(star=>{


star.x-=1;


if(star.x<0)

star.x=500;



ctx.fillStyle="#ffffff";

ctx.fillRect(
star.x,
star.y,
star.size,
star.size
);


});




// physics


player.velocity+=0.5;

player.y+=player.velocity;



if(player.y>=160){

player.y=160;

player.velocity=0;

player.jumping=false;

}





// spawn obstacles


if(Math.random()<0.010){

obstacles.push({

x:520,

y:150,

width:45,

height:70,

type:
Math.floor(Math.random()*3)

});

}



// move obstacles


obstacles.forEach(ob=>{


ob.x-=speed;



if(

player.x < ob.x+ob.width &&

player.x+player.size > ob.x &&

player.y < ob.y+ob.height &&

player.y+player.size > ob.y

){

gameOver();

}


});





obstacles =
obstacles.filter(
ob=>ob.x>-50
);





particles.forEach(p=>{


p.x+=p.dx;

p.y+=p.dy;

p.life--;


});


particles =
particles.filter(
p=>p.life>0
);





score++;


if(score%300===0)

speed+=0.5;



scoreText.textContent=
Math.floor(score/10);



draw();


}





function draw(){


// player glow


ctx.shadowBlur=20;

ctx.shadowColor="#00ff99";


ctx.fillStyle="#00ff99";


ctx.fillRect(

player.x,

player.y,

player.size,

player.size

);


ctx.shadowBlur=0;



// eyes


ctx.fillStyle="black";


ctx.fillRect(

player.x+22,

player.y+8,

5,

5

);



ctx.fillRect(

player.x+22,

player.y+22,

5,

5

);





// obstacles


obstacles.forEach(ob=>{


ctx.shadowBlur=25;

ctx.shadowColor="#ff3366";


// cyber barrier body

ctx.fillStyle="#ff3366";


ctx.beginPath();


ctx.moveTo(
ob.x+ob.width/2,
ob.y
);


ctx.lineTo(
ob.x+ob.width,
ob.y+ob.height
);


ctx.lineTo(
ob.x,
ob.y+ob.height
);


ctx.closePath();


ctx.fill();


// energy core

ctx.shadowBlur=10;

ctx.shadowColor="#ffffff";

ctx.fillStyle="#ffffff";


ctx.fillRect(

ob.x+18,

ob.y+25,

8,

15

);



// side lights

ctx.fillStyle="#00eaff";


ctx.fillRect(

ob.x+5,

ob.y+ob.height-10,

8,

5

);


ctx.fillRect(

ob.x+ob.width-13,

ob.y+ob.height-10,

8,

5

);


});


ctx.shadowBlur=0;


ctx.shadowBlur=0;



// ground


ctx.fillStyle="#00eaff";


ctx.fillRect(

0,

220,

500,

3

);




// particles


particles.forEach(p=>{


ctx.fillStyle="#00ff99";


ctx.fillRect(

p.x,

p.y,

4,

4

);


});


}





function createParticles(x,y){


for(let i=0;i<10;i++){


particles.push({

x:x,

y:y,

dx:(Math.random()-0.5)*5,

dy:(Math.random()-0.5)*5,

life:30

});


}


}





function gameOver(){


running=false;


message.textContent=
"Game Over 🚀";


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




