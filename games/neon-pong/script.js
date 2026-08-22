const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerScoreText = document.getElementById("playerScore");
const aiScoreText = document.getElementById("aiScore");
const restart = document.getElementById("restart");
const message = document.getElementById("message");


let player;
let ai;
let ball;

let particles = [];
let trail = [];

let playerScore = 0;
let aiScore = 0;

let keys = {};

let loop;



function startGame(){

    player = {
        x:20,
        y:160,
        width:12,
        height:80
    };


    ai = {
        x:568,
        y:160,
        width:12,
        height:80
    };


    ball = {
        x:300,
        y:200,
        radius:8,
        speed:6,
        vx:6,
        vy:3
    };


    particles=[];
    trail=[];


    playerScore=0;
    aiScore=0;


    updateScore();

    message.textContent="";


    clearInterval(loop);

    loop=setInterval(update,16);

}




function resetBall(){

    ball.x=300;
    ball.y=200;

    ball.speed=6;


    ball.vx =
    Math.random()>0.5 ? 6 : -6;


    ball.vy =
    (Math.random()-0.5)*7;

}





function update(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    movePlayer();

    moveAI();



    ball.x += ball.vx;

    ball.y += ball.vy;



    // ball trail

    trail.push({

        x:ball.x,

        y:ball.y

    });


    if(trail.length>18)

        trail.shift();





    // walls

    if(
        ball.y-ball.radius <=0 ||
        ball.y+ball.radius >=canvas.height
    ){

        ball.vy *= -1;

    }




    // player collision

    if(

        ball.x-ball.radius <
        player.x+player.width &&

        ball.y >
        player.y &&

        ball.y <
        player.y+player.height

    ){

        hitPaddle(player);

    }





    // AI collision

    if(

        ball.x+ball.radius >
        ai.x &&

        ball.y >
        ai.y &&

        ball.y <
        ai.y+ai.height

    ){

        hitPaddle(ai);

    }





    // scoring

    if(ball.x<0){

        aiScore++;

        updateScore();

        resetBall();

    }



    if(ball.x>canvas.width){

        playerScore++;

        updateScore();

        resetBall();

    }





    // particles update

    particles.forEach(p=>{

        p.x += p.vx;

        p.y += p.vy;

        p.life--;

    });



    particles =
    particles.filter(
        p=>p.life>0
    );



    draw();

}







function hitPaddle(paddle){


    let relativeIntersect =
    (ball.y -
    (paddle.y+paddle.height/2))
    /
    (paddle.height/2);



    relativeIntersect =
    Math.max(
        -1,
        Math.min(
            1,
            relativeIntersect
        )
    );



    let maxAngle =
    Math.PI/3;



    let angle =
    relativeIntersect *
    maxAngle;



    let speed =
    Math.sqrt(
        ball.vx*ball.vx+
        ball.vy*ball.vy
    );



    let direction =
    ball.vx>0 ? -1 : 1;



    ball.vx =
    Math.cos(angle)
    *speed
    *direction;



    ball.vy =
    Math.sin(angle)
    *speed;



    ball.vx *=1.05;

    ball.vy *=1.05;



    createParticles(
        ball.x,
        ball.y
    );


}







function movePlayer(){


    if(keys.up && player.y>0)

        player.y-=7;



    if(keys.down && player.y<320)

        player.y+=7;


}







function moveAI(){


    let target =
    ball.y -
    ai.height/2;



    ai.y +=
    (target-ai.y)*0.035;


}







function draw(){


    // trail

    trail.forEach((p,i)=>{


        ctx.globalAlpha =
        (i/trail.length)*0.5;


        ctx.fillStyle="#00eaff";


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y,
            5,
            0,
            Math.PI*2
        );


        ctx.fill();


    });



    ctx.globalAlpha=1;



    ctx.shadowBlur=20;



    // player

    ctx.shadowColor="#00ff99";

    ctx.fillStyle="#00ff99";


    ctx.fillRect(

        player.x,

        player.y,

        player.width,

        player.height

    );




    // AI

    ctx.shadowColor="#ff3366";

    ctx.fillStyle="#ff3366";


    ctx.fillRect(

        ai.x,

        ai.y,

        ai.width,

        ai.height

    );





    // ball

    ctx.shadowColor="white";

    ctx.fillStyle="white";


    ctx.beginPath();


    ctx.arc(

        ball.x,

        ball.y,

        ball.radius,

        0,

        Math.PI*2

    );


    ctx.fill();



    ctx.shadowBlur=0;




    // particles


    particles.forEach(p=>{


        ctx.fillStyle=p.color;


        ctx.fillRect(

            p.x,

            p.y,

            4,

            4

        );


    });



}







function createParticles(x,y){


    for(let i=0;i<12;i++){


        particles.push({

            x:x,

            y:y,

            color:"#00eaff",

            vx:(Math.random()-0.5)*6,

            vy:(Math.random()-0.5)*6,

            life:25

        });


    }


}







function updateScore(){

    playerScoreText.textContent=
    playerScore;


    aiScoreText.textContent=
    aiScore;


}







document.addEventListener(
"keydown",
e=>{


    if(e.key==="ArrowUp")

        keys.up=true;


    if(e.key==="ArrowDown")

        keys.down=true;


});





document.addEventListener(
"keyup",
e=>{


    if(e.key==="ArrowUp")

        keys.up=false;


    if(e.key==="ArrowDown")

        keys.down=false;


});






canvas.addEventListener(
"touchmove",
e=>{


    let rect =
    canvas.getBoundingClientRect();


    let y =
    e.touches[0].clientY
    -
    rect.top;



    player.y =
    y-player.height/2;


});






restart.onclick=startGame;


startGame();
