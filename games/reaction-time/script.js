const start = document.getElementById("start");

const game = document.getElementById("game");

const result = document.getElementById("result");



let startTime;

let timeout;



let waiting = false;



start.onclick = () => {


result.textContent="";


game.style.background="#22283a";


game.textContent="WAIT...";


waiting=true;



timeout=setTimeout(()=>{


game.style.background="#00c853";


game.textContent="CLICK!";


startTime=Date.now();


},Math.random()*3000+1000);



};



game.onclick=()=>{


if(!waiting)
return;



if(startTime){


let reaction=Date.now()-startTime;


result.textContent=
`Your reaction: ${reaction} ms`;


game.textContent="Click Start Again";


game.style.background="#22283a";


waiting=false;


startTime=null;



}
else{


clearTimeout(timeout);


result.textContent=
"Too early!";


game.textContent="Try again";


waiting=false;


}


};