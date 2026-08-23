const board =
document.getElementById("board");


const movesText =
document.getElementById("moves");


const timeText =
document.getElementById("time");


const message =
document.getElementById("message");


const restart =
document.getElementById("restart");



let tiles=[];

let empty=8;

let moves=0;

let time=0;

let timer;



const image =
createImage();





function createImage(){


let canvas =
document.createElement("canvas");


canvas.width=300;

canvas.height=300;


let ctx =
canvas.getContext("2d");



// background

let gradient =
ctx.createLinearGradient(
0,
0,
300,
300
);


gradient.addColorStop(
0,
"#050816"
);


gradient.addColorStop(
1,
"#5522aa"
);



ctx.fillStyle=gradient;

ctx.fillRect(
0,
0,
300,
300
);



// planet

ctx.shadowBlur=30;

ctx.shadowColor="#00eaff";


ctx.fillStyle="#00eaff";


ctx.beginPath();


ctx.arc(
150,
160,
70,
0,
Math.PI*2
);


ctx.fill();



// stars

for(let i=0;i<40;i++){

ctx.fillStyle="white";


ctx.fillRect(

Math.random()*300,

Math.random()*300,

2,

2

);


}


ctx.shadowBlur=0;


return canvas.toDataURL();


}







function start(){


board.innerHTML="";


moves=0;

time=0;


movesText.textContent=0;

timeText.textContent=0;


message.textContent="";


clearInterval(timer);


timer=setInterval(()=>{

time++;

timeText.textContent=time;

},1000);





tiles=[];


for(let i=0;i<9;i++){

tiles.push(i);

}



shuffle();



draw();


}






function shuffle(){


for(let i=0;i<100;i++){


let possible=getMoves();


let move=
possible[
Math.floor(Math.random()*possible.length)
];


swap(move,empty);


}



moves=0;


}






function getMoves(){


let result=[];


let row=Math.floor(empty/3);

let col=empty%3;



if(row>0)
result.push(empty-3);


if(row<2)
result.push(empty+3);


if(col>0)
result.push(empty-1);


if(col<2)
result.push(empty+1);


return result;


}







function swap(a,b){


let temp=tiles[a];

tiles[a]=tiles[b];

tiles[b]=temp;


if(tiles[a]===8)

empty=a;


if(tiles[b]===8)

empty=b;


}







function draw(){


board.innerHTML="";


tiles.forEach((tile,index)=>{


let div=document.createElement("div");


div.className="tile";


if(tile===8){

div.classList.add("empty");

}

else{


let x=(tile%3)*-100;

let y=Math.floor(tile/3)*-100;


div.style.backgroundImage=
`url(${image})`;


div.style.backgroundSize="300px 300px";


div.style.backgroundPosition=
`${x}px ${y}px`;


div.onclick=()=>move(index);


}


board.appendChild(div);


});


}







function move(index){


if(
getMoves().includes(index)
){


swap(index,empty);


moves++;

movesText.textContent=moves;


draw();


check();


}



}







function check(){


for(let i=0;i<9;i++){

if(tiles[i]!==i)

return;

}



message.textContent=
"Puzzle Complete 🎉";


clearInterval(timer);


}







restart.onclick=start;


start();
