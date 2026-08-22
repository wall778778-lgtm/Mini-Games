const boardElement =
document.getElementById("board");

const scoreElement =
document.getElementById("score");

const restart =
document.getElementById("restart");

const message =
document.getElementById("message");


let board;

let score=0;



function start(){

board=[
[0,0,0,0],
[0,0,0,0],
[0,0,0,0],
[0,0,0,0]
];

score=0;

message.textContent="";

addTile();

addTile();

draw();

}



function addTile(){

let empty=[];


for(let r=0;r<4;r++){

for(let c=0;c<4;c++){

if(board[r][c]===0)

empty.push([r,c]);

}

}



if(empty.length){

let spot=
empty[Math.floor(Math.random()*empty.length)];


board[spot[0]][spot[1]]
=
Math.random()<.9?2:4;

}

}



function draw(){

boardElement.innerHTML="";


board.flat().forEach(value=>{


let tile=
document.createElement("div");


tile.className="tile";


if(value){

tile.textContent=value;

tile.classList.add("pop");


tile.style.background =
getColor(value);

}


boardElement.appendChild(tile);


});


scoreElement.textContent=score;


}



function getColor(value){

let colors={

2:"#1e90ff",
4:"#0066ff",
8:"#7b2cff",
16:"#b026ff",
32:"#ff0080",
64:"#ff0055",
128:"#00eaff",
256:"#00ff99",
512:"#ffff00",
1024:"#ff9900",
2048:"#ffffff"

};


return colors[value] || "#fff";

}




function slide(row){


let filtered=row.filter(x=>x);


for(let i=0;i<filtered.length-1;i++){


if(filtered[i]===filtered[i+1]){


filtered[i]*=2;

score+=filtered[i];


filtered.splice(i+1,1);


}


}


while(filtered.length<4)

filtered.push(0);


return filtered;

}





function moveLeft(){

let old=JSON.stringify(board);


for(let r=0;r<4;r++)

board[r]=slide(board[r]);



if(old!==JSON.stringify(board)){

addTile();

draw();

checkWin();

}


}



function rotate(){

board=
board[0].map((_,i)=>
board.map(row=>row[i]).reverse()
);

}



function moveRight(){

rotate();

rotate();

moveLeft();

rotate();

rotate();

}



function moveUp(){

rotate();

rotate();

rotate();

moveLeft();

rotate();

}



function moveDown(){

rotate();

moveLeft();

rotate();

rotate();

rotate();

}




document.addEventListener(
"keydown",
e=>{


if(e.key==="ArrowLeft")
moveLeft();


if(e.key==="ArrowRight")
moveRight();


if(e.key==="ArrowUp")
moveUp();


if(e.key==="ArrowDown")
moveDown();


});




function checkWin(){

if(board.flat().includes(2048)){

message.textContent=
"You Win! 🎉";

}

}



restart.onclick=start;


start();
