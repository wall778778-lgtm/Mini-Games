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
        size:25,
        velocity:0
    };


    obstacles = [];

    gravity = 1;

    score = 0;

    gameRunning = true;

    resultCard.classList.add("hidden");

    requestAnimationFrame(gameLoop);
}



function createObstacle(){

    obstacles.push({

        x:400,
        y:Math.random()*450+50,
        width:40,
        height:120

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
            ob.y
        );


        ctx.fillRect(
            ob.x,
            ob.y+ob.height,
            ob.width,
            canvas.height
        );

    });

}



function update(){

    if(!gameRunning) return;


    player.velocity += gravity * 0.3;

    player.y += player.velocity;


    obstacles.forEach(ob=>{

        ob.x -= 3;


        if(
            player.x + player.size > ob.x &&
            player.x - player.size < ob.x + ob.width &&
            (
                player.y - player.size < ob.y ||
                player.y + player.size > ob.y + ob.height
            )
        ){

            endGame();

        }


    });


    obstacles =
    obstacles.filter(ob=>ob.x>-50);



    if(Math.random()<0.02){
        createObstacle();
    }


    score++;

    scoreText.textContent =
    Math.floor(score/10);



    if(player.y < 0 || player.y > canvas.height){
        endGame();
    }

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

        player.velocity = -gravity * 5;

    }

}



function endGame(){

    gameRunning=false;

    resultTitle.textContent="💥 Game Over";

    resultScore.textContent=
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