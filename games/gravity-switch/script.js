const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");


let player;
let obstacles;
let gravity;
let score;
let gameRunning;


function startGame(){

    player = {
        x:80,
        y:300,
        size:20,
        velocity:0
    };


    obstacles = [];

    gravity = 0.35;

    score = 0;

    gameRunning = true;

    resultCard.classList.add("hidden");

    requestAnimationFrame(gameLoop);
}



function createObstacle(){

    let gap = 180;

    let topHeight =
    Math.random() * 250 + 50;


    obstacles.push({

        x:420,

        top:topHeight,

        bottom:
        canvas.height - topHeight - gap,

        width:45,

        speed:3

    });

}



function drawPlayer(){

    ctx.fillStyle="#22d3ee";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.size,
        0,
        Math.PI*2
    );

    ctx.fill();

}



function drawObstacles(){

    ctx.fillStyle="#ef4444";

    obstacles.forEach(ob=>{

        ctx.fillRect(
            ob.x,
            0,
            ob.width,
            ob.top
        );


        ctx.fillRect(
            ob.x,
            canvas.height-ob.bottom,
            ob.width,
            ob.bottom
        );

    });

}



function update(){

    if(!gameRunning) return;


    // gravity movement
    player.velocity += gravity;

    player.y += player.velocity;



    // touching floor or ceiling is allowed

    if(player.y < player.size){

        player.y = player.size;
        player.velocity = 0;

    }


    if(player.y > canvas.height-player.size){

        player.y =
        canvas.height-player.size;

        player.velocity = 0;

    }



    obstacles.forEach(ob=>{


        ob.x -= ob.speed;



        // obstacle pushes player left

        if(
            player.x + player.size > ob.x &&
            player.x - player.size < ob.x + ob.width
        ){

            if(
                player.y - player.size < ob.top ||
                player.y + player.size > canvas.height-ob.bottom
            ){

                player.x -= 2;

            }

        }


    });



    obstacles =
    obstacles.filter(ob=>ob.x>-100);



    if(Math.random()<0.015){

        createObstacle();

    }



    // only losing condition

    if(player.x <= 0){

        endGame();

    }



    score++;

    scoreText.textContent =
    Math.floor(score/10);

}



function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawPlayer();

    drawObstacles();

}



function gameLoop(){

    update();

    draw();


    if(gameRunning){

        requestAnimationFrame(gameLoop);

    }

}



function switchGravity(){

    if(gameRunning){

        gravity *= -1;

        player.velocity =
        gravity * 8;

    }

}



function endGame(){

    gameRunning=false;

    resultTitle.textContent="💥 Crashed!";

    resultScore.textContent =
    "Score: " + Math.floor(score/10);

    resultCard.classList.remove("hidden");

}



function restartGame(){

    startGame();

}



document.addEventListener(
"keydown",
e=>{

    if(e.code==="Space"){

        switchGravity();

    }

});


canvas.addEventListener(
"click",
switchGravity
);


canvas.addEventListener(
"touchstart",
switchGravity
);


startGame();
