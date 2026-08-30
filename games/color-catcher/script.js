const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");

const restartButton = document.getElementById("restartButton");


const colors = [
    {
        name: "red",
        value: "#ef4444"
    },
    {
        name: "blue",
        value: "#3b82f6"
    },
    {
        name: "green",
        value: "#22c55e"
    },
    {
        name: "yellow",
        value: "#facc15"
    }
];


let player;
let ball;

let score;
let lives;

let left;
let right;

let speed;

let running;

let timer;



function startGame(){

    player = {

        x: 260,

        y: 520,

        width: 50,

        height: 20,

        speed: 8

    };


    ball = null;


    score = 0;

    lives = 3;


    speed = 3;


    left = false;

    right = false;


    timer = 0;


    running = true;


    resultCard.classList.add("hidden");


    updateUI();


    requestAnimationFrame(gameLoop);

}



function createBall(){

    let index =
    Math.floor(Math.random()*4);


    ball = {

        x:
        index * 150 + 75,

        y: -20,

        radius: 15,

        color:
        colors[index],

        zone:index

    };

}



function update(){

    if(!running)
        return;


    // movement

    if(left)
        player.x -= player.speed;


    if(right)
        player.x += player.speed;



    if(player.x < 0)
        player.x = 0;


    if(player.x + player.width > 600)
        player.x = 600-player.width;



    // create balls

    if(!ball){

        timer++;

        if(timer > 40){

            createBall();

            timer=0;

        }

    }



    if(ball){

        ball.y += speed;



        if(
            ball.y + ball.radius >= player.y &&
            ball.x > player.x &&
            ball.x < player.x + player.width
        ){

            let zone =
            Math.floor(ball.x / 150);



            if(zone === ball.zone){

                score++;

                speed += 0.15;

            }
            else{

                loseLife();

            }


            ball=null;

        }



        if(ball && ball.y > 600){

            loseLife();

            ball=null;

        }


    }


    updateUI();

}



function loseLife(){

    lives--;


    if(lives <=0){

        endGame();

    }

}



function updateUI(){

    scoreElement.textContent=score;

    livesElement.textContent=
    "❤️".repeat(lives);

}



function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // background

    ctx.fillStyle="#0f172a";

    ctx.fillRect(
        0,
        0,
        600,
        600
    );



    // zones

    for(let i=0;i<4;i++){

        ctx.fillStyle=
        colors[i].value;


        ctx.globalAlpha=0.3;


        ctx.fillRect(
            i*150,
            560,
            150,
            40
        );


        ctx.globalAlpha=1;


        ctx.fillStyle="white";

        ctx.font="18px Arial";

        ctx.fillText(
            colors[i].name,
            i*150+50,
            585
        );

    }



    // catcher

    ctx.fillStyle="#ffffff";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );



    // ball

    if(ball){

        ctx.beginPath();

        ctx.fillStyle=
        ball.color.value;


        ctx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI*2
        );


        ctx.fill();

    }


}



function gameLoop(){

    update();

    draw();


    if(running)
        requestAnimationFrame(gameLoop);

}



function endGame(){

    running=false;


    resultTitle.textContent=
    "💥 Game Over";


    resultScore.textContent=
    "Score: "+score;


    resultCard.classList.remove("hidden");

}



document.addEventListener(
"keydown",
e=>{

    if(e.key==="ArrowLeft" || e.key==="a")
        left=true;


    if(e.key==="ArrowRight" || e.key==="d")
        right=true;

});



document.addEventListener(
"keyup",
e=>{

    if(e.key==="ArrowLeft" || e.key==="a")
        left=false;


    if(e.key==="ArrowRight" || e.key==="d")
        right=false;

});



canvas.addEventListener(
"touchmove",
e=>{

    let rect =
    canvas.getBoundingClientRect();


    let x =
    e.touches[0].clientX - rect.left;


    player.x =
    x - player.width/2;

});



restartButton.onclick=startGame;


startGame();
