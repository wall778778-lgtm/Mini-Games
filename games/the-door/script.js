const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const message = document.getElementById("message");
const interaction = document.getElementById("interaction");
const puzzleText = document.getElementById("puzzleText");

const levelText = document.getElementById("level");
const livesText = document.getElementById("lives");

const touchInteract = document.getElementById("touchInteract");



/*
==============================
SETTINGS
==============================
*/

const FOV = Math.PI / 3;
const SPEED = 3;
const ROTATE_SPEED = 0.003;
const MAX_DISTANCE = 20;



/*
==============================
ROOM
==============================
*/

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



/*
==============================
PLAYER
==============================
*/


let player = {

    x:8,

    y:6,

    angle:-Math.PI/2

};



let keys = {};

let started=false;

let lives=3;

let level=1;



/*
==============================
PUZZLE
==============================
*/


let puzzle = {

    rule:
    "Only ONE door tells the truth.",


    doors:[

        {
            symbol:"△",
            text:"I am not the correct door.",
            correct:false
        },


        {
            symbol:"○",
            text:"The triangle door is correct.",
            correct:false
        },


        {
            symbol:"□",
            text:"I am the correct door.",
            correct:true
        },


        {
            symbol:"☆",
            text:"The circle door is lying.",
            correct:false
        }

    ]

};



function showPuzzle(){


let text =
puzzle.rule +
"\n\n";


puzzle.doors.forEach(
(d,i)=>{


text +=
"Door "
+
(i+1)
+
" "
+
d.symbol
+
":\n"
+
d.text
+
"\n\n";


});


puzzleText.textContent=text;


}



/*
==============================
DOORS
==============================
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
==============================
RESIZE
==============================
*/


function resize(){

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

}


window.addEventListener(
"resize",
resize
);


resize();





/*
==============================
COLLISION
==============================
*/


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


return !isWall(x,y);


}






/*
==============================
MOVEMENT
==============================
*/


function update(delta){


if(!started)
return;



let move=0;


if(keys["w"])
move+=1;


if(keys["s"])
move-=1;



let turn=0;


if(keys["a"])
turn-=1;


if(keys["d"])
turn+=1;



player.angle +=
turn *
ROTATE_SPEED *
100 *
delta;



let dx =
Math.cos(player.angle)
*
move
*
SPEED *
delta;


let dy =
Math.sin(player.angle)
*
move *
SPEED *
delta;



if(canMove(player.x+dx,player.y))
player.x+=dx;



if(canMove(player.x,player.y+dy))
player.y+=dy;


}






/*
==============================
INPUT
==============================
*/


document.addEventListener(
"keydown",
e=>{


keys[e.key.toLowerCase()]=true;



if(e.key.toLowerCase()==="e")
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


started=true;

message.textContent=
"Find the correct door";


canvas.requestPointerLock();


});




document.addEventListener(
"mousemove",
e=>{


if(
document.pointerLockElement===canvas
){


player.angle +=
e.movementX*
ROTATE_SPEED;


}


});





showPuzzle();

/*
==============================
DOOR DETECTION
==============================
*/


function nearbyDoor(){


for(let door of doors){


let distance =
Math.sqrt(
(player.x-door.x)**2 +
(player.y-door.y)**2
);



if(distance < 1.5)
return door;


}


return null;


}





function chooseDoor(){


let door =
nearbyDoor();



if(!door)
return;



let index =
doors.indexOf(door);



if(
puzzle.doors[index].correct
){


message.textContent =
"✅ Correct! The next room opens.";


level++;

levelText.textContent =
level;


setTimeout(()=>{


message.textContent =
"New puzzle incoming...";


generatePuzzle();


},1500);



}

else{


lives--;

livesText.textContent =
lives;


message.textContent =
"❌ Wrong door!";


if(lives<=0){

message.textContent =
"Game Over";

started=false;

}


}


}






/*
==============================
PUZZLE GENERATOR
==============================
*/


function generatePuzzle(){


let correct =
Math.floor(
Math.random()*4
);



puzzle.doors.forEach(
(d,i)=>{


d.correct =
i===correct;


});



puzzle.rule =
"Only one door is correct.";



puzzle.doors[0].text =
"The correct door is not me.";


puzzle.doors[1].text =
"Door "+(correct+1)+" is correct.";


puzzle.doors[2].text =
"Look carefully.";


puzzle.doors[3].text =
"The answer is hidden.";





showPuzzle();


}







/*
==============================
RAYCAST
==============================
*/


function ray(angle){


let distance=0;



while(
distance<MAX_DISTANCE
){



let x =
player.x+
Math.cos(angle)*distance;



let y =
player.y+
Math.sin(angle)*distance;



if(isWall(x,y))
return distance;



distance+=0.02;


}



return MAX_DISTANCE;


}







/*
==============================
DRAW
==============================
*/


function draw(){


ctx.fillStyle="#14213d";


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
player.angle -
FOV/2 +
(x/canvas.width)*FOV;



let distance =
ray(angle);



distance *=
Math.cos(
angle-player.angle
);



let height =
canvas.height/distance;



let shade =
Math.max(
20,
120-distance*5
);



ctx.fillStyle =
`rgb(${shade},${shade},${shade})`;



ctx.fillRect(
x,
canvas.height/2-height/2,
1,
height
);



}



drawDoors();


}







/*
==============================
DRAW DOORS
==============================
*/


function drawDoors(){


for(
let i=0;
i<doors.length;
i++
){


let door =
doors[i];



let dx =
door.x-player.x;


let dy =
door.y-player.y;



let distance =
Math.sqrt(
dx*dx+dy*dy
);



let angle =
Math.atan2(dy,dx)
-
player.angle;



if(
Math.abs(angle)<FOV/2
){



let screen =
(
0.5+
angle/FOV
)
*
canvas.width;



let size =
canvas.height/distance;



ctx.fillStyle="#8b4513";



ctx.fillRect(

screen-size/4,

canvas.height/2-size/2,

size/2,

size

);




ctx.fillStyle="white";

ctx.font="30px Arial";


ctx.fillText(

door.symbol,

screen-10,

canvas.height/2

);



}



}


}







/*
==============================
MOBILE BUTTON
==============================
*/


if(touchInteract){


touchInteract.addEventListener(
"click",
()=>{


chooseDoor();


});

}




/*
==============================
SIMPLE MOBILE JOYSTICK
==============================
*/


let joystick =
document.getElementById("joystick");


let stick =
document.getElementById("stick");


if(joystick){


joystick.addEventListener(
"touchmove",
e=>{


let touch =
e.touches[0];


let rect =
joystick.getBoundingClientRect();



let x =
touch.clientX-
(rect.left+60);



let y =
touch.clientY-
(rect.top+60);



if(x>20)
keys["d"]=true;

else
keys["d"]=false;



if(x<-20)
keys["a"]=true;

else
keys["a"]=false;



if(y<-20)
keys["w"]=true;

else
keys["w"]=false;



if(y>20)
keys["s"]=true;

else
keys["s"]=false;



});



joystick.addEventListener(
"touchend",
()=>{


keys["w"]=false;
keys["s"]=false;
keys["a"]=false;
keys["d"]=false;


});


}








/*
==============================
GAME LOOP
==============================
*/


let last =
performance.now();



function loop(time){


let delta =
(time-last)/1000;


last=time;



delta =
Math.min(delta,0.05);



update(delta);


draw();



requestAnimationFrame(loop);


}






levelText.textContent =
level;


livesText.textContent =
lives;



message.textContent =
"Click to start";



requestAnimationFrame(loop);
