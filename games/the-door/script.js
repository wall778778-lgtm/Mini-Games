const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const message = document.getElementById("message");
const interaction = document.getElementById("interaction");

const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");



/* =========================
 SETTINGS
========================= */

const FOV = Math.PI / 3;
const MOVE_SPEED = 3;
const ROTATE_SPEED = 0.003;
const MAX_DISTANCE = 20;



/* =========================
 ROOM

 # wall
 . floor
========================= */

const map = [

"################",

"#..............#",

"#..............#",

"#..............#",

"#..............#",

"#..............#",

"#..............#",

"#..............#",

"################"

];


const mapWidth = map[0].length;
const mapHeight = map.length;



/* =========================
 PLAYER
========================= */

let player = {

    x:8,
    y:6.5,
    angle:-Math.PI/2

};



let keys={};

let gameStarted=false;

let lives=3;

let level=1;



/* =========================
 FOUR DOORS
========================= */

let doors=[

{
x:2.5,
y:1.2,
symbol:"△",
correct:false
},

{
x:5.5,
y:1.2,
symbol:"○",
correct:false
},

{
x:8.5,
y:1.2,
symbol:"□",
correct:true
},

{
x:11.5,
y:1.2,
symbol:"☆",
correct:false
}

];



/* =========================
 RESIZE
========================= */

function resize(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

}

window.addEventListener(
"resize",
resize
);

resize();




/* =========================
 COLLISION
========================= */

function isWall(x,y){


let mx=Math.floor(x);
let my=Math.floor(y);


if(
mx<0 ||
my<0 ||
mx>=mapWidth ||
my>=mapHeight
)
return true;



return map[my][mx]==="#";


}



function canMove(x,y){


let size=0.2;


return(
!isWall(x-size,y-size)&&
!isWall(x+size,y-size)&&
!isWall(x-size,y+size)&&
!isWall(x+size,y+size)
);


}




/* =========================
 MOVEMENT
========================= */


function update(delta){


if(!gameStarted)
return;



let move=0;


if(keys["w"])
move+=1;

if(keys["s"])
move-=1;



let rotate=0;


if(keys["a"])
rotate-=1;


if(keys["d"])
rotate+=1;



player.angle +=
rotate *
ROTATE_SPEED *
100 *
delta;



let dx =
Math.cos(player.angle)
*
move
*
MOVE_SPEED
*
delta;



let dy =
Math.sin(player.angle)
*
move
*
MOVE_SPEED
*
delta;



if(canMove(player.x+dx,player.y))
player.x+=dx;



if(canMove(player.x,player.y+dy))
player.y+=dy;


}







/* =========================
 INPUT
========================= */


document.addEventListener(
"keydown",
e=>{


keys[e.key.toLowerCase()]=true;


if(e.key.toLowerCase()=="e")
chooseDoor();


});


document.addEventListener(
"keyup",
e=>{


keys[e.key.toLowerCase()]=false;


});




canvas.addEventListener(
"click",
()=>{


gameStarted=true;

message.textContent=
"Find the correct door";


canvas.requestPointerLock();


});




document.addEventListener(
"mousemove",
e=>{


if(document.pointerLockElement===canvas)
{

player.angle+=
e.movementX*
ROTATE_SPEED;

}


});






/* =========================
 DOOR CHECK
========================= */


function nearbyDoor(){


for(let door of doors){


let distance =
Math.sqrt(
(player.x-door.x)**2+
(player.y-door.y)**2
);



if(distance<1.5)
return door;


}


return null;


}





function chooseDoor(){


let door=
nearbyDoor();


if(!door)
return;



if(door.correct){


message.textContent=
"✅ Correct! Next room...";


setTimeout(()=>{

level++;

levelText.textContent=level;

message.textContent=
"New room loading...";


},1000);


}
else{


lives--;

livesText.textContent=lives;


message.textContent=
"❌ Wrong door!";


}



}




/* =========================
 RAYCAST
========================= */


function ray(angle){


let distance=0;


while(distance<MAX_DISTANCE){


let x=
player.x+
Math.cos(angle)*distance;


let y=
player.y+
Math.sin(angle)*distance;



if(isWall(x,y))
return distance;


distance+=0.02;


}


return MAX_DISTANCE;


}






/* =========================
 DRAW
========================= */


function draw(){


ctx.fillStyle="#111";
ctx.fillRect(
0,
0,
canvas.width,
canvas.height/2
);


ctx.fillStyle="#050505";
ctx.fillRect(
0,
canvas.height/2,
canvas.width,
canvas.height/2
);





for(
let x=0;
x<canvas.width;
x++
){


let angle =
player.angle-
FOV/2+
(x/canvas.width)*FOV;


let distance=ray(angle);



let height=
canvas.height/distance;


ctx.fillStyle=
`rgb(${120-distance*5},${120-distance*5},${120-distance*5})`;


ctx.fillRect(
x,
canvas.height/2-height/2,
1,
height
);


}



drawDoors();


}






/* =========================
 DRAW DOORS
========================= */


function drawDoors(){


for(let door of doors){



let dx=
door.x-player.x;

let dy=
door.y-player.y;


let distance=
Math.sqrt(
dx*dx+dy*dy
);



let angle=
Math.atan2(dy,dx)
-
player.angle;



if(Math.abs(angle)<FOV/2){



let x=
(
0.5+
angle/FOV
)
*
canvas.width;



let size=
canvas.height/distance;



ctx.fillStyle="#8b4513";


ctx.fillRect(
x-size/5,
canvas.height/2-size/2,
size/2,
size
);



ctx.fillStyle="white";


ctx.font="30px Arial";


ctx.fillText(
door.symbol,
x-10,
canvas.height/2
);



}


}



}







/* =========================
 LOOP
========================= */


let last=performance.now();



function loop(time){


let delta=
(time-last)/1000;


last=time;



update(delta);

draw();


requestAnimationFrame(loop);


}





levelText.textContent=level;
livesText.textContent=lives;

message.textContent=
"Click to start";


requestAnimationFrame(loop);
