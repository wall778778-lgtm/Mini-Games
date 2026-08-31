const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");



const message =
document.getElementById("message");

const interaction =
document.getElementById("interaction");

const puzzleText =
document.getElementById("puzzleText");

const levelText =
document.getElementById("level");

const livesText =
document.getElementById("lives");

const interactButton =
document.getElementById("interactButton");



/*
====================
SETTINGS
====================
*/

const FOV=Math.PI/3;

const SPEED=3;

const ROTATE_SPEED=0.003;

const MAX_DISTANCE=20;




/*
====================
ROOM
====================
*/


const map=[

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


const mapWidth=
map[0].length;

const mapHeight=
map.length;





/*
====================
PLAYER
====================
*/


let player={

x:8,

y:6,

angle:-Math.PI/2

};





let keys={};

let started=false;

let level=1;

let lives=3;





/*
====================
DOORS
====================
*/


let doors=[

{
x:2.5,
y:1.5,
symbol:"△"
},

{
x:5.5,
y:1.5,
symbol:"○"
},

{
x:8.5,
y:1.5,
symbol:"□"
},

{
x:11.5,
y:1.5,
symbol:"☆"
}

];






/*
====================
PUZZLE
====================
*/


function loadPuzzle(){


createPuzzle(level);


puzzleText.textContent =
puzzleToText();


}


loadPuzzle();






/*
====================
RESIZE
====================
*/


function resize(){

canvas.width=
innerWidth;

canvas.height=
innerHeight;

}


window.onresize=resize;

resize();








/*
====================
COLLISION
====================
*/


function isWall(x,y){


let mx=Math.floor(x);

let my=Math.floor(y);



if(
mx<0||
my<0||
mx>=mapWidth||
my>=mapHeight
)

return true;



return map[my][mx]==="#";


}





/*
====================
MOVEMENT
====================
*/


function update(dt){


if(!started)
return;



let move=0;



if(keys.w)
move++;

if(keys.s)
move--;



let rotate=0;


if(keys.a)
rotate--;

if(keys.d)
rotate++;





player.angle +=
rotate*
ROTATE_SPEED*
100*
dt;





let dx=
Math.cos(player.angle)
*
move*
SPEED*
dt;



let dy=
Math.sin(player.angle)
*
move*
SPEED*
dt;



if(!isWall(
player.x+dx,
player.y
))
player.x+=dx;



if(!isWall(
player.x,
player.y+dy
))
player.y+=dy;


}







/*
====================
INPUT
====================
*/


document.addEventListener(
"keydown",
e=>{


keys[
e.key.toLowerCase()
]=true;



if(
e.key.toLowerCase()
==="e"
)

openDoor();


});





document.addEventListener(
"keyup",
e=>{


keys[
e.key.toLowerCase()
]=false;


});





canvas.onclick=()=>{


started=true;


message.textContent=
"Find the correct door";


canvas.requestPointerLock();


};





document.addEventListener(
"mousemove",
e=>{


if(
document.pointerLockElement===canvas
)

player.angle+=
e.movementX*
ROTATE_SPEED;


});







/*
====================
DOOR SYSTEM
====================
*/


function getDoor(){


for(let door of doors){


let d=
Math.sqrt(
(player.x-door.x)**2+
(player.y-door.y)**2
);



if(d<1.5)
return door;


}


return null;


}





function openDoor(){


let door=getDoor();



if(!door)
return;



let index=
doors.indexOf(door);



if(
checkPuzzleAnswer(index)
){


message.textContent=
"✅ Correct!";


level++;


levelText.textContent=
level;



setTimeout(()=>{


loadPuzzle();


message.textContent=
"New room";


},1000);


}

else{


lives--;

livesText.textContent=
lives;


message.textContent=
"❌ Wrong door";


}


}






/*
====================
RAYCAST
====================
*/


function ray(angle){


let d=0;


while(d<MAX_DISTANCE){


let x=
player.x+
Math.cos(angle)*d;


let y=
player.y+
Math.sin(angle)*d;



if(isWall(x,y))
return d;



d+=0.02;


}



return MAX_DISTANCE;

}






/*
====================
DRAW
====================
*/


function draw(){


ctx.fillStyle="#101820";

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


let angle=
player.angle-
FOV/2+
x/canvas.width*FOV;



let distance=
ray(angle);



let height=
canvas.height/distance;



ctx.fillStyle=
"#777";



ctx.fillRect(

x,

canvas.height/2-height/2,

1,

height

);


}



drawDoors();


}








function drawDoors(){


doors.forEach(
door=>{


let dx=
door.x-player.x;


let dy=
door.y-player.y;



let dist=
Math.sqrt(
dx*dx+dy*dy
);



let angle=
Math.atan2(dy,dx)
-
player.angle;



if(
Math.abs(angle)<FOV/2
){



let x=
(
0.5+
angle/FOV
)
*
canvas.width;



let size=
canvas.height/dist;



ctx.fillStyle=
"#8b4513";


ctx.fillRect(

x-size/4,

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


});


}







/*
====================
MOBILE BUTTON
====================
*/


if(interactButton){


interactButton.onclick=()=>{
