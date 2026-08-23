const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


const scoreText =
document.getElementById("score");

const message =
document.getElementById("message");

const restart =
document.getElementById("restart");



let blocks=[];

let current;

let direction=1;

let speed=3;

let score=0;

let gameOver=false;



function start(){

    blocks=[];


    blocks.push({

        x:100,
        y:560,
        width:200,
        height:40

    });



    current={

        x:0,

        y:520,

        width:200,

        height:40

    };


    direction=1;

    speed=3; // reset speed every restart


    score=0;

    gameOver=false;


    scoreText.textContent=0;

    message.textContent="";


}




function drop(){


if(gameOver)
return;



let last =
blocks[blocks.length-1];



let left =
Math.max(
current.x,
last.x
);



let right =
Math.min(
current.x+current.width,
last.x+last.width
);



let overlap =
right-left;



if(overlap<=0){

gameOver=true;

message.textContent=
"Tower collapsed 💥";

return;

}




blocks.push({

x:left,

y:last.y-40,

width:overlap,

height:40

});



score++;


scoreText.textContent=score;



// create next block above

current={

x:0,

y:last.y-80,

width:overlap,

height:40

};



}


if(blocks[blocks.length-1].y<=40){

message.textContent=
"🏆 Perfect Tower!";

gameOver=true;

}


}





function update(){


if(gameOver)
return;



current.x+=
direction*speed;



if(
current.x+current.width>
canvas.width ||
current.x<0
){

direction*=-1;

}



}





function draw(){


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);




// blocks

blocks.forEach((b,i)=>{


ctx.shadowBlur=20;

ctx.shadowColor="#00eaff";


ctx.fillStyle=
i%2===0?
"#00eaff":
"#8a2be2";


ctx.fillRect(

b.x,

b.y,

b.width,

b.height

);


});




// moving block


ctx.fillStyle="#00ff99";


ctx.fillRect(

current.x,

current.y,

current.width,

current.height

);



ctx.shadowBlur=0;



}





function animate(){


requestAnimationFrame(animate);


update();

draw();


}





canvas.addEventListener(
"click",
drop
);



canvas.addEventListener(
"touchstart",
drop
);



restart.onclick=start;



start();
