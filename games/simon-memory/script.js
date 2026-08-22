const colors = [
"red",
"blue",
"green",
"yellow"
];


let sequence=[];

let playerSequence=[];

let round=0;

let playing=false;


const roundText =
document.getElementById("round");

const message =
document.getElementById("message");

const startButton =
document.getElementById("start");





function startGame(){

sequence=[];

round=0;

roundText.textContent=0;

message.textContent="Watch the pattern";

playing=false;

nextRound();

}




function nextRound(){


playerSequence=[];

round++;


roundText.textContent=round;


let random =
colors[
Math.floor(Math.random()*4)
];


sequence.push(random);



showSequence();


}





function showSequence(){


let i=0;


let timer=setInterval(()=>{


flash(sequence[i]);


i++;


if(i>=sequence.length){


clearInterval(timer);


setTimeout(()=>{

playing=true;

message.textContent=
"Your turn!";


},500);


}


},700);



}






function flash(color){


let button =
document.getElementById(color);


button.classList.add("active");


setTimeout(()=>{


button.classList.remove("active");


},350);


}







colors.forEach(color=>{


document.getElementById(color)
.onclick=()=>{


if(!playing)
return;



playerSequence.push(color);


let index =
playerSequence.length-1;



if(
playerSequence[index]
!== sequence[index]
){


gameOver();


return;


}




if(
playerSequence.length
===
sequence.length
){


playing=false;


setTimeout(nextRound,800);


}


};



});






function gameOver(){


message.textContent=
"Wrong! Game Over";


sequence=[];


round=0;


roundText.textContent=0;


playing=false;


}





startButton.onclick=startGame;