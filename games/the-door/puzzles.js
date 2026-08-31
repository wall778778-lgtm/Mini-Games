let currentPuzzle = null;


function generatePuzzle(level){


let answer =
Math.floor(Math.random()*4);



let symbols = [
"△",
"○",
"□",
"☆"
];



let doors=[];



for(let i=0;i<4;i++){


doors.push({

number:i+1,

symbol:symbols[i],

text:"",

correct:false

});


}




doors[answer].correct=true;




if(level<=3){


doors[answer].text =
"I am the correct door.";


for(let i=0;i<4;i++){

if(i!==answer){

doors[i].text =
"I am not the correct door.";

}

}



}

else{


doors[0].text =
"The answer is not Door 1.";


doors[1].text =
"The triangle is not correct.";


doors[2].text =
"The correct door is Door "+(answer+1)+".";


doors[3].text =
"Look carefully.";

}




currentPuzzle={

rule:
"Find the correct door.",

doors:doors,

answer:answer

};



return currentPuzzle;


}






function getPuzzleText(){


if(!currentPuzzle)
return "";



let text =
currentPuzzle.rule+
"\n\n";



for(let d of currentPuzzle.doors){


text+=

"Door "+
d.number+
" "+
d.symbol+
"\n"+
d.text+
"\n\n";


}



return text;


}




function checkAnswer(number){


return (
number===currentPuzzle.answer
);


}
