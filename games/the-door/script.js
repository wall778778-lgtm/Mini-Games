const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");


const message =
document.getElementById("message");


const puzzleText =
document.getElementById("puzzleText");


const levelText =
document.getElementById("level");


const livesText =
document.getElementById("lives");


const interactButton =
document.getElementById("interactButton");



const FOV =
Math.PI/3;


const SPEED=3;


const ROTATE=0.003;



let player={

x:8,

y:6,

angle:-Math.PI/2

};



let keys={};


let level=1;

let lives=3;

let started=false;





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





let doors=[

{x:2.5,y:1.5,symbol:"△"},

{x:5.5,y:1.5,symbol:"○"},

{x:8.5,y:1.5,symbol:"□"},

{x:11.5,y:1.5,symbol:"☆"}

];






function resize(){

canvas.width=innerWidth;

canvas.height=innerHeight;

}

resize();

window.onresize=resize;






function loadPuzzle(){

generatePuzzle(level);

puzzleText.textContent=
getPuzzleText();

}


loadPuzzle();







function wall(x,y){


let mx=Math.floor(x);

let my=Math.floor(y);



if(
mx<0||
my<0||
mx>=map[0].length||
my>=map.length
)
return true;



return map[my][mx]==="#";


}






function update(dt){


if(!started)
return;



let move=0;



if(keys.w)
move++;

if(keys.s)
move--;





if(keys.a)
player.angle-=ROTATE*100*dt;


if(keys.d)
player.angle+=ROTATE*100*dt;




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



if(!wall(player.x+dx,player.y))
player.x+=dx;


if(!wall(player.x,player.y+dy))
player.y+=dy;


}








document.addEventListener(
"keydown",
e=>{


keys[e.key.toLowerCase()]=true;


if(e.key.toLowerCase()=="e")
openDoor();


});



document.addEventListener(
"keyup",
e=>{


keys[e.key.toLowerCase()]=false;


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


if(document.pointerLockElement===canvas)

player.angle+=
e.movementX*
ROTATE;


});






function nearDoor(){


for(let d of doors){


let dist=
Math.hypot(
player.x-d.x,
player.y-d.y
);


if(dist<1.5)
return d;


}


return null;


}






function openDoor(){


let d=nearDoor();


if(!d)
return;



let index=
doors.indexOf(d);



if(checkAnswer(index)){


message.textContent=
"Correct!";


level++;

levelText.textContent=
level;


setTimeout(
loadPuzzle,
1000
);


}

else{


lives--;

livesText.textContent=
lives;


message.textContent=
"Wrong door";


}



}








function ray(angle){


let dist=0;


while(dist<20){


let x=
player.x+
Math.cos(angle)*dist;


let y=
player.y+
Math.sin(angle)*dist;



if(wall(x,y))
return dist;


dist+=0.03;


}



return 20;


}







function draw(){


ctx.fillStyle="#111";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height/2
);


ctx.fillStyle="#000";

ctx.fillRect(
0,
canvas.height/2,
canvas.width,
canvas.height/2
);




for(let x=0;x<canvas.width;x++){


let angle=
player.angle-
FOV/2+
x/canvas.width*FOV;



let dist=ray(angle);



let h=
canvas.height/dist;



ctx.fillStyle="#777";


ctx.fillRect(
x,
canvas.height/2-h/2,
1,
h
);


}



requestAnimationFrame(loop);

}






function loop(t){


update(0.016);

draw();


}





requestAnimationFrame(loop);
